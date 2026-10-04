## Why I made this checklist

Ask an AI about a paper or a trial result and the answer usually sounds convincing. The trouble is that **sounding right and being right are different things**. Every BIO:ON piece has to carry its sources, so I check anything I find with AI against the original. This checklist is that checking process, written down.

The items below are based on published research and the official guidance of each database. Sites and features change, so the sources at the end show when I checked them (1 October 2026).

## Why check at all: the numbers

- **References in medical writing:** in one study, ChatGPT (GPT-3.5) was asked to write 30 short medical papers. Of the 115 references it produced, **47% did not exist** and 46% were real but inaccurate. Only **7%** were both real and accurate [1].
- **Differences between model versions:** another study had ChatGPT write 84 short literature reviews on 42 topics. Of 636 citations, **55%** of GPT-3.5's and **18%** of GPT-4's were fabricated. Even among citations to real papers, 43% (GPT-3.5) and 24% (GPT-4) had substantive errors [2].

**What I've learned:** newer models make fewer mistakes, but not zero. So rather than deciding a model is "trustworthy", I think the habit that matters is **checking the original every time**.

## 1. Checking paper citations

- [ ] **If there's a DOI, open it.** Type `https://doi.org/` followed by the DOI. A badly formatted or non-existent DOI won't take you to the paper [3].
- [ ] **If there's no DOI, search PubMed.** Use PubMed's **Single Citation Matcher** and fill in only what you know: journal, year, author [4].
- [ ] **Match the details.** Real papers are often cited with the wrong title, authors, year or journal [1][2]. Check all four.
- [ ] **Match the content.** Make sure what the AI says "the paper found" is actually in the abstract or full text.
- [ ] **Check for retractions.** Crossref acquired the Retraction Watch database in 2023 and made it free for everyone [5]. Don't build an argument on a retracted paper.

## 2. Checking clinical trial claims

- [ ] **Check the NCT number.** Every trial registered on ClinicalTrials.gov has a unique ID in the format **"NCT" + eight digits** [6]. Search the number the AI gave you and see whether a real record comes up.
- [ ] **Match the design.** Compare the primary outcome, comparator (placebo or standard of care), phase and status with the AI's description.
- [ ] **Check "results are out" claims.** See whether the record has a results tab; if not, look for the paper or the company's press release. ClinicalTrials.gov results show the data only, **with no interpretation or conclusions** [7].
- [ ] **Check approvals with the regulator.** For "approved by the FDA" and similar claims, go to the FDA, EMA or MFDS announcement itself. The **Clinical Trial & Approval Data Guide** in the same resource library shows how.

## 3. Checking gene names

- [ ] **Look up the official symbol on HGNC.** The HUGO Gene Nomenclature Committee (HGNC) sets official human gene names and symbols, searchable at genenames.org [8].
- [ ] **Watch for old symbols.** HGNC changed some symbols because Excel was turning them into dates. Symbols starting SEPT became SEPTIN, and those starting MARCH became MARCHF [9][10]. AI answers and older papers may still use the old ones.
- [ ] **Check Excel didn't convert anything.** One study found these conversion errors in **19.6%** of papers whose supplementary Excel files contained gene lists [11].

## 4. Checking numbers and dates

- [ ] **Find them again in a primary source.** Revenue, deal values, patient numbers and approval dates should come from the company's press release, filings or the regulator's announcement.
- [ ] **Check units and baselines.** Currency (dollars, euros, won), scale (millions, billions) and the year or quarter.
- [ ] **Cross-check two sources.** See whether two independent sources give the same number.

## 5. Reducing errors when you ask

These are the habits I use when asking AI. They don't remove errors, but they make checking much easier.

- **Ask for identifiers.** "Give a DOI, PMID or NCT number for every source." Then the checklist above takes seconds.
- **Let it say it doesn't know.** Add "If you're not sure, say you don't know."
- **Give it the source first.** Where possible, paste the abstract or press release and ask it to answer only from that text.

## Practice: check one news story

1. Ask an AI for the pivotal trial behind camizestrant, covered in BIO:ON Insight Issue #17 (SERENA-6).
2. Write down the NCT number, primary outcome and comparator it gives you.
3. Find the same trial on ClinicalTrials.gov and compare each item.
4. If anything was wrong, note which checklist item caught it.

## Sources

Checked on 1 October 2026.

1. [Bhattacharyya M, et al. High Rates of Fabricated and Inaccurate References in ChatGPT-Generated Medical Content. Cureus. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10277170/)
2. [Walters WH, Wilder EI. Fabrication and errors in the bibliographic citations generated by ChatGPT. Scientific Reports. 2023](https://doaj.org/article/fc88ea07ec994a7c8a144f8516c48cbf)
3. [DOI Foundation — DOI Handbook: handling of resolution errors](https://www.doi.org/doi-handbook/HTML/handling-of-resolution-errors.html), [doi.org — Help](https://doi.org/help.html)
4. [NLM Technical Bulletin — PubMed Single and Batch Citation Matcher](https://www.nlm.nih.gov/pubs/techbull/ma21/ma21_pubmed_single_and_batch_citation_matcher.html)
5. [Crossref — News: Crossref and Retraction Watch](https://crossref.org/blog/news-crossref-and-retraction-watch)
6. [ACCC Clinical Research Glossary — ClinicalTrials.gov identifier](https://acori-glossary.accc-cancer.org/definition/clinicaltrials.gov-identifier)
7. [ClinicalTrials.gov — How to Read Study Results](https://clinicaltrials.gov/study-basics/how-to-read-study-results)
8. [Bruford EA, et al. Guidelines for human gene nomenclature. Nature Genetics. 2020](https://www.repository.cam.ac.uk/bitstream/1810/309006/1/NG-C53771R2_Bruford_Edver_1591982521_1-2_HGNC1.pdf)
9. [HGNC — Summer newsletter 2020](https://blog.genenames.org/newsletters/2020/08/28/Summer_newsletter/)
10. [Revista Pesquisa FAPESP — Automatic conversion in Excel changed to prevent errors in genetic studies](https://revistapesquisa.fapesp.br/en/automatic-conversion-in-excel-changed-to-prevent-errors-in-genetic-studies/)
11. [Ziemann M, Eren Y, El-Osta A. Gene name errors are widespread in the scientific literature. Genome Biology. 2016](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-016-1044-7)
