---
title: "Reading FDA briefing documents and 10-Ks for trial results and primary endpoints"
date: 2026-10-15
category: ai
roles: [Regulatory affairs, Clinical development, Medical affairs, BD, Investment & IR]
summary: How I pull just the trial results and primary endpoints out of long FDA advisory committee briefing documents and company filings (10-K and 8-K, or 20-F and 6-K for foreign companies) and Korea's DART. Uses the camizestrant case, with AI to find the right pages and every number checked by hand.
---

The [Clinical Trial & Approval Data Guide](/en/resources) covers ClinicalTrials.gov, Drugs@FDA and EMA EPARs. This post is part 2. This time I've written up how to pull just the trial results and primary endpoints out of **FDA advisory committee briefing documents** and **company filings**.

The example is AstraZeneca's camizestrant, covered in [BIO:ON Insight #16](/en/insight/2026-09-15). The FDA approved it even though its advisory committee voted against, which is a good reason to read both documents side by side.

## 1. The case first: what happened with camizestrant

- **30 April 2026:** the FDA's Oncologic Drugs Advisory Committee (ODAC) discussed the new drug application for camizestrant (NDA 220359). A combined FDA and applicant briefing document was published on the FDA website [1].
- **The vote:** 3 in favour, 6 against, on the benefit-risk question [2].
- **4 September 2026:** the FDA granted **accelerated approval** for use with a CDK4/6 inhibitor in HR-positive, HER2-negative advanced breast cancer with an ESR1 mutation. The brand name is Etcamah, and confirmatory studies are required to verify clinical benefit [3].

The committee and the FDA reached different conclusions from the same data. To understand why, you need to open the briefing document itself.

## 2. What to look for in a briefing document

With the FDA's review and the company's material combined, a briefing document can run to hundreds of pages. Rather than reading from the start, I look for these in order.

1. **The voting question and discussion questions.** This is what the committee actually has to answer. Reading everything against these questions keeps you on track.
2. **The primary endpoint and how it's defined.** Check what was measured and from when. SERENA-6's primary endpoint was progression-free survival (PFS), and according to the FDA's approval notice it was measured **from when the ESR1 mutation was first detected** [3]. A definition like that changes how you read the result.
3. **The FDA's key issues.** This is where the FDA sets out its concerns. As reported, in the camizestrant document the FDA pointed to immature overall survival (about 30% maturity, HR 0.87, 95% CI 0.57–1.30), a trial not powered for OS, and PFS2 being hard to accept as efficacy evidence because of the protocol-triggered switch [4][5].
4. **The results tables.** Check medians by arm, the hazard ratio, the confidence interval and the number of events. In SERENA-6, median PFS was 16.0 versus 9.2 months, HR 0.44 (95% CI 0.31–0.60) [6].

**What I've learned:** the company's sections and the FDA's sections emphasise the same numbers differently. Finding one measure in both and writing them side by side taught me the most.

## 3. What to look for in filings: 10-K and 8-K, or 20-F and 6-K

US company filings are free to read on the SEC's EDGAR system [7].

- **10-K:** the annual report. It includes the Business section and Risk Factors [8], so it's a good first stop for the big picture of a company's pipeline.
- **8-K:** the current report filed when a significant event happens, generally within four business days [9].
- **Foreign companies file 20-F and 6-K.** A foreign private issuer listed in the US, like AstraZeneca, files its annual report on Form 20-F and interim reports on Form 6-K [10]. AstraZeneca's announcement of the ODAC vote, for example, went onto EDGAR as a 6-K [11]. So when you look up AstraZeneca on EDGAR, search for 20-F and 6-K rather than 10-K.

## 4. In Korea, it's DART

Korean listed companies' filings are on **DART** (dart.fss.or.kr), the electronic disclosure system run by the Financial Supervisory Service.

- **Business report (사업보고서):** the annual report, due within 90 days of the end of the financial year (Financial Investment Services and Capital Markets Act, Article 159) [12].
- **Major matters report (주요사항보고서):** filed when certain significant events set out in the law occur (Article 161) [13].

When a Korean biotech story mentions a licensing deal or trial result, I think it's a useful habit to check whether the same news appears as a DART filing.

## 5. Use AI to find the page, not to give you the number

AI is genuinely useful with documents this long. I use ChatGPT or Claude to ask where to look in a long PDF before I start reading. But I split the work like this.

- **What I hand to AI:** finding locations, such as "which pages have the primary endpoint definition, the voting question and the FDA's key issues?", and drafting a summary table.
- **What I do myself:** check **every number in the table against the page it came from**: medians, hazard ratios, confidence intervals and dates, one by one.

Try building the summary table like this:

- Trial name and NCT number
- Primary endpoint and when measurement starts
- Results by arm (median, HR, 95% CI) with page numbers
- Concerns the FDA raised
- Final decision (type of approval, conditions)

For checking AI answers more generally, see [the checklist I use](/en/career/checking-ai-answers).

## Exercise

1. On the FDA advisory committee calendar, open the 30 April 2026 ODAC meeting page and download the briefing document [1].
2. Find the voting question and the primary endpoint definition, and note the page numbers.
3. Compare them with the FDA's approval notice [3] and write a paragraph on what changed after the committee, or what stayed the same.
4. Find AstraZeneca's 6-K on EDGAR and compare how the company described the same events.

## My own view

If an interviewer asks about a regulatory decision that caught your attention, I think it's far more convincing to say **"in the briefing document the FDA's concerns were these, and it still approved under these conditions"** than to repeat the news summary. It's a habit that works not only for RA, clinical and medical roles but also for BD and investment.

## Sources

Official documents checked on 15 October 2026.

1. [FDA — April 30, 2026: Oncologic Drugs Advisory Committee Meeting Announcement](https://www.fda.gov/advisory-committees/advisory-committee-calendar/april-30-2026-meeting-oncologic-drugs-advisory-committee-meeting-announcement-04302026)
2. [OncLive — FDA ODAC Votes Against Clinical Benefit of Switching to Camizestrant in HR+ Breast Cancer After ESR1 Mutation Detection](https://www.onclive.com/view/fda-odac-votes-against-clinical-benefit-of-switching-to-camizestrant-in-hr-breast-cancer-after-esr1-mutation-detection)
3. [FDA — FDA grants accelerated approval to camizestrant with a CDK4/6 inhibitor for ESR1-mutated HR-positive, HER2-negative locally advanced or metastatic breast cancer](https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-camizestrant-cdk46-inhibitor-esr1-mutated-hr-positive-her2-negative)
4. [Fierce Biotech — FDA flags concerns for AstraZeneca's camizestrant, Truqap ahead of advisory committee meeting](https://www.fiercebiotech.com/biotech/fda-flags-concerns-astrazeneca-camizestrant-truqap-ahead-advisory-committee-meeting)
5. [OncLive — FDA ODAC Live Updates: Committee Reviews SERENA-6 Data for Camizestrant](https://www.onclive.com/view/fda-odac-preview-serena-6-data-for-camizestrant-in-esr1-mutated-hormone-receptor-breast-cancer-take-center-stage)
6. [AstraZeneca (Business Wire) — Camizestrant reduced the risk of disease progression or death by 56% in SERENA-6 Phase III trial](https://www.businesswire.com/news/home/20250601316083/en/Camizestrant-reduced-the-risk-of-disease-progression-or-death-by-56-in-patients-with-advanced-HR-positive-breast-cancer-with-an-emergent-ESR1-tumor-mutation-in-SERENA-6-Phase-III-trial)
7. [Investor.gov — Using EDGAR to Research Investments](https://www.investor.gov/introduction-investing/getting-started/researching-investments/using-edgar-research-investments)
8. [Investor.gov — How to Read a 10-K](https://www.investor.gov/introduction-investing/getting-started/researching-investments/how-read-10-k)
9. [Investor.gov — How to Read an 8-K](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/how-read-8)
10. [SEC — Financial Reporting Manual, Topic 6: Foreign Private Issuers](https://www.sec.gov/about/divisions-offices/division-corporation-finance/financial-reporting-manual/frm-topic-6)
11. [Stock Titan — AstraZeneca Form 6-K on the FDA ODAC vote for camizestrant](https://www.stocktitan.net/sec-filings/AZN/6-k-astrazeneca-plc-current-report-foreign-issuer-bbd4f2348d48.html)
12. [korea.legal — Business, half-year and quarterly reports (Capital Markets Act, Article 159)](https://korea.legal/wiki/%ec%82%ac%ec%97%85%eb%b3%b4%ea%b3%a0%ec%84%9c%c2%b7%eb%b0%98%ea%b8%b0%eb%b3%b4%ea%b3%a0%ec%84%9c%c2%b7%eb%b6%84%ea%b8%b0%eb%b3%b4%ea%b3%a0%ec%84%9c-%ec%a0%9c%ec%b6%9c/)
13. [korea.legal — Capital Markets Act, Article 161 (major matters reports)](https://korea.legal/wiki/%ec%9e%90%eb%b3%b8%ec%8b%9c%ec%9e%a5%ea%b3%bc-%ea%b8%88%ec%9c%b5%ed%88%ac%ec%9e%90%ec%97%85%ec%97%90-%ea%b4%80%ed%95%9c-%eb%b2%95%eb%a5%a0-%ec%a0%9c161%ec%a1%b0/)
