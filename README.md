# LocalHub : 구미·경북 지역 정보 공유 커뮤니티

구미와 경북의 다양한 로컬 데이터를 직관적인 UI로 제공하는 공공데이터 기반 1인 익명 지역 커뮤니티 및 AI 가이드 플랫폼입니다.

---

## 1. 프로젝트 설명

### 기획 배경 & 동기
* **공공데이터 통합 뷰**: 여러 기관에 분산된 구미/경북의 다양한 지역 데이터(관광지, 레포츠, 문화시설, 쇼핑, 숙박, 여행코스, 음식점, 축제공연행사)를 정제하여 한눈에 파악할 수 있도록 구현했습니다.
* **익명성 보장 커뮤니티**: 복잡한 절차 없이 브라우저 LocalStorage를 활용해 누구나 부담 없이 지역 소식을 공유하는 공간을 설계했습니다.

### 해결하고자 한 문제
* **서버 비용 제로 & 속도 개선**: 백엔드/DB 없는 프론트엔드 단일 구조(정적 SPA)로 구축하여 서버 통신 지연을 없애고 렌더링 속도를 극대화했습니다.
* **자연어 기반 정보 탐색**: OpenAI GPT API를 연동하여 사용자의 취향에 맞는 지역 명소를 실시간으로 추천하는 AI 챗봇 가이드를 탑재했습니다.

### 프로젝트를 통한 성장 (학습 내용)
* **컴포넌트 중심 설계**: App.vue 단일 구조를 7개의 독립 컴포넌트로 세분화하며 Vue 3의 Props/Emit 데이터 흐름을 깊이 이해했습니다.
* **클라이언트 사이드 CRUD**: 외부 서버 없이 브라우저 내 저장소만을 사용하여 안정적인 클라이언트 단 데이터 관리 로직을 익혔습니다.

---

## 2. 사용 기술 및 선정 이유

| 기술 분류 | 사용 기술 | 선정 이유 |
| :--- | :--- | :--- |
| **Framework** | **Vue.js 3 (Vite)** | SFC 구조 기반의 빠르고 가벼운 정적 SPA 구축 |
| **Styling** | **Tailwind CSS** | 유틸리티 클래스 활용, 일관성 있는 미니멀 화이트 UI 구현 |
| **AI** | **OpenAI API** | 프론트엔드 직호출 방식을 통한 실시간 가이드 챗봇 및 날씨 연동 |
| **Database** | **LocalStorage** | 서버리스 환경에서 익명 게시글 데이터 반영구 보존 |
| **Deployment** | **Netlify** | GitHub 저장소 연동을 통한 즉각적인 CD(지속적 배포) 환경 구축 |

---

## 3. 주요 핵심 기능

* **대형 배너 & 통합 검색**: 구미의 자연경관을 메인 비주얼로 활용한 차분한 화이트 톤의 메인 UI
* **공공데이터 카드 디렉토리**: 제공된 구미 정보(관광지, 레포츠, 문화시설, 쇼핑, 숙박, 여행코스, 음식점, 축제공연행사)를 하나로 통합한 public/all-data.json 기반의 카테고리별 상세 카드 렌더링
* **익명 게시판 (CRUD)**: 회원가입 없이 4자리 숫자 비밀번호 일치 여부로 수정/삭제가 가능한 익명 보장 소통 공간
* **AI 가이드 챗봇**: 화면 우측 하단 슬라이드 창을 통해 금오산, 에코랜드 등 통합된 지역 명소 정보를 자연어로 추천

---

## 4. 배포 및 실행 방법

본 프로젝트는 GitHub 저장소와 Netlify 서비스를 연동하여 지속적 배포(CD) 환경을 구축했습니다[cite: 1]. 

### 1) 실시간 배포 사이트 주소
* **배포 URL**: [https://여기에_본인의_넷리파이_배포_링크_넣기.netlify.app](https://여기에_본인의_넷리파이_배포_링크_넣기.netlify.app)[cite: 1]

### 2) Netlify 배포 환경 변수 설정 방법 (중요)
OpenAI API 호출을 위해 빌드 환경에 API 키를 등록해 주어야 합니다. 깃허브에는 .env 파일이 업로드되지 않으므로 아래의 과정을 거쳐 설정합니다[cite: 1].
1. Netlify 콘솔의 해당 프로젝트 대시보드 진입
2. Site configuration -> Environment variables 메뉴로 이동
3. [Add a variable] 버튼 클릭 후 아래의 값을 입력하고 저장
   * Key: `OPENAI_API_KEY`
   * Value: (본인의 OpenAI API 실물 키 값 입력)[cite: 1]
4. Deploys 메뉴에서 Trigger deploy -> Clear cache and deploy site를 실행하여 재배포 완료

### 2) Netlify 환경 변수 설정 (중요)
깃허브에 업로드되지 않는 OpenAI API 키를 배포 서버에 등록해야 정상 작동합니다.
1. Netlify 대시보드 -> Site configuration -> Environment variables 이동
2. [Add a variable] 클릭 후 아래 값 입력 및 저장
   * **Key**: `OPENAI_API_KEY`
   * **Value**: *(본인의 OpenAI API 실물 키 값 입력)*
3. Deploys 메뉴 -> Trigger deploy -> Clear cache and deploy site 실행

### 3) 로컬 실행 방법 (테스트)
```bash
# 1. 저장소 복제 및 폴더 이동
git clone [https://github.com/사용자_깃허브_ID/localhub-gumi.git](https://github.com/사용자_깃허브_ID/localhub-gumi.git)
cd localhub-gumi

# 2. 패키지 설치 및 환경 변수 설정
npm install
echo "OPENAI_API_KEY=your_actual_key_here" > .env

# 3. 개발 서버 실행
npm run dev
```
---

## 5. 프로젝트 참가자

| 이름/역할 | 담당 분야 | GitHub / 연락처 |
| :--- | :--- | :--- |
| **[권세혁]** (팀장) | 프로젝트 기획, 데이터 가공, etlify 배포 환경 구축, Props/Emit 데이터 흐름 제어 및 핵심 화면 로직 구현, 챗봇 구현 | • GitHub: [링크](https://github.com/saehyuk1661) <br> • Email: briankwon97@gmail.com |
| **[오유정]** (팀원) | 프로젝트 기획, UI/UX 설계 및 전체적인 화면 디자인, OpenAI API 연동 및 시스템 프롬프트 제어, Vue 3 컴포넌트 설계, 날씨 정보 연동 | • GitHub: [링크](https://github.com/ohyuj) <br> • Email: ohyuj7007@gmail.com |
| **[김정환]** (팀원) | 프로젝트 기획 | • GitHub: [링크](https://github.com/Jeonghwankimhub) <br> • Email: 이메일@gmail.com |

---

## 6. 참고 자료 및 출처

* **디자인 레퍼런스**: 춘천시 관광 포털 (https://www.chuncheon.go.kr/tour/)
* **공공데이터**: SSAFY 제공 정제 공공데이터 통합 JSON 파일 (`public/all-data.json`)