---
title: "Drawing a drug's mechanism of action — asking AI for Mermaid diagrams"
date: 2026-11-12
category: ai
roles: [R&D, Medical affairs, BD, Sales & marketing]
summary: I drew the mechanisms of an ADC, a PD-1×VEGF bispecific and a molecular-glue degrader from past newsletter issues as Mermaid code. A prompt template for AI, three example snippets I rendered to check they work, and the steps I use to compare each diagram with the paper.
---

When I write the newsletter, I often want one picture that shows how a drug works in the body. I can't draw well, and pictures from image-generation AI are even harder to check for scientific accuracy. The approach I settled on is **Mermaid**: you write a diagram as text and it turns into a chart, so I can ask an AI such as ChatGPT or Claude for the code and then check it line by line.

Every Mermaid snippet in this post was rendered to confirm it produces a diagram.

## 1. Three bits of Mermaid syntax

This is based on the official Mermaid documentation, checked on 12 November 2026 [1].

- **Direction:** start with `flowchart LR` (left to right) or `flowchart TD` (top down).
- **Boxes and arrows:** `A["label"] --> B["label"]` joins two boxes with an arrow. A dotted arrow is `-.->`.
- **Text on an arrow:** put it between pipes, as in `A -->|blocks PD-1| B`.
- **One gotcha:** the lowercase word `end` inside a box can break the diagram, so the docs advise capitalising it [1].

## 2. A template for asking the AI

If you let an AI draw a mechanism "from what it knows", plausible steps with no source can slip in. So my template **fixes the source first and keeps the drawing inside it**. You can copy this as it is.

```text
Draw the mechanism of action of [drug] as Mermaid flowchart LR code.
- Source: use only the abstract (or label text) pasted below.
- At most 8 boxes, and keep each line of box text short.
- Don't add steps that aren't in the source; if one is needed, use a dotted arrow.
- Under the code, list the source sentence behind each box.
[paste source text]
```

**My own view:** the last instruction, a source sentence for every box, matters most. A diagram on its own is hard to judge, but paired with sentences it can be checked against the original one box at a time.

## 3. Three examples

### Example 1. Antibody-drug conjugates (ADCs)

Among the candidates Boehringer Ingelheim took options on in [BIO:ON Insight Issue #24](/en/insight/2026-11-10) were ADCs. The general ADC mechanism here comes from a review paper [2].

- The antibody binds an antigen on the cancer cell, and the ADC is taken into the cell and moved to the lysosome.
- In the lysosome the payload (the cytotoxic drug) is released and kills the cell through DNA damage or microtubule inhibition.
- The released payload can also kill neighbouring cancer cells, the "bystander effect" [2].

![ADC mechanism: antigen binding, internalisation, linker cleavage in the lysosome, payload release, cell death, bystander effect](/career/moa-diagrams/adc-en.svg)

```text
flowchart TD
  A["ADC given<br/>antibody + linker + payload"] --> B["Binds antigen on<br/>the cancer cell surface"]
  B --> C["Taken into the cell<br/>(internalisation)"]
  C --> D["Linker cleaved<br/>in the lysosome"]
  D --> E["Payload released"]
  E --> F["DNA damage or<br/>microtubule inhibition"]
  F --> G["Cancer cell dies"]
  E -.-> H["Spreads to nearby cells<br/>(bystander effect)"]
```

**What checking showed:** this diagram shows a single "internalisation → lysosome" route. Another review explains that, depending on the linker and payload, an ADC can also be cleaved outside the cell and still cause bystander killing [3]. The simpler the diagram, the easier it is for exceptions like this to drop out.

### Example 2. A PD-1 × VEGF bispecific (ivonescimab)

Ivonescimab, covered in [BIO:ON Insight Issue #14](/en/insight/2026-09-01), is a tetravalent bispecific antibody that blocks both PD-1 and VEGF [4].

- It works along two lines: blocking PD-1 releases immune suppression on T cells, and blocking VEGF inhibits new tumour blood vessels [4].
- The company reported "cooperative binding" in vitro, with stronger PD-1 binding when VEGF is present [4].

![Ivonescimab mechanism: PD-1 blockade, VEGF blockade, and cooperative binding from company in vitro data](/career/moa-diagrams/bsab-en.svg)

```text
flowchart LR
  I["Ivonescimab<br/>tetravalent PD-1 × VEGF bispecific"] -->|blocks PD-1| T["Releases the immune<br/>brake on T cells"]
  I -->|blocks VEGF| V["Inhibits new<br/>tumour blood vessels"]
  I -.->|company in vitro data| C["Binds PD-1 more strongly<br/>when VEGF is present<br/>(cooperative binding)"]
```

**What checking showed:** cooperative binding comes from in vitro data released by the company. Drawn with the same solid line as the other arrows, it would look like evidence of the same standing, so I made it dotted and labelled what kind of evidence it is.

### Example 3. A molecular-glue degrader (CELMoD)

As an example of the "molecular glue" class covered in [BIO:ON Insight Issue #12](/en/insight/2026-08-18), I drew the cereblon modulator iberdomide (CC-220) from a paper's abstract [5].

- The drug binds cereblon, part of the CRL4-CRBN E3 ligase.
- The E3 ligase then recruits the transcription factors Ikaros and Aiolos, tags them with ubiquitin, and they are degraded [5].

![Iberdomide mechanism: cereblon binding, recruiting Ikaros and Aiolos, ubiquitination, proteasomal degradation](/career/moa-diagrams/glue-en.svg)

```text
flowchart TD
  D["Iberdomide<br/>(CELMoD, molecular glue)"] --> CR["Binds cereblon (CRBN)<br/>part of the CRL4 E3 ligase"]
  CR --> S["Recruits Ikaros and Aiolos<br/>to the E3 ligase"]
  S --> U["Tagged with ubiquitin"]
  U --> P["Degraded by<br/>the proteasome"]
```

**What checking showed:** the abstract goes as far as "ubiquitination and degradation" and never mentions the proteasome [5]. That ubiquitinated proteins are broken down by the proteasome is textbook biology, but strictly it's a step outside the source text. For an assignment, I think that step should carry its own citation.

## 4. Checklist for comparing a diagram with the source

A diagram from an AI can look clean and still be scientifically wrong, so after drawing I check in this order. I wrote up how to check sources in [my checklist for checking AI answers](/en/career/checking-ai-answers).

1. **Every arrow has a source:** remove arrows with no source sentence, or make them dotted.
2. **The direction is right:** check that "inhibits" and "activates", or "binds" and "degrades", haven't been swapped.
3. **The level of evidence is marked:** separate peer-reviewed papers, label documents, company announcements and in vitro data.
4. **No exception has dropped out:** if there's another route, as in Example 1, add a line to the text.
5. **Put it next to the figure in the paper or label:** if the number or order of steps differs a lot, check again.

## 5. Image-generation tools: concept illustrations only

Image tools such as Higgsfield are useful for setting the mood of a slide. But they don't guarantee scientific accuracy, so I don't use them to explain a mechanism, and if I use one at all I label it **"concept illustration (AI-generated)"**.

In February 2024, the journal Frontiers in Cell and Developmental Biology retracted a paper whose Midjourney-generated figures were inaccurate and carried nonsense labels. The publisher stressed that disclosing generative AI use doesn't replace the requirement for figures to be accurate [6].

## What I've learned

The biggest strength of Mermaid is that the diagram **is text, so it can be reviewed line by line**. Comparing the three examples, the more common trap wasn't an AI error but drawing evidence of different standing with the same solid line. If I'm asked to explain a mechanism in an interview, I think being able to say "what's the source for this arrow?" is more convincing than memorising the picture.

## Sources

1. [Mermaid documentation — Flowcharts Syntax (checked 12 November 2026)](https://mermaid.js.org/syntax/flowchart.html)
2. [Jin Y, et al. Stepping forward in antibody-drug conjugate development. Pharmacology & Therapeutics. 2021](https://consensus.app/papers/details/w:fe1cbd3e-4c85-4b29-b3ea-30d5f4adbb0d/)
3. [Staudacher AH, et al. Antibody drug conjugates and bystander killing: is antigen-dependent internalisation required? British Journal of Cancer. 2017](https://consensus.app/papers/details/w:e0f6c3f4-0276-4de0-aa57-cba94727cc2d/)
4. [Summit Therapeutics — Ivonescimab Overview](https://www.smmttx.com/?p=213)
5. [Matyskiela ME, et al. A Cereblon Modulator (CC-220) with Improved Degradation of Ikaros and Aiolos. Journal of Medicinal Chemistry. 2017](https://consensus.app/papers/details/w:f9efdae0-46f2-4f53-bc4a-b706bccaa13d/)
6. [Popular Science — A ridiculous AI-generated rat penis made it into a peer-reviewed journal (2024)](https://www.popsci.com/technology/ai-rat-journal/)
