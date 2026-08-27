# AGENTS.md

이 저장소에서 코드를 고치는 AI 에이전트가 지켜야 할 규칙입니다.
사람용 기여 가이드는 [CONTRIBUTING.md](./CONTRIBUTING.md)에 있습니다.

## 이 서비스의 전제

사진을 브라우저 안에서만 처리하는 도구입니다.
**사진이나 사진에서 파생된 데이터가 기기 밖으로 나가면 이 서비스는 존재 이유가 없습니다.**

## 네트워크 통신 금지

통신 코드가 없습니다. 앞으로도 추가하지 마세요.

```
fetch  XMLHttpRequest  WebSocket  navigator.sendBeacon  EventSource
```

에러 리포팅, 원격 로깅, 외부 폰트, CDN, 이미지 최적화 API 전부 해당됩니다.
좋은 의도로 추가하기 쉬운 것들이라 특히 조심하세요.

ESLint가 `src/**` 에서 위 API를 막습니다(`eslint.config.mjs`). CI에서도 검사합니다.
배포본 CSP는 `connect-src 'self'` 로 마지막 방어선을 겁니다.
**코드 단계에서 먼저 막아야 합니다.** CSP는 마지막 방어선입니다.

### 예외: 방문 통계

`@vercel/analytics` 하나만 예외입니다. 같은 오리진(`/_vercel/insights/*`)으로만
나가고 쿠키를 심지 않으며 사진과 무관합니다. 어떤 화면이 열렸고 어떤 버튼이
눌렸는지만 셉니다.

이 예외를 근거로 다른 외부 통신을 추가하지 마세요.

## 저장소도 쓰지 않습니다

`localStorage`, `sessionStorage`, `IndexedDB`, 쿠키를 쓰지 않습니다.
탭을 닫으면 아무것도 남지 않는다는 것이 README의 약속입니다.

## 문구와 동작을 함께 고칩니다

README와 화면 문구가 위 내용을 사용자에게 약속하고 있습니다.

| 위치 | 내용 |
|---|---|
| `README.md` 「사진은 어디로도 가지 않습니다」 | 사진·저장소·방문 통계·CSP 네 줄 |
| `src/features/common/constants/text.ts` | 화면 배지 문구 |
| `src/features/Masking/components/SecurityNotice.tsx` | 헤더 배지 문구 |

**동작을 바꾸면 문구도 같은 PR에서 고치세요.** 문구가 사실보다 강하면 안 됩니다.

주장을 좁힐 때는 주어를 명확히 씁니다. "아무것도 전송되지 않습니다"가 아니라
"**사진은** 업로드되지 않습니다"처럼 씁니다. 주어가 없으면 실제보다 넓게 읽힙니다.

## 마스킹 모드

`fill` 만 복원 불가능합니다. `mosaic` 과 `blur` 는 원본 픽셀에서 나온 값이 남아
글자처럼 패턴이 뻔한 대상은 복원 시도가 가능합니다.

주민번호·계좌번호·카드번호를 다루는 안내에서 `fill` 을 권하는 문구를
약하게 바꾸지 마세요.

## 하지 말 것

- Tailwind CSS 도입. 스타일은 MUI `sx` 로 씁니다
- 색상 하드코딩. `src/styles/global.ts` 의 CSS 변수만 씁니다
- 팔레트 밖의 새 색 도입. 강조가 필요하면 기존 색의 농도를 올리세요
- 요청하지 않은 주석 추가
- 여러 목적을 한 커밋에 몰아넣기
- 요청 범위를 넘는 리팩터링

## 코드 스타일

`sx` 는 항상 여러 줄로 씁니다.

```tsx
sx={{
  display: 'flex',
  gap: '16px',
}}
```

핸들러는 짧아도 중괄호 블록으로 씁니다.

```tsx
const handleClose = () => {
  setIsOpen(false);
};
```

조건 분기도 짧아도 중괄호를 씁니다.

```ts
if (!image) {
  return;
}
```

주석은 **처음 보는 사람이 코드만으로 알 수 없는 것**만 답니다.
무엇을 하는지가 아니라 왜 그렇게 했는지를 적습니다.

```ts
// 여백 없이 그리면 블러가 캔버스 밖 투명색을 빨아들여 테두리가 흐려진다
```

## 작업 흐름

코드를 바꾸는 작업은 이슈부터 만듭니다. 본문은 이 순서로 씁니다.

```
현상 → 문제 → 원인 → 해결 방향
검토한 다른 방법 — 무엇을 왜 버렸는지
최종 선택 이유와 트레이드오프 — 무엇을 내주는지
```

브랜치는 `feature/<이슈번호>_<스네이크케이스>` 입니다.
커밋은 `type: 설명` 형식이고 괄호를 쓰지 않습니다.

**목적 단위로 나눠 커밋하세요.** 기능·문서·리팩터링을 한 커밋에 섞지 않습니다.

`feature → dev` 는 squash, `dev → main` 은 **merge commit** 입니다.
릴리스에 rebase를 쓰면 같은 변경이 서로 다른 SHA로 남아 다음 PR에서 충돌합니다.

자세한 내용은 [CONTRIBUTING.md](./CONTRIBUTING.md) 를 보세요.

## 검증

PR을 올리기 전에 둘 다 통과해야 합니다.

```bash
yarn lint
yarn build
```

**CI가 같은 것을 검사합니다.** `dev` 와 `main` 으로 가는 PR은 통과하지 못하면 머지할 수 없습니다.

UI를 바꿨으면 브라우저에서 직접 확인하세요.
정렬은 눈으로 보지 말고 `getBoundingClientRect` 로 숫자를 재서 확인합니다.

## 명령어

```bash
yarn install
yarn dev
yarn build
yarn lint
yarn licenses     # 의존성이 바뀌면 오픈소스 고지 재생성
```
