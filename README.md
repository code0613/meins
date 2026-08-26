# meins

사진 속 개인정보를 모자이크·블러로 가립니다.
**업로드가 없습니다.** 모든 처리가 브라우저 안에서 끝나고, 사진은 기기를 벗어나지 않습니다.

## 왜

주민등록증이나 영수증을 가리려고 온라인 편집 도구에 올리는 순간,
가리려던 그 사진이 이미 남의 서버에 저장됩니다. 그 단계를 없앴습니다.

## 기능

- 드래그 앤 드롭 또는 파일 선택으로 사진 열기 (JPG, PNG, WEBP)
- 모자이크 / 블러 두 가지 방식
- 펜으로 문지르기 · 사각형으로 영역 지정
- 펜 굵기 3단계, 가리는 강도 조절
- 되돌리기 최대 10단계, 전체 지우기
- 원본 해상도 그대로 저장 (`secure_masked_<원본이름>.png`)

## 보안

| | |
|---|---|
| 서버 전송 | 없음. `fetch`·`XHR`·`WebSocket` 코드가 존재하지 않습니다 |
| 브라우저 저장소 | 사용하지 않습니다. 탭을 닫으면 아무것도 남지 않습니다 |
| 외부 스크립트 | 없음. 분석 도구나 CDN을 붙이지 않았습니다 |
| CSP | 운영 빌드에 `connect-src 'none'`. 브라우저가 외부 요청을 차단합니다 |
| EXIF | 캔버스로 다시 그리는 과정에서 GPS·촬영기기 정보가 제거됩니다 |

**한 가지 주의**: 모자이크와 블러는 강도가 낮으면 복원될 수 있습니다.
주민번호나 계좌번호처럼 완전히 지워야 하는 정보는 강도를 충분히 높여 사용하세요.

## 개발

```bash
yarn install
yarn dev      # http://localhost:5173
yarn build
yarn lint
```

## 구조

```
meins/
├─ apps/image-blur/          React 19 + TypeScript + Vite 5 + MUI v5
│  └─ src/
│     ├─ features/Masking/   components · hooks · store · utils · types
│     ├─ router/ · style/
│     └─ main.tsx · App.tsx
└─ libs/
   ├─ styles/                디자인 시스템 (색·타이포·테마)
   └─ components/            공용 컴포넌트
```

Yarn Berry 워크스페이스입니다.

## 기여

브랜치·커밋·이슈·PR 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요.
환경 때문에 막혔던 문제와 해결법은 [docs/troubleshooting.md](./docs/troubleshooting.md)에 모아둡니다.
