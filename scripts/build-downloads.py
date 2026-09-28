"""Builds the file-based lead-magnet downloads in src/content/downloads/:
  - pipeline-deal-tracker.xlsx  (Pipeline & Deal Tracker)
  - cv-template.docx            (English CV template, ATS-friendly)

  python3 scripts/build-downloads.py

Example rows use only publicly reported facts, each with its source URL in the row.
Requires openpyxl and python-docx.
"""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, RGBColor
from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUT = Path(__file__).resolve().parent.parent / "src" / "content" / "downloads"
CHECKED = "2026-09-28"

FONT = "Arial"
NAVY = "132A4C"
INPUT_FILL = PatternFill("solid", fgColor="FFF59D")  # yellow = cells to fill in
HEAD_FILL = PatternFill("solid", fgColor=NAVY)
EXAMPLE_FILL = PatternFill("solid", fgColor="EEF3F8")
THIN = Side(style="thin", color="C9D3DF")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


def font(**kw):
    return Font(name=FONT, **kw)


def header_row(ws, row, headers, widths):
    for i, (h, w) in enumerate(zip(headers, widths), start=1):
        c = ws.cell(row=row, column=i, value=h)
        c.font = font(bold=True, color="FFFFFF", size=10)
        c.fill = HEAD_FILL
        c.alignment = Alignment(wrap_text=True, vertical="center")
        c.border = BOX
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[row].height = 32


def body_cell(c, fill=None, wrap=True):
    c.font = font(size=10)
    c.alignment = Alignment(wrap_text=wrap, vertical="top")
    c.border = BOX
    if fill:
        c.fill = fill


def title(ws, text, sub):
    ws["A1"] = text
    ws["A1"].font = font(bold=True, size=14, color=NAVY)
    ws["A2"] = sub
    ws["A2"].font = font(size=10, color="5B6B82")


def build_xlsx():
    wb = Workbook()

    # ---------- How to use ----------
    ws = wb.active
    ws.title = "How to use"
    title(ws, "BIO:ON Pipeline & Deal Tracker", "면접 전, 지원 회사의 파이프라인과 딜을 한 장에 정리하는 템플릿 / Map a target company's pipeline and deals before an interview")
    rows = [
        ("", ""),
        ("범례 Legend", ""),
        ("노란 칸 Yellow cells", "직접 입력하는 칸이에요. / Cells you fill in."),
        ("파란 칸 Blue rows", "검증된 공개 정보로 채운 예시 행이에요. 형식을 참고한 뒤 지우세요. / Example rows built from public reports — use them as a format guide, then delete."),
        ("회색 글씨 Formula cells", "수식이 자동 계산해요 (Deals 시트의 총액·확정 비율). / Calculated by formula (Deals: total and guaranteed share)."),
        ("", ""),
        ("쓰는 순서 Steps", ""),
        ("1", "Pipeline 시트: 지원 회사의 핵심 자산 3~5개를 적어요. 회사 IR 자료, ClinicalTrials.gov, 규제기관 발표로 확인하세요. / Pipeline: list 3–5 key assets from the company's investor materials, ClinicalTrials.gov and regulator announcements."),
        ("2", "Competitors 시트: 자산마다 같은 적응증의 경쟁 약물과 차별점을 적어요. / Competitors: for each asset, note rival drugs in the same indication and how it differs."),
        ("3", "Deals 시트: 최근 3년의 기술 도입·이전, 인수합병을 적어요. 계약금과 마일스톤을 따로 적으면 확정 비율이 계산돼요. / Deals: log licensing and M&A from the last three years; entering upfront and milestones separately calculates the guaranteed share."),
        ("4", "Interview prep 시트: '우리 회사 파이프라인 중 아는 것?'에 대한 답을 사실 → 해석 → 내 직무 순서로 써요. / Interview prep: answer 'What do you know about our pipeline?' as fact → interpretation → your role."),
        ("", ""),
        ("출처 규칙 Source rule", "모든 행에 출처 URL과 확인한 날짜를 적어요. 면접에서 숫자를 물어보면 원문으로 답할 수 있어요. / Every row gets a source URL and the date you checked it, so you can back up any number in the interview."),
        ("", ""),
        ("어디서 찾나 Where to look", ""),
        ("ClinicalTrials.gov", "https://clinicaltrials.gov/"),
        ("Drugs@FDA", "https://www.fda.gov/drugs/drug-approvals-and-databases/about-drugsfda"),
        ("의약품안전나라 (MFDS)", "https://nedrug.mfds.go.kr/searchClinic"),
        ("EMA — medicines", "https://www.ema.europa.eu/en/glossary-terms/european-public-assessment-report"),
        ("회사 IR / Company IR", "지원 회사 홈페이지의 Investors·Pipeline 페이지 / The Investors and Pipeline pages on the company's website"),
        ("", ""),
        ("만든 곳 Made by", "BIO:ON Insight · bioon-website.vercel.app — 예시 행 확인일 / Example rows checked: " + CHECKED),
    ]
    for i, (a, b) in enumerate(rows, start=3):
        ws.cell(row=i, column=1, value=a).font = font(bold=bool(a) and not a.isdigit(), size=10)
        cb = ws.cell(row=i, column=2, value=b)
        cb.font = font(size=10)
        cb.alignment = Alignment(wrap_text=True, vertical="top")
    ws["A5"].fill = INPUT_FILL
    ws["A6"].fill = EXAMPLE_FILL
    ws["A7"].font = font(size=10, color="7A8699", bold=True)
    ws.column_dimensions["A"].width = 26
    ws.column_dimensions["B"].width = 110

    # ---------- Lists (for dropdowns) ----------
    lists = wb.create_sheet("Lists")
    stages = ["Discovery", "Preclinical", "Phase 1", "Phase 1/2", "Phase 2", "Phase 3", "Filed / Under review", "Approved", "Clinical stage (phase not disclosed)"]
    modalities = ["Small molecule", "Antibody (mAb)", "Bispecific antibody", "ADC", "Peptide", "Cell therapy", "Gene therapy", "RNA (ASO/siRNA)", "mRNA", "Vaccine", "Other"]
    deal_types = ["License-in", "License-out", "M&A", "Co-development", "Option", "Research collaboration"]
    for col, (name, values) in enumerate([("Stage", stages), ("Modality", modalities), ("Deal type", deal_types)], start=1):
        lists.cell(row=1, column=col, value=name).font = font(bold=True)
        for r, v in enumerate(values, start=2):
            lists.cell(row=r, column=col, value=v).font = font()
        lists.column_dimensions[get_column_letter(col)].width = 34
    lists.sheet_state = "hidden"

    # ---------- Pipeline ----------
    ws = wb.create_sheet("Pipeline")
    title(ws, "Pipeline 파이프라인", "노란 칸에 입력하세요. 파란 행은 예시예요. / Fill the yellow cells; blue rows are examples.")
    headers = ["회사 Company", "자산 Asset", "모달리티 Modality", "표적·기전 Target / MoA", "적응증 Indication", "개발 단계 Stage", "다음 이정표 Next milestone", "파트너 Partner", "출처 Source URL", "확인일 Checked"]
    widths = [20, 16, 18, 30, 28, 20, 26, 22, 48, 12]
    header_row(ws, 4, headers, widths)
    examples = [
        ["Hanmi Pharmaceutical", "HM17321", "Peptide", "Long-acting urocortin-2 (UCN2) analog; non-incretin mechanism", "Obesity — weight loss while preserving lean mass", "Clinical stage (phase not disclosed)", "Licensed to Genentech (Roche) for development worldwide except South Korea", "Genentech (Roche)", "https://www.biospace.com/deals/roche-bets-up-to-2-3b-in-hanmi-pact-for-next-gen-weight-loss-drug", CHECKED],
        ["Nuvalent (acquired by GSK)", "zidesamtinib", "Small molecule", "Next-generation ROS1 inhibitor", "ROS1-positive NSCLC after a prior ROS1 inhibitor", "Approved", "FDA approval July 2026", "GSK", "https://www.pharmtech.com/view/gsk-acquires-nuvalent-for-10-billion-in-lung-cancer-push", CHECKED],
        ["Nuvalent (acquired by GSK)", "neladalkib", "Small molecule", "Next-generation ALK inhibitor", "ALK-positive NSCLC", "Filed / Under review", "FDA target decision date 27 Nov 2026", "GSK", "https://www.gsk.com/en-gb/media/press-releases/gsk-enters-agreement-to-acquire-nuvalent-inc/", CHECKED],
    ]
    r = 5
    for ex in examples:
        for c, v in enumerate(ex, start=1):
            body_cell(ws.cell(row=r, column=c, value=v), EXAMPLE_FILL)
        r += 1
    first_input = r
    for rr in range(r, r + 12):
        for c in range(1, len(headers) + 1):
            body_cell(ws.cell(row=rr, column=c), INPUT_FILL)
    dv_stage = DataValidation(type="list", formula1="=Lists!$A$2:$A$10", allow_blank=True)
    dv_mod = DataValidation(type="list", formula1="=Lists!$B$2:$B$12", allow_blank=True)
    ws.add_data_validation(dv_stage)
    ws.add_data_validation(dv_mod)
    dv_stage.add(f"F5:F{first_input + 11}")
    dv_mod.add(f"C5:C{first_input + 11}")
    ws.freeze_panes = "A5"

    # ---------- Competitors ----------
    ws = wb.create_sheet("Competitors")
    title(ws, "Competitors 경쟁 약물", "자산마다 같은 적응증의 경쟁 약물과 차별점을 비교해요. / Compare each asset with rivals in the same indication.")
    headers = ["우리 자산 Our asset", "경쟁 약물 Competitor", "경쟁사 Company", "경쟁 약물 단계 Stage", "우리 자산의 차별점 How ours differs", "약점·리스크 Weakness / risk", "출처 Source URL", "확인일 Checked"]
    widths = [18, 20, 20, 20, 40, 34, 48, 12]
    header_row(ws, 4, headers, widths)
    ex = ["HM17321", "GLP-1-based obesity drugs", "e.g. Novo Nordisk, Eli Lilly", "Approved", "Aims to reduce fat while preserving lean mass, via a non-incretin (UCN2) mechanism", "Clinical data still early; efficacy vs approved drugs not yet shown", "https://www.biopharmadive.com/news/roche-lean-mass-preservation-hanmi-obesity-deal/828579/", CHECKED]
    for c, v in enumerate(ex, start=1):
        body_cell(ws.cell(row=5, column=c, value=v), EXAMPLE_FILL)
    for rr in range(6, 18):
        for c in range(1, len(headers) + 1):
            body_cell(ws.cell(row=rr, column=c), INPUT_FILL)
    dv_stage2 = DataValidation(type="list", formula1="=Lists!$A$2:$A$10", allow_blank=True)
    ws.add_data_validation(dv_stage2)
    dv_stage2.add("D5:D17")
    ws.freeze_panes = "A5"

    # ---------- Deals ----------
    ws = wb.create_sheet("Deals")
    title(ws, "Deals 딜 이력 (최근 3년)", "금액은 백만 달러($M). 계약금과 마일스톤을 따로 적으면 총액과 확정 비율이 계산돼요. / Amounts in $M; totals and guaranteed share are formulas.")
    headers = ["날짜 Date", "유형 Type", "도입·인수 측 Buyer / licensee", "이전·피인수 측 Seller / licensor", "자산 Asset(s)", "계약금 Upfront ($M)", "마일스톤 Milestones ($M)", "총액 Total ($M)", "확정 비율 Guaranteed share", "로열티 Royalties", "출처 Source URL", "메모 Notes"]
    widths = [11, 16, 22, 22, 26, 14, 16, 14, 14, 20, 48, 34]
    header_row(ws, 4, headers, widths)
    deals = [
        ["2026-06", "M&A", "GSK", "Nuvalent", "zidesamtinib, neladalkib, NVL-330", 10600, 0, "", "", "n/a", "https://www.gsk.com/en-gb/media/press-releases/gsk-enters-agreement-to-acquire-nuvalent-inc/", "All-cash, about $124 per share"],
        ["2026-08", "License-out", "Genentech (Roche)", "Hanmi Pharmaceutical", "HM17321", 190, 2300, "", "", "Yes (terms not disclosed)", "https://www.biospace.com/deals/roche-bets-up-to-2-3b-in-hanmi-pact-for-next-gen-weight-loss-drug", "Worldwide rights except South Korea"],
        ["2026-09", "License-in", "Eli Lilly", "InnoCare", "Up to 5 undisclosed targets", 100, 3250, "", "", "Tiered, single-digit", "https://www.fiercebiotech.com/biotech/eli-lilly-puts-100m-plus-billions-backend-form-5-target-deal-innocare", "Upfront column = upfront plus near-term payments"],
    ]
    r = 5
    for d in deals:
        for c, v in enumerate(d, start=1):
            body_cell(ws.cell(row=r, column=c, value=v), EXAMPLE_FILL)
        r += 1
    last = r + 11
    for rr in range(5, last + 1):
        if rr >= r:
            for c in range(1, len(headers) + 1):
                body_cell(ws.cell(row=rr, column=c), INPUT_FILL)
        # Total and guaranteed share are formulas on every row, examples included.
        t = ws.cell(row=rr, column=8, value=f'=IF(COUNT(F{rr}:G{rr})=0,"",SUM(F{rr}:G{rr}))')
        s = ws.cell(row=rr, column=9, value=f'=IFERROR(F{rr}/H{rr},"")')
        for cell in (t, s):
            body_cell(cell, EXAMPLE_FILL if rr < r else None)
            cell.font = font(size=10, color="44546A")
        for col in (6, 7, 8):
            ws.cell(row=rr, column=col).number_format = '#,##0;(#,##0);"-"'
        s.number_format = "0.0%"
    ws.cell(row=5, column=11).comment = Comment("M&A: whole price entered as upfront; no milestones reported in the source.", "BIO:ON")
    dv_type = DataValidation(type="list", formula1="=Lists!$C$2:$C$7", allow_blank=True)
    ws.add_data_validation(dv_type)
    dv_type.add(f"B5:B{last}")
    ws.freeze_panes = "A5"

    # ---------- Interview prep ----------
    ws = wb.create_sheet("Interview prep")
    title(ws, "Interview prep 면접 답변 준비", "'우리 회사 파이프라인 중 아는 것?'에 사실 → 해석 → 내 직무로 답해요. / Answer as fact → interpretation → your role.")
    headers = ["질문 Question", "사실 Fact (숫자 하나 포함)", "해석 Interpretation (왜 중요한가)", "내 직무 Your role (내가 보탤 것)", "근거 행 Based on (sheet/row)"]
    widths = [30, 40, 40, 40, 20]
    header_row(ws, 4, headers, widths)
    ex = [
        "우리 회사 파이프라인 중 아는 것이 있나요? / What do you know about our pipeline?",
        "한미약품의 HM17321은 로슈(제넨텍)에 계약금 1.9억 달러, 마일스톤 최대 23억 달러로 이전됐습니다.",
        "GLP-1과 다른 기전으로 근육량을 지키며 감량하는 것을 목표로 해, 경쟁이 치열한 비만 시장에서 다른 축으로 차별화한 사례입니다.",
        "BD라면 이런 딜을 총액이 아니라 계약금 비중(약 8%)과 개발 권한 범위로 평가하겠습니다.",
        "Deals!6, Pipeline!5",
    ]
    for c, v in enumerate(ex, start=1):
        body_cell(ws.cell(row=5, column=c, value=v), EXAMPLE_FILL)
    ws.row_dimensions[5].height = 90
    prompts = [
        "우리 회사 파이프라인 중 아는 것이 있나요? / What do you know about our pipeline?",
        "우리 제품의 경쟁 약물은 무엇이라고 보나요? / Who are our product's main competitors?",
        "최근 우리 회사의 딜 중 인상 깊은 것은? / Which of our recent deals stood out to you?",
        "우리 파이프라인의 가장 큰 리스크는? / What's the biggest risk in our pipeline?",
        "입사하면 어떤 자산에 기여하고 싶나요? / Which asset would you most like to work on, and why?",
    ]
    for i, p in enumerate(prompts, start=6):
        body_cell(ws.cell(row=i, column=1, value=p))
        for c in range(2, 6):
            body_cell(ws.cell(row=i, column=c), INPUT_FILL)
        ws.row_dimensions[i].height = 60
    ws.freeze_panes = "A5"

    wb.move_sheet("Lists", offset=5)
    for s in wb.worksheets:
        s.sheet_view.showGridLines = s.title != "How to use"
    out = OUT / "pipeline-deal-tracker.xlsx"
    wb.save(out)
    return out


def build_docx():
    doc = Document()
    st = doc.styles["Normal"]
    st.font.name = FONT
    st.font.size = Pt(10.5)
    for sec in doc.sections:
        sec.top_margin = sec.bottom_margin = Pt(50)
        sec.left_margin = sec.right_margin = Pt(56)

    def para(text="", bold=False, size=None, space_after=2, align=None, color=None):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.space_before = Pt(0)
        if align:
            p.alignment = align
        run = p.add_run(text)
        run.bold = bold
        run.font.name = FONT
        if size:
            run.font.size = Pt(size)
        if color:
            run.font.color.rgb = RGBColor.from_string(color)
        return p

    def heading(text):
        p = para(text.upper(), bold=True, size=11, space_after=3, color=NAVY)
        p.paragraph_format.space_before = Pt(10)
        # Thin rule under the heading, drawn as a paragraph border (text-based, ATS-safe).
        from docx.oxml import OxmlElement
        from docx.oxml.ns import qn
        pPr = p._p.get_or_add_pPr()
        bdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        for k, v in (("w:val", "single"), ("w:sz", "4"), ("w:space", "1"), ("w:color", "8FA3B8")):
            bottom.set(qn(k), v)
        bdr.append(bottom)
        pPr.append(bdr)

    def bullet(text):
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run(text)
        r.font.name = FONT

    para("[FIRST NAME] [LAST NAME]", bold=True, size=18, space_after=2)
    para("[City, Country]  |  [Phone]  |  [Email]  |  [linkedin.com/in/your-profile]", size=10, space_after=6)

    heading("Summary")
    para("[Target role, e.g. Regulatory Affairs] candidate with a [degree] in [subject] from [university]. "
         "Strengths in [skill 1] and [skill 2]. [One differentiator — something you have actually done, e.g. a project or publication].")

    heading("Skills")
    para("Technical: [e.g. cell culture, ELISA, data analysis in R/Python]")
    para("Regulatory & quality: [e.g. ICH-GCP training, GMP awareness, CTD structure]")
    para("Tools: [e.g. Excel, SAS, EDC systems, reference managers]")
    para("Languages: [Korean (native), English (fluent)]")

    heading("Experience")
    para("[Job title] — [Organisation], [City]", bold=True, space_after=0)
    para("[Month Year] – [Month Year]", size=9.5, space_after=2, color="5B6B82")
    bullet("[Action verb] + [what you did] + [result, with a real number]")
    bullet("[Action verb] + [what you did] + [result, with a real number]")
    para("[Job title / project] — [Organisation], [City]", bold=True, space_after=0)
    para("[Month Year] – [Month Year]", size=9.5, space_after=2, color="5B6B82")
    bullet("[Action verb] + [what you did] + [result, with a real number]")

    heading("Education")
    para("[Degree], [Subject] — [University], [City]", bold=True, space_after=0)
    para("[Year] – [Year]  |  [Grade, if strong]", size=9.5, space_after=2, color="5B6B82")
    bullet("[Dissertation or project relevant to the role, in one line]")

    heading("Training & Certifications")
    bullet("[e.g. ICH-GCP training] — [provider], [year]")
    bullet("[e.g. GMP introduction] — [provider], [year]")

    heading("Projects & Publications")
    bullet("[Project, poster or publication] — [one-line description and your role]")

    out = OUT / "cv-template.docx"
    doc.save(out)
    return out


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    print(build_xlsx())
    print(build_docx())
