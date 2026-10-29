---
title: "Scanning prior research with Consensus and Perplexity — intro logic, methods and controls in one table"
date: 2026-10-29
category: ai
roles: [R&D, Clinical development, Medical affairs, BD]
summary: How I use AI search tools to gather candidate papers, then write one row per paper covering intro logic, design, control, primary endpoint and the key number. With a worked example from three phase 3 IgA nephropathy papers and a free Excel summary table.
---

When I prepare an assignment or a newsletter issue, I often start from "what research is out there on this?" For that first step I use **Consensus** and **Perplexity**. Both are handy for getting my bearings, but using them taught me that **the AI summary is only a starting point: you can only compare papers once you open each one and write it up in the same format**. Here's the order I follow and the table I use.

## 1. How I split the two tools

Tool features change often. What follows is based on university library guides and public reviews, checked on 29 October 2026, so it's worth checking each service's own help pages before you rely on it.

- **Consensus:** an AI search engine that only searches academic papers. It finds papers for your question and summarises them, with each point in the summary linked to the paper behind it [1].
  - **Consensus Meter:** for yes/no questions, it shows what share of the top results lean each way [1][2].
  - **The catch:** that share comes only from the set of papers your question retrieved, so it can shift depending on how you phrase the question [2].
- **Perplexity:** an "answer engine" that searches the web and gives answers with sources. It also has an option to focus on academic sources [3].
  - **The catch:** library guides advise checking every source it shows yourself, and citing the original source rather than Perplexity's answer [3][4].

**My own view:** I tend to use Consensus to gather candidate papers, and Perplexity when I also want context from outside the literature, such as news or regulatory background. Either way, the results screen is a reading list, not something I've read.

**Another option:** according to its official guide, Elicit suggests extraction columns for your research question, shows supporting quotes for each cell, and exports the table to CSV [5]. I haven't used it myself, so this is from the docs only.

## 2. One row per paper: the columns

Once I have candidate papers, I fill in the same columns for each one. Using the same columns is what makes the papers comparable later.

- **Intro logic:** background → gap → hypothesis. One line on what's known, what isn't, and so what this study asks.
- **Design:** randomised controlled trial (RCT), cohort, meta-analysis and so on
- **Population and size:** which patients, and how many
- **Intervention and control:** what was compared with what. A placebo comparison means something different from a comparison with existing treatment.
- **Primary endpoint and key result:** always include one number.
- **Limitations:** an interim analysis, a short follow-up and so on
- **Checked in paper:** full text read, abstract only, or not yet

## 3. Worked example: does blocking APRIL reduce proteinuria in IgA nephropathy?

In [BIO:ON Insight Issue #22](/en/insight/2026-10-27), the KG013 antibody Celltrion licensed blocks a protein called APRIL, and its first indication is IgA nephropathy. So I took "how have APRIL-blocking drugs done in the clinic?" as my question and wrote up three phase 3 papers I found with Consensus in the table format. All the numbers below come from each paper's abstract.

1. **Sibeprenlimab phase 3 (VISIONARY, interim analysis)** [6]
   - **Design and population:** RCT; 510 adults with biopsy-confirmed IgA nephropathy, 320 in the interim analysis
   - **Intervention vs control:** sibeprenlimab (blocks APRIL only) 400 mg subcutaneously every 4 weeks vs placebo
   - **Primary endpoint:** 24-hour urine protein-to-creatinine ratio (UPCR) at 9 months
   - **Key result:** -50.2% vs +2.1%, 51.2% lower than placebo
2. **Atacicept phase 3 (ORIGIN 3, interim analysis)** [7]
   - **Design and population:** RCT; 203 patients in the interim analysis
   - **Intervention vs control:** atacicept (blocks both BAFF and APRIL) 150 mg weekly vs placebo
   - **Primary endpoint:** % change in UPCR at week 36
   - **Key result:** -45.7% vs -6.8%
3. **Telitacicept phase 3 (TELIGAN, interim analysis)** [8]
   - **Design and population:** RCT; 318 adults with proteinuria of at least 1.0 g a day
   - **Intervention vs control:** telitacicept (blocks both BAFF and APRIL) 240 mg weekly vs placebo
   - **Primary endpoint:** UPCR at week 39
   - **Key result:** -58.9% vs -8.8%

Putting them side by side showed me a few things.

- **Where they agree:** all three cut proteinuria much more than placebo.
- **Where they differ:** the target (APRIL alone vs BAFF plus APRIL), the dosing interval (every 4 weeks vs weekly) and the timepoint (9 months vs weeks 36 and 39) all differ, so you can't simply rank the numbers.
- **What's still unknown:** all three are interim analyses, so whether lower proteinuria means preserved kidney function long term depends on the final results.

I filled this example from the abstracts only, so the "Checked in paper" column says **"abstract only"**. Before citing any of these in an assignment or report, I think you should open the full paper and check the methods and results tables.

## 4. The rules I stick to

1. **Cite the paper, not the AI screen.** Open the original via its DOI or PubMed ID and check the authors, year and journal. I wrote up how in [my checklist for checking AI answers](/en/career/checking-ai-answers).
2. **Copy numbers from the original.** I don't reuse numbers from an AI summary.
3. **Look at the control first.** The same number means something different against placebo than against existing treatment.
4. **If "Checked in paper" is empty, I don't cite it.**

## Free resource: literature summary table (Excel)

An Excel template with exactly these columns is in the [resources section](/en/resources).

- **Papers sheet:** one row per paper, with dropdowns for design, the tool you found it with, and whether you checked it in the paper.
- **Synthesis sheet:** where the papers agree, where they differ, and what's still unknown.
- **Example rows:** filled in with the three papers above, so you can follow the format and then delete them.

## What I've learned

AI search tools have definitely cut the time I spend finding what to read. But what I can actually say only becomes clear once I've written the papers up in the same format. If an interviewer asks "How do you keep up with research in this area?", I think describing this process, writing papers up consistently and checking them in the original, is more convincing than naming the tools.

## Sources

1. [St. Thomas Libraries Blog — Introducing Consensus: an AI-powered literature review tool (2025)](https://blogs.stthomas.edu/libraries/2025/09/05/introducing-consensus-an-ai-powered-literature-review-tool/)
2. [Aaron Tay — A 2025 Deep Dive of Consensus: Promises and Pitfalls in AI-Powered Academic Search](https://aarontay.substack.com/p/a-2025-deep-dive-of-consensus-promises)
3. [SNHU Academic Resource Center — Introduction to Perplexity AI](https://snhuacademicresourcecenter.screenstepslive.com/a/1933529-introduction-to-perplexity-ai)
4. [University of Florida Business Library — How can Perplexity support college student research while observing academic standards?](https://answers.businesslibrary.uflib.ufl.edu/genai/faq/425586)
5. [Elicit Support — Start a systematic review: Steps 4-5, data extraction and final report](https://support.elicit.com/en/articles/4267649)
6. [Perkovic V, et al. Sibeprenlimab in IgA Nephropathy — Interim Analysis of a Phase 3 Trial. N Engl J Med. 2025 (NCT05248646)](https://consensus.app/papers/details/cfc95f76fa015ef494105f51a5ade3c3/)
7. [Lafayette R, et al. A Phase 3 Trial of Atacicept in Patients with IgA Nephropathy. N Engl J Med. 2025 (NCT04716231)](https://consensus.app/papers/details/5fada89777ca5665b03895c029616bc8/)
8. [Lv J-C, et al. Telitacicept for IgA Nephropathy — Interim Analysis of a Phase 3 Trial. N Engl J Med. 2026 (NCT05799287)](https://consensus.app/papers/details/57aed87c447e528385f6b32667d43b04/)
