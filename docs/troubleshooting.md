# 트러블슈팅

같은 문제를 다시 만났을 때 **어디부터 볼지**를 남기는 문서입니다.
자세한 경위와 검토한 대안은 각 이슈에 있으니 링크를 따라가세요.

새 항목은 위에 추가합니다. 형식은 **증상 / 원인 / 해결 / 다음에 볼 것**입니다.

---

## Vercel: Root Directory 설정이 vercel.json을 무시한다

**발생일** 2026-08-26

**증상**
```
Error: No Output Directory named "dist" found after the Build completed.
```
`vercel.json`에 `outputDirectory: "apps/image-blur/dist"`를 넣었는데도
Vercel이 기본값인 `dist`를 찾는다. 빌드 자체는 성공한다.

**원인**
대시보드 프로젝트 설정이 저장소의 `vercel.json`보다 우선한다.

```
rootDirectory: 'apps/image-blur'   → 루트의 vercel.json을 읽지 않음
framework: 'vite'                  → 프리셋이 출력 경로를 dist로 강제
```

**해결**
대시보드에서 Root Directory와 Framework Preset을 모두 해제한다.
워크스페이스 의존성 때문에 설치는 저장소 루트에서 해야 하므로,
루트를 기준으로 두고 `vercel.json`이 빌드 명령과 출력 경로를 담당하게 한다.

**다음에 볼 것**
배포 설정이 먹지 않으면 대시보드 설정부터 확인한다.

```bash
vercel api "v9/projects/<projectId>?teamId=<teamId>"
```
`rootDirectory`, `framework`, `buildCommand`, `outputDirectory`가 `null`인지 본다.
값이 있으면 그게 `vercel.json`을 덮고 있다.

---

## Vercel: type module 선언이 Corepack의 yarn 실행을 깨뜨린다

**발생일** 2026-08-26 · [#5](https://github.com/code0613/meins/issues/5)

**증상**
```
Error: Dynamic require of "util" is not supported
    at .../.vercel/cache/corepack/home/v1/yarn/4.14.1/yarn.js
```
Corepack이 Yarn 4를 내려받는 데까지는 성공하는데 실행이 안 된다.
**로컬에서는 재현되지 않는다.**

**원인**
Vercel은 Corepack 캐시를 **프로젝트 내부**(`./.vercel/cache/corepack/`)에 만든다.
루트 `package.json`의 `"type": "module"`이 그 안의 `yarn.js`에까지 적용되어,
CommonJS인 Yarn이 ESM으로 해석되면서 내부 `require()`가 실패한다.

로컬은 Corepack 캐시가 `~/.cache/node/corepack`에 있어 프로젝트 설정의 영향을 받지 않는다.

**해결**
`type: module`을 제거하고 `eslint.config.js`를 `eslint.config.mjs`로 바꾼다.
`.mjs`는 확장자만으로 ESM이 확정되므로 `type` 선언 없이 같은 목적을 달성한다.

**다음에 볼 것**
루트에 `type: module`을 넣기 전에 한 번 더 생각한다.
그 선언은 **하위 모든 `.js` 파일의 해석 방식**을 바꾼다.
도구가 프로젝트 안에 캐시나 산출물을 만드는 경우 함께 영향을 받는다.
설정 파일 하나의 경고를 없애는 목적이라면 `.mjs` 확장자가 부작용이 없다.

---

## Vercel: Yarn 1으로 설치해 workspace 프로토콜을 못 읽는다

**발생일** 2026-08-26 · [#3](https://github.com/code0613/meins/issues/3)

**증상**
```
yarn install v1.22.19
error Couldn't find package "@meins/components@workspace:^"
      required by "@meins/image-blur@1.0.0" on the "npm" registry.
```

**원인**
이 저장소는 Yarn 4인데 Vercel이 Yarn 1로 설치한다.
`package.json`에 `packageManager: "yarn@4.14.1"`이 있어도,
`ENABLE_EXPERIMENTAL_COREPACK=1` 환경변수가 없으면 Vercel은 Corepack을 켜지 않는다.

Yarn 1은 `workspace:^`가 Yarn 2+ 문법이라는 걸 모르고
npm 레지스트리의 패키지 이름으로 착각해 찾다가 실패한다.

**해결**
Vercel 환경변수에 `ENABLE_EXPERIMENTAL_COREPACK=1`을 추가한다 (production·preview·development 전부).

```bash
echo "1" | vercel env add ENABLE_EXPERIMENTAL_COREPACK production
```

**다음에 볼 것**
배포 로그의 `yarn install v...` 한 줄을 먼저 본다.
`1.x`가 찍혀 있으면 로컬과 다른 패키지 매니저로 돌고 있다는 뜻이고,
`yarn.lock`도 무시되고 있다고 봐야 한다.

## Vercel: 배포 설정이 레포 루트에 있으면 앱을 더 못 붙인다

**발생일** 2026-08-27 · [#23](https://github.com/code0613/meins/issues/23)

**증상**
증상이 나기 전에 구조로 먼저 막힌 경우다.
`apps/` 아래에 두 번째 앱을 만들면 배포할 방법이 없다.

**원인**
Vercel 프로젝트 하나는 출력 디렉터리를 하나만 가진다. 앱마다 프로젝트가 필요한데,
`vercel.json`은 프로젝트의 Root Directory에서만 읽힌다.
Root Directory가 레포 루트면 앱이 몇 개든 설정 파일은 하나뿐이다.

첫 배포 때 Root Directory가 `apps/image-blur`로 잡혀 있어 루트 `vercel.json`이 무시됐고,
그때 `rootDirectory: null`로 되돌려 급히 막았다. 그 임시 조치가 남아 있었다.

**해결**
`vercel.json`을 앱 안으로 옮기고 Root Directory를 그 앱으로 지정한다.
`outputDirectory`는 Root Directory 기준 상대 경로가 되므로 `apps/image-blur/dist` → `dist`.

```
Root Directory                              apps/image-blur
Include files outside of the Root Directory 켬
```

두 번째를 끄면 `libs/*`를 워크스페이스로 참조할 수 없어 위의 `workspace:^` 에러가 다시 난다.
Yarn 워크스페이스가 잡히면 Vercel이 알아서 켜주는 것으로 보이나, 안 되면 대시보드에서 직접 켠다.

**덤: 변경 없는 앱은 빌드를 건너뛴다**
앱이 둘이 되면 한쪽만 고쳐도 양쪽이 다 빌드된다.
`vercel.json`의 `ignoreCommand`로 막는다. 대시보드 대신 파일에 두면 앱마다 따로 관리된다.

```json
"ignoreCommand": "bash ../../scripts/vercel-ignore-build.sh apps/image-blur"
```

종료코드 0이면 건너뛰고 1이면 빌드한다. 헷갈리기 쉬운 방향이다.
비교 기준(`VERCEL_GIT_PREVIOUS_SHA` 또는 `HEAD^`)을 못 찾으면 건너뛰지 않는다.
빌드해야 하는데 건너뛰는 쪽이 더 위험하기 때문이다.

**다음에 볼 것**
배포 로그 맨 위의 `Running "bash ../../scripts/..."` 줄과 그 다음 줄을 본다.
건너뛴 배포는 로그가 거기서 끝난다.
