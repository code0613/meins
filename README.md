# 이미지 블러

사진에서 가리고 싶은 부분을 문지르면 모자이크나 블러로 덮어줍니다.
**업로드가 없습니다.** 브라우저 안에서 전부 처리되고, 사진 파일은 기기 밖으로 나가지 않습니다.

## 만든 이유

사진 한 구석을 가리려고 온라인 편집 도구를 찾다 보면,
가리려던 그 사진을 남의 서버에 올리는 걸로 시작하게 됩니다. 그 단계를 없애고 싶었습니다.

## 할 수 있는 것

- 사진을 끌어다 놓거나 골라서 열기 (JPG, PNG, WEBP)
- **모자이크 / 블러 / 채우기** 중 선택
- 펜으로 문지르거나 사각형으로 영역 지정
- 펜 굵기 3단계, 가리는 세기 조절
- 되돌리기 10단계, 전체 지우기
- 원본 해상도 그대로 저장 (`secure_masked_원본이름.png`)

### 채우기를 쓰세요, 주민번호라면

모자이크와 블러는 **되돌릴 수 있습니다.** 픽셀을 뭉갤 뿐 원본에서 나온 값이 남아서,
글자처럼 패턴이 뻔한 대상은 복원 시도가 가능합니다. 세기를 낮게 두면 더 위험합니다.

채우기는 원본과 상관없는 단색으로 덮기 때문에 그 영역의 정보가 실제로 사라집니다.
주민번호, 계좌번호, 카드번호에는 채우기를 쓰세요.

## 사진은 어디로도 가지 않습니다

코드로 확인할 수 있습니다.

| | |
|---|---|
| 사진 | 브라우저 안에서만 처리됩니다. 어디에도 업로드되지 않습니다 |
| 저장소 | `localStorage`, `IndexedDB`, 쿠키를 쓰지 않습니다. 탭을 닫으면 남는 게 없습니다 |
| 방문 통계 | Vercel Web Analytics로 방문 수와 버튼 클릭 수를 셉니다. 쿠키를 심지 않고 개인을 식별하지 않으며, 사진은 포함되지 않습니다 |
| CSP | 배포본에 `connect-src 'self'`. 외부 도메인으로 나가는 요청은 브라우저가 막습니다 |

세 번째 줄이 이 문서에서 유일하게 "나간다"고 말하는 항목입니다.
어떤 화면이 열렸고 어떤 버튼이 눌렸는지만 셉니다. 수집 스크립트도 수집 주소도
같은 도메인 안(`/_vercel/insights`)에 있어서, 광고 회사를 포함한 어떤 제3자에게도 가지 않습니다.

마지막 줄이 그걸 강제합니다. "안 보낸다"는 말만으로는 믿기 어려우니,
**실수로 코드에 외부 통신이 섞여도 브라우저가 차단하도록** 헤더를 걸어뒀습니다.

덤으로 캔버스로 다시 그리는 과정에서 **EXIF가 사라집니다.**
GPS 좌표나 촬영 기기 정보가 저장 파일에 남지 않습니다.

## 개발

```bash
yarn install
yarn dev            # 기본 앱(image-blur) 개발 서버
yarn build
yarn lint
```

앱을 지정해서 돌리려면 앱 이름을 앞에 붙입니다.

```bash
yarn image-blur dev
yarn image-blur build
```

## 구조

```
meins/
├─ apps/image-blur/          React 19 · TypeScript · Vite 5 · MUI v5
│  ├─ vercel.json            이 앱의 배포 설정
│  └─ src/
│     ├─ features/Masking/   마스킹 기능 일체
│     ├─ features/Licenses/  오픈소스 고지
│     └─ router/ · style/
├─ libs/
│  ├─ styles/                색·타이포·테마
│  └─ components/            공용 컴포넌트
└─ scripts/
   └─ vercel-ignore-build.sh 변경 없는 앱은 빌드를 건너뛴다
```

Yarn Berry 워크스페이스입니다.
색은 `apps/image-blur/src/style/global.ts`의 CSS 변수가 기준입니다.

## 배포

Vercel 프로젝트 하나가 앱 하나를 맡습니다. 배포 설정은 레포 루트가 아니라 **각 앱 안**에 있습니다.

| Vercel 설정 | 값 |
|---|---|
| Root Directory | `apps/image-blur` |
| Include files outside of the Root Directory | 켬 |
| 환경변수 | `ENABLE_EXPERIMENTAL_COREPACK=1` |

두 번째 설정을 끄면 `libs/*` 를 워크스페이스로 참조할 수 없어 `@meins/components@workspace:^` 에서 빌드가 깨집니다. 환경변수는 Yarn Berry 의 `workspace:` 프로토콜 때문에 필요합니다.

`vercel.json` 의 `ignoreCommand` 가 해당 앱과 공유 자원(`libs`, `package.json`, `yarn.lock`, `.yarnrc.yml`)의 변경 여부를 보고, 바뀐 게 없으면 빌드를 건너뜁니다. 비교 기준을 찾지 못하면 건너뛰지 않고 빌드합니다.

### 앱을 추가하려면

1. `apps/<새앱>/` 을 만들고 `package.json` 의 이름을 `@meins/<새앱>` 으로 둡니다
2. `apps/image-blur/vercel.json` 을 복사해 `ignoreCommand` 의 경로를 새 앱으로 바꿉니다
3. 루트 `package.json` 에 패스스루를 한 줄 추가합니다 — `"<새앱>": "yarn workspace @meins/<새앱>"`
4. Vercel 에서 같은 레포로 프로젝트를 하나 더 만들고, 위 표대로 Root Directory 와 나머지를 설정합니다

## 문서

- [CONTRIBUTING.md](./CONTRIBUTING.md) — 브랜치, 커밋, 이슈, PR 규칙
- [docs/troubleshooting.md](./docs/troubleshooting.md) — 배포하다 막혔던 것들과 해결법

## 라이선스 고지

쓰고 있는 오픈소스 목록은 `/licenses` 경로에 있습니다. 화면에 링크를 두지는 않았습니다.
의존성이 바뀌면 아래를 다시 돌리세요.

```bash
node scripts/generate-licenses.mjs
```
