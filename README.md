# meins

개인 프로젝트를 모아두는 모노레포입니다. 독일어로 "내 것"이라는 뜻입니다.

`apps/` 아래의 서비스는 각각 독립적으로 배포됩니다. 서로 코드를 공유하되
배포와 도메인은 따로 갑니다.

## 서비스

| 앱 | 무엇 | 주소 |
|---|---|---|
| [image-blur](./apps/image-blur) | 사진에서 가리고 싶은 부분을 브라우저 안에서 덮는 도구 | <https://meins-image-blur.vercel.app> |

## 구조

```
meins/
├─ apps/
│  └─ image-blur/           React 19 · TypeScript · Vite 5 · MUI v5
│     ├─ vercel.json        이 앱의 배포 설정
│     └─ AGENTS.md          이 앱에만 적용되는 작업 규칙
├─ libs/
│  ├─ styles/               색·타이포·테마
│  └─ components/           공용 컴포넌트
└─ scripts/
   ├─ generate-licenses.mjs 오픈소스 고지 생성
   └─ vercel-ignore-build.sh 변경 없는 앱은 빌드를 건너뛴다
```

Yarn Berry 워크스페이스입니다. `libs/*`를 고치면 모든 앱이 영향을 받습니다.

## 개발

```bash
yarn install
yarn dev                # 기본 앱(image-blur) 개발 서버
yarn build
yarn lint
```

앱을 지정하려면 앱 이름을 앞에 붙입니다.

```bash
yarn image-blur dev
yarn image-blur build
```

## 배포

Vercel 프로젝트 하나가 앱 하나를 맡습니다. 배포 설정은 저장소 루트가 아니라 **각 앱 안**에 있습니다.

| Vercel 설정 | 값 |
|---|---|
| Root Directory | `apps/<앱>` |
| 환경변수 | `ENABLE_EXPERIMENTAL_COREPACK=1` |

환경변수는 Yarn Berry의 `workspace:` 프로토콜 때문에 필요합니다. 없으면 Vercel이
Yarn 1으로 설치를 시도하다 `@meins/components@workspace:^`에서 실패합니다.

Yarn 워크스페이스가 잡히면 Vercel이 레포 전체를 빌드 컨텍스트에 포함합니다.
안 되는 경우에는 대시보드에서 `Include files outside of the Root Directory`를 켜세요.

`vercel.json`의 `ignoreCommand`가 해당 앱과 공유 자원(`libs`, `package.json`,
`yarn.lock`, `.yarnrc.yml`)의 변경 여부를 보고, 바뀐 게 없으면 빌드를 건너뜁니다.
비교 기준을 찾지 못하면 건너뛰지 않고 빌드합니다.

### 앱을 추가하려면

1. `apps/<새앱>/`을 만들고 `package.json`의 이름을 `@meins/<새앱>`으로 둡니다
2. `apps/image-blur/vercel.json`을 복사해 `ignoreCommand`의 경로를 새 앱으로 바꿉니다
3. 루트 `package.json`에 패스스루를 한 줄 추가합니다 — `"<새앱>": "yarn workspace @meins/<새앱>"`
4. Vercel에서 같은 저장소로 프로젝트를 하나 더 만들고, 위 표대로 설정합니다
5. 그 앱에만 걸리는 제약이 있으면 `apps/<새앱>/AGENTS.md`에 적습니다

## 문서

- [CONTRIBUTING.md](./CONTRIBUTING.md) — 브랜치, 커밋, 이슈, PR 규칙
- [AGENTS.md](./AGENTS.md) — AI 에이전트로 작업한다면 먼저 읽으세요
- [docs/troubleshooting.md](./docs/troubleshooting.md) — 배포하다 막혔던 것들과 해결법
