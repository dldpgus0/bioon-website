# Turns the BIO:ON logo PNGs (dark artwork on an off-white canvas) into tightly cropped,
# transparent web assets in public/brand/.
#   powershell -ExecutionPolicy Bypass -File scripts/prepare-logos.ps1
# Sources are ASCII-named copies of the newsletter logo files, because Windows PowerShell
# mangles non-ASCII paths inside script files.
param(
  [string]$Horizontal = (Join-Path $PSScriptRoot "..\brand-src\logo-horizontal-src.png"),
  [string]$Vertical = (Join-Path $PSScriptRoot "..\brand-src\logo-vertical-src.png")
)

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class LogoTool {
  // Un-mixes each pixel from the background colour: alpha = how far it is from bg,
  // colour = what it must have been before being blended over bg.
  public static Bitmap RemoveBackground(Bitmap src, out Rectangle bounds, Rectangle region) {
    var bmp = src.Clone(region, PixelFormat.Format32bppArgb);
    var rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
    var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
    var px = new byte[data.Stride * bmp.Height];
    Marshal.Copy(data.Scan0, px, 0, px.Length);

    // Sample the background from the four corners.
    double br = 0, bg = 0, bb = 0; int n = 0;
    foreach (var p in new[] { new[]{4,4}, new[]{bmp.Width-5,4}, new[]{4,bmp.Height-5}, new[]{bmp.Width-5,bmp.Height-5} }) {
      int i = p[1] * data.Stride + p[0] * 4;
      bb += px[i]; bg += px[i+1]; br += px[i+2]; n++;
    }
    br /= n; bg /= n; bb /= n;

    int minX = bmp.Width, minY = bmp.Height, maxX = -1, maxY = -1;
    for (int y = 0; y < bmp.Height; y++) {
      for (int x = 0; x < bmp.Width; x++) {
        int i = y * data.Stride + x * 4;
        double b = px[i], g = px[i+1], r = px[i+2];
        double a = Math.Max(Math.Max(1 - r / br, 1 - g / bg), 1 - b / bb);
        a = Math.Max(0, Math.Min(1, (a - 0.05) / 0.95)); // drop paper texture noise
        if (a <= 0) { px[i+3] = 0; continue; }
        px[i+2] = Clamp((r - (1 - a) * br) / a);
        px[i+1] = Clamp((g - (1 - a) * bg) / a);
        px[i]   = Clamp((b - (1 - a) * bb) / a);
        px[i+3] = Clamp(a * 255);
        if (a > 0.25) {
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    Marshal.Copy(px, 0, data.Scan0, px.Length);
    bmp.UnlockBits(data);
    bounds = Rectangle.FromLTRB(minX, minY, maxX + 1, maxY + 1);
    return bmp;
  }

  static byte Clamp(double v) { return (byte)Math.Max(0, Math.Min(255, Math.Round(v))); }

  public static void Save(Bitmap bmp, Rectangle crop, int pad, int targetWidth, string path) {
    crop.Inflate(pad, pad);
    crop.Intersect(new Rectangle(0, 0, bmp.Width, bmp.Height));
    int h = (int)Math.Round(crop.Height * (double)targetWidth / crop.Width);
    using (var outBmp = new Bitmap(targetWidth, h, PixelFormat.Format32bppArgb))
    using (var gfx = Graphics.FromImage(outBmp)) {
      gfx.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
      gfx.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
      gfx.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;
      gfx.DrawImage(bmp, new Rectangle(0, 0, targetWidth, h), crop, GraphicsUnit.Pixel);
      outBmp.Save(path, ImageFormat.Png);
    }
  }
}
"@

$out = (Resolve-Path (Join-Path $PSScriptRoot "..\public\brand")).Path
$bounds = [System.Drawing.Rectangle]::Empty

$h = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Horizontal).Path)
$clean = [LogoTool]::RemoveBackground($h, [ref]$bounds, (New-Object System.Drawing.Rectangle 0, 0, $h.Width, $h.Height))
[LogoTool]::Save($clean, $bounds, 8, 640, (Join-Path $out "logo-horizontal.png"))
"horizontal: $bounds"
$clean.Dispose(); $h.Dispose()

$v = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Vertical).Path)
$clean = [LogoTool]::RemoveBackground($v, [ref]$bounds, (New-Object System.Drawing.Rectangle 0, 0, $v.Width, $v.Height))
[LogoTool]::Save($clean, $bounds, 8, 480, (Join-Path $out "logo-vertical.png"))
"vertical: $bounds"
$clean.Dispose()

# Symbol only (DNA + magnifier) from the top of the vertical logo, for the favicon.
$mark = [LogoTool]::RemoveBackground($v, [ref]$bounds, (New-Object System.Drawing.Rectangle 0, 0, $v.Width, 600))
[LogoTool]::Save($mark, $bounds, 12, 256, (Join-Path $out "logo-mark.png"))
"mark: $bounds"
$mark.Dispose(); $v.Dispose()

# Square favicon: the symbol centred on a transparent 256x256 canvas.
$m = [System.Drawing.Bitmap]::FromFile((Join-Path $out "logo-mark.png"))
$icon = New-Object System.Drawing.Bitmap 256, 256
$gfx = [System.Drawing.Graphics]::FromImage($icon)
$gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$w = [int](248 * $m.Width / $m.Height)
$gfx.DrawImage($m, [int]((256 - $w) / 2), 4, $w, 248)
$gfx.Dispose(); $m.Dispose()
$icon.Save((Resolve-Path (Join-Path $PSScriptRoot "..\src\app")).Path + "\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$icon.Dispose()
"icon: 256x256"
