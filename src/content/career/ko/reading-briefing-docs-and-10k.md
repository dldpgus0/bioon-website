---
title: FDA 자문위 브리핑 문서와 10-K, 임상 결과와 1차 평가변수만 골라 읽는 법
date: 2026-10-15
category: ai
roles: [RA, 임상개발, 메디컬, BD, 투자·IR]
summary: 수백 쪽짜리 FDA 자문위원회 브리핑 문서와 미국 공시(10-K·8-K, 외국 회사는 20-F·6-K), 한국 DART에서 임상 결과와 1차 평가변수만 찾아 읽는 순서. 카미제스트란트 사례와 AI로 위치를 찾고 숫자는 직접 대조하는 방법.
---

[임상·허가 원자료 찾기 가이드](/ko/resources)에서는 ClinicalTrials.gov, Drugs@FDA, EMA EPAR를 다뤘어요. 이번 글은 그 2편이에요. 이번에는 **FDA 자문위원회 브리핑 문서**와 **기업 공시**에서 임상 결과와 1차 평가변수만 빠르게 골라 읽는 방법을 정리해 봤어요.

예시는 [BIO:ON Insight 16호](/ko/insight/2026-09-15)에서 다룬 아스트라제네카의 카미제스트란트예요. 자문위원회가 반대했는데도 FDA가 승인한 사례라서, 두 문서를 같이 읽어 볼 이유가 분명하거든요.

## 1. 사례 먼저: 카미제스트란트는 어떻게 흘러갔나

- **2026년 4월 30일:** FDA 항암제 자문위원회(ODAC)가 카미제스트란트 신약허가신청(NDA 220359)을 논의했어요. FDA와 회사가 함께 쓴 브리핑 문서가 FDA 웹사이트에 공개됐어요 [1].
- **투표 결과:** 이익-위험 평가에 대해 찬성 3, 반대 6이었어요 [2].
- **2026년 9월 4일:** FDA는 ESR1 변이가 생긴 HR 양성·HER2 음성 진행성 유방암에서 CDK4/6 억제제와 함께 쓰는 용도로 **가속승인**을 내렸어요. 제품명은 Etcamah예요. 확증 연구로 임상적 이익을 확인해야 한다는 조건이 붙었어요 [3].

같은 데이터를 보고 자문위와 FDA가 다른 결론을 냈어요. 그 차이를 이해하려면 브리핑 문서를 직접 열어 봐야 해요.

## 2. 자문위 브리핑 문서에서 찾을 것

브리핑 문서는 FDA 쪽 검토와 회사 쪽 자료를 합쳐 수백 쪽이 되기도 해요. 처음부터 다 읽기보다는 아래 순서로 찾아요.

1. **투표 질문(Voting Question)과 논의 질문(Discussion Questions):** 자문위가 무엇에 답해야 하는지가 여기 있어요. 문서 전체를 이 질문에 비추어 읽으면 길을 잃지 않아요.
2. **1차 평가변수(Primary Endpoint)와 그 정의:** 무엇을 언제부터 쟀는지 확인해요. SERENA-6의 1차 평가변수는 무진행생존기간(PFS)이었는데, FDA 승인 발표에 따르면 PFS를 **ESR1 변이가 처음 발견된 시점부터** 쟀어요 [3]. 이런 정의 하나가 해석을 바꿔요.
3. **FDA 쪽 핵심 우려(Key Issues):** FDA가 문제 삼은 점을 모아 둔 부분이에요. 보도에 따르면 카미제스트란트 문서에서 FDA는 전체생존기간(OS)이 아직 덜 성숙했다는 점(성숙도 약 30%, HR 0.87, 95% CI 0.57–1.30), 시험이 OS를 보도록 설계되지 않았다는 점, 프로토콜에 따른 약 교체 때문에 PFS2를 효능 근거로 받기 어렵다는 점을 지적했어요 [4][5].
4. **숫자 표:** 군별 중앙값, 위험비(HR), 신뢰구간, 사건 수를 확인해요. SERENA-6에서 PFS 중앙값은 16.0개월 대 9.2개월, HR 0.44(95% CI 0.31–0.60)였어요 [6].

**제가 배운 점:** 회사 쪽 섹션과 FDA 쪽 섹션은 같은 숫자를 다르게 강조해요. 저는 같은 지표를 두 섹션에서 찾아 나란히 적어 보는 게 가장 공부가 됐어요.

## 3. 공시에서 찾을 것: 10-K·8-K, 그리고 20-F·6-K

미국 상장사의 공시는 SEC의 EDGAR에서 무료로 볼 수 있어요 [7].

- **10-K:** 연간 보고서예요. 사업 개요(Business)와 위험 요인(Risk Factors)이 들어 있어서 [8], 회사의 파이프라인 전체 그림을 볼 때 먼저 열어 보기 좋아요.
- **8-K:** 중요한 일이 생겼을 때 내는 수시 보고서예요. 대부분 사건 발생 후 4영업일 안에 내요 [9].
- **외국 회사는 20-F·6-K:** 아스트라제네카처럼 미국에 상장한 외국 회사(foreign private issuer)는 연간 보고서를 Form 20-F로, 중간 보고는 Form 6-K로 내요 [10]. 실제로 아스트라제네카의 자문위 투표 결과 발표도 6-K로 EDGAR에 올라왔어요 [11]. 그래서 아스트라제네카를 EDGAR에서 찾을 때는 10-K 대신 20-F와 6-K를 찾아야 해요.

## 4. 한국은 DART

한국 상장사의 공시는 금융감독원 전자공시시스템 **DART**(dart.fss.or.kr)에서 봐요.

- **사업보고서:** 사업연도가 끝난 뒤 90일 안에 내는 연간 보고서예요(자본시장법 제159조) [12].
- **주요사항보고서:** 법에서 정한 중요한 일이 생기면 내는 보고서예요(자본시장법 제161조) [13].

국내 바이오 기사에 기술이전이나 임상 소식이 나오면, 같은 내용이 DART 공시로도 나와 있는지 찾아보는 습관이 도움이 될 것 같아요.

## 5. AI는 "위치 찾기"까지만

수백 쪽 문서에서 AI는 꽤 쓸모가 있어요. 저도 ChatGPT나 Claude에 긴 PDF를 넣고 어디를 읽어야 할지 먼저 물어봐요. 다만 역할을 이렇게 나눠요.

- **AI에게 맡기는 일:** "1차 평가변수 정의, 투표 질문, FDA 쪽 핵심 우려가 각각 몇 쪽에 있는지 알려 줘" 같은 위치 찾기, 그리고 요약표 초안 만들기.
- **제가 직접 하는 일:** 표에 들어간 **모든 숫자를 해당 쪽에서 다시 확인**하기. 중앙값, HR, 신뢰구간, 날짜를 하나씩 대조해요.

요약표는 이렇게 만들어 보세요.

- 시험 이름 · NCT 번호
- 1차 평가변수와 측정 시작 시점
- 군별 결과(중앙값, HR, 95% CI)와 쪽 번호
- FDA가 제기한 우려
- 최종 결정(승인 종류, 조건)

AI 답변을 검증하는 방법은 [AI 답변 검증 체크리스트](/ko/career/checking-ai-answers)에 따로 정리해 뒀어요.

## 실습

1. FDA 자문위원회 달력에서 2026년 4월 30일 ODAC 회의 페이지를 열고 브리핑 문서를 내려받아요 [1].
2. 투표 질문과 1차 평가변수 정의를 찾아 쪽 번호와 함께 적어요.
3. FDA 승인 발표 [3]와 비교해서, 자문위 이후 무엇이 달라졌는지(또는 그대로인지) 한 문단으로 써 보세요.
4. EDGAR에서 아스트라제네카의 6-K를 찾아 회사가 같은 내용을 어떻게 설명했는지 비교해요.

## 제 생각

면접에서 "최근 인상 깊었던 허가 결정"을 묻는다면, 기사 요약보다 <strong>"브리핑 문서에서 FDA가 문제 삼은 점은 이것이고, 그런데도 이런 조건으로 승인됐다"</strong>고 말할 수 있으면 훨씬 설득력 있을 것 같아요. RA, 임상, 메디컬은 물론이고 BD나 투자 쪽에서도 쓸 수 있는 습관이라고 생각해요.

## 출처

공식 문서 확인일: 2026년 10월 15일

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
12. [korea.legal — 사업보고서·반기보고서·분기보고서 제출 (자본시장법 제159조)](https://korea.legal/wiki/%ec%82%ac%ec%97%85%eb%b3%b4%ea%b3%a0%ec%84%9c%c2%b7%eb%b0%98%ea%b8%b0%eb%b3%b4%ea%b3%a0%ec%84%9c%c2%b7%eb%b6%84%ea%b8%b0%eb%b3%b4%ea%b3%a0%ec%84%9c-%ec%a0%9c%ec%b6%9c/)
13. [korea.legal — 자본시장법 제161조 (주요사항보고서의 제출)](https://korea.legal/wiki/%ec%9e%90%eb%b3%b8%ec%8b%9c%ec%9e%a5%ea%b3%bc-%ea%b8%88%ec%9c%b5%ed%88%ac%ec%9e%90%ec%97%85%ec%97%90-%ea%b4%80%ed%95%9c-%eb%b2%95%eb%a5%a0-%ec%a0%9c161%ec%a1%b0/)
