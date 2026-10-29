---
title: "Consensus·Perplexity로 선행 연구 훑기 — 서론 흐름, 연구 방법, 대조군을 요약표로"
date: 2026-10-29
category: ai
roles: [R&D, 임상, 메디컬, BD]
summary: AI 검색 도구로 논문 후보를 빠르게 모으고, 논문마다 서론 흐름·설계·대조군·1차 평가변수·핵심 숫자를 한 줄로 정리하는 방법이에요. IgA 신병증 3상 논문 세 편으로 만든 예시와 무료 엑셀 요약표를 같이 담았어요.
---

과제나 뉴스레터를 준비하다 보면 "이 주제에 어떤 연구가 있지?"에서 시작할 때가 많아요. 저는 이럴 때 **Consensus**와 **Perplexity**를 써요. 둘 다 처음 방향을 잡는 데는 편했지만, 쓰면서 알게 된 건 **AI가 보여 주는 요약은 출발점일 뿐이고, 결국 논문을 한 편씩 열어 같은 틀로 정리해야 비교가 된다**는 점이었어요. 그래서 제가 쓰는 순서와 요약표를 정리해 봤어요.

## 1. 두 도구, 이렇게 나눠 써요

도구 기능은 자주 바뀌어요. 아래 내용은 대학 도서관 안내와 공개 리뷰를 기준으로 2026년 10월 29일에 확인했어요. 쓰기 전에 각 서비스의 최신 도움말도 한 번 확인해 보세요.

- **Consensus:** 학술 논문만 모아 검색하는 AI 검색 엔진이에요. 질문을 넣으면 관련 논문을 찾아 요약해 주고, 요약 문장마다 근거 논문이 연결돼 있어요 [1].
  - **Consensus Meter:** 예/아니오로 답할 수 있는 질문에서, 상위 검색 결과 논문들이 어느 쪽 결론인지 비율로 보여 줘요 [1][2].
  - **주의할 점:** 이 비율은 그 질문으로 찾은 논문 묶음에서만 나온 값이라, 질문을 어떻게 쓰느냐에 따라 달라질 수 있어요 [2].
- **Perplexity:** 웹 전체를 검색해 출처가 달린 답을 주는 '답변 엔진'이에요. 학술 자료 위주로 찾는 옵션도 있어요 [3].
  - **주의할 점:** 도서관 안내들은 Perplexity가 보여 준 출처를 반드시 직접 확인하고, Perplexity의 답이 아니라 원래 출처를 인용하라고 권해요 [3][4].

**제 생각:** 저는 논문 후보를 모을 때는 Consensus를, 그 분야의 뉴스나 규제 맥락처럼 논문 밖의 배경을 함께 볼 때는 Perplexity를 쓰는 편이에요. 어느 쪽이든 결과 화면은 '읽을 목록'이지 '읽은 내용'은 아니라고 생각해요.

**다른 선택지:** Elicit은 공식 안내에 따르면 연구 질문에 맞는 추출 열(column)을 제안하고, 셀마다 근거 문장을 보여 주며, 표를 CSV로 내보낼 수 있어요 [5]. 저는 써 보지 않아서 공식 문서 내용만 적었어요.

## 2. 논문마다 한 줄씩: 요약표의 칸

후보 논문이 모이면, 논문마다 같은 칸을 채워요. 칸이 같아야 나중에 나란히 놓고 비교할 수 있어요.

- **서론 흐름:** 배경 → 빈틈 → 가설. "무엇이 알려져 있고, 무엇이 아직 모르고, 그래서 이 연구는 무엇을 묻는가"를 한 줄로 써요.
- **연구 설계:** 무작위 대조시험(RCT), 코호트, 메타분석 등
- **대상과 규모:** 어떤 환자 몇 명인지
- **개입과 대조군:** 무엇을 무엇과 비교했는지. 위약인지, 기존 치료인지에 따라 결과의 의미가 달라져요.
- **1차 평가변수와 핵심 결과:** 숫자 하나는 꼭 적어요.
- **한계:** 중간 분석인지, 기간이 짧은지 등
- **원문 확인 여부:** 전문을 읽었는지, 초록만 봤는지, 아직 안 봤는지

## 3. 예시: APRIL을 막으면 IgA 신병증 단백뇨가 줄어들까?

[BIO:ON Insight 22호](/ko/insight/2026-10-27)에서 셀트리온이 들여온 KG013은 APRIL이라는 단백질을 막는 항체이고, 첫 적응증이 IgA 신병증이었어요. 그래서 "APRIL을 막는 약들이 실제 임상에서 어땠나?"를 질문으로 잡고, Consensus로 찾은 3상 논문 세 편을 요약표 형식으로 정리해 봤어요. 아래 숫자는 모두 각 논문의 초록에서 옮겼어요.

1. **시베프렌리맙 3상 (VISIONARY, 중간 분석)** [6]
   - **설계·대상:** RCT, 생검으로 확진된 성인 IgA 신병증 환자 510명 중 중간 분석에 320명
   - **개입 vs 대조군:** 시베프렌리맙(APRIL 단독 차단) 400mg을 4주마다 피하주사 vs 위약
   - **1차 평가변수:** 9개월째 24시간 소변 단백/크레아티닌 비(UPCR)
   - **핵심 결과:** -50.2% vs +2.1%, 위약 대비 51.2% 낮음
2. **아타시셉트 3상 (ORIGIN 3, 중간 분석)** [7]
   - **설계·대상:** RCT, 중간 분석에 203명
   - **개입 vs 대조군:** 아타시셉트(BAFF·APRIL 동시 차단) 150mg 매주 vs 위약
   - **1차 평가변수:** 36주째 UPCR 변화율
   - **핵심 결과:** -45.7% vs -6.8%
3. **텔리타시셉트 3상 (TELIGAN, 중간 분석)** [8]
   - **설계·대상:** RCT, 하루 단백뇨 1.0g 이상 성인 318명
   - **개입 vs 대조군:** 텔리타시셉트(BAFF·APRIL 동시 차단) 240mg 매주 vs 위약
   - **1차 평가변수:** 39주째 UPCR
   - **핵심 결과:** -58.9% vs -8.8%

이렇게 나란히 놓으니 보이는 게 있었어요.

- **공통점:** 세 연구 모두 위약보다 단백뇨를 크게 줄였어요.
- **차이점:** 표적(APRIL 단독 vs BAFF+APRIL), 투여 간격(4주 vs 매주), 평가 시점(9개월 vs 36·39주)이 달라서 숫자를 그대로 줄 세우면 안 돼요.
- **아직 모르는 것:** 세 연구 모두 중간 분석이라, 단백뇨 감소가 장기 신기능 보존으로 이어지는지는 최종 결과를 봐야 해요.

이 예시는 초록만 보고 채웠기 때문에, 요약표의 '원문 확인' 칸에 <strong>"초록만"</strong>이라고 표시해 뒀어요. 과제나 보고서에 인용할 때는 전문을 열어 방법과 결과 표까지 확인하는 게 맞다고 생각해요.

## 4. 제가 지키는 규칙

1. **AI 화면이 아니라 논문을 인용해요.** DOI나 PubMed ID로 원문을 열고, 저자·연도·저널이 맞는지 확인해요. 확인 방법은 [AI 답변 검증 체크리스트](/ko/career/checking-ai-answers)에 정리해 뒀어요.
2. **숫자는 원문에서 다시 옮겨요.** AI 요약의 숫자를 그대로 쓰지 않아요.
3. **대조군부터 봐요.** 위약 대비인지, 기존 치료 대비인지에 따라 같은 숫자도 의미가 달라져요.
4. **'원문 확인' 칸이 비어 있으면 인용하지 않아요.**

## 무료 자료: 선행 연구 요약표 (엑셀)

위 칸 구성 그대로 만든 엑셀 템플릿을 [자료실](/ko/resources)에 올려 뒀어요.

- **Papers 시트:** 논문마다 한 줄씩 채우고, 설계·찾은 도구·원문 확인 여부는 드롭다운으로 골라요.
- **Synthesis 시트:** 공통 결론, 차이점, 아직 모르는 것을 정리해요.
- **예시 행:** 위 세 논문으로 채워 뒀으니 형식을 참고한 뒤 지우고 쓰면 돼요.

## 제가 배운 점

AI 검색 도구 덕분에 '무엇을 읽을지' 찾는 시간은 확실히 줄었어요. 그런데 '무엇을 말할 수 있는지'는 결국 논문을 같은 틀로 정리해 봐야 보이더라고요. 면접에서 "이 분야 연구 동향을 어떻게 파악하나요?"라는 질문을 받는다면, 어떤 도구를 쓰는지보다 **이렇게 정리하고 원문으로 확인한다**는 과정을 말하는 게 더 설득력 있을 것 같아요.

## 출처

1. [St. Thomas Libraries Blog — Introducing Consensus: an AI-powered literature review tool (2025)](https://blogs.stthomas.edu/libraries/2025/09/05/introducing-consensus-an-ai-powered-literature-review-tool/)
2. [Aaron Tay — A 2025 Deep Dive of Consensus: Promises and Pitfalls in AI-Powered Academic Search](https://aarontay.substack.com/p/a-2025-deep-dive-of-consensus-promises)
3. [SNHU Academic Resource Center — Introduction to Perplexity AI](https://snhuacademicresourcecenter.screenstepslive.com/a/1933529-introduction-to-perplexity-ai)
4. [University of Florida Business Library — How can Perplexity support college student research while observing academic standards?](https://answers.businesslibrary.uflib.ufl.edu/genai/faq/425586)
5. [Elicit Support — Start a systematic review: Steps 4-5, data extraction and final report](https://support.elicit.com/en/articles/4267649)
6. [Perkovic V, et al. Sibeprenlimab in IgA Nephropathy — Interim Analysis of a Phase 3 Trial. N Engl J Med. 2025 (NCT05248646)](https://consensus.app/papers/details/cfc95f76fa015ef494105f51a5ade3c3/)
7. [Lafayette R, et al. A Phase 3 Trial of Atacicept in Patients with IgA Nephropathy. N Engl J Med. 2025 (NCT04716231)](https://consensus.app/papers/details/5fada89777ca5665b03895c029616bc8/)
8. [Lv J-C, et al. Telitacicept for IgA Nephropathy — Interim Analysis of a Phase 3 Trial. N Engl J Med. 2026 (NCT05799287)](https://consensus.app/papers/details/57aed87c447e528385f6b32667d43b04/)
