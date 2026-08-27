/*
 *  MIT 등 대부분의 라이선스가 사본에 저작권 고지 포함을 조건으로 건다.
 *  실행 의존성만 모은다. devDependencies는 사용자에게 전달되지 않는다.
 *
 *  yarn licenses
 */
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const nodeModules = join(root, 'node_modules');

const LICENSE_FILE_PATTERN = /^(LICENSE|LICENCE|COPYING)(\..*)?$/i;

function collectProductionPackages() {
  const appPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const queue = Object.keys(appPkg.dependencies ?? {});
  const seen = new Set();

  while (queue.length > 0) {
    const name = queue.shift();
    if (seen.has(name)) {
      continue;
    }
    seen.add(name);

    const manifest = readManifest(name);
    if (manifest) {
      queue.push(...Object.keys(manifest.dependencies ?? {}));
    }
  }

  return [...seen].sort();
}

function readManifest(name) {
  try {
    return JSON.parse(readFileSync(join(nodeModules, name, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
}

function readLicenseText(name) {
  try {
    const dir = join(nodeModules, name);
    const file = readdirSync(dir).find(entry => LICENSE_FILE_PATTERN.test(entry));
    if (!file) {
      return null;
    }
    return readFileSync(join(dir, file), 'utf8').trim();
  } catch {
    return null;
  }
}

function normalizeLicense(manifest) {
  const { license, licenses } = manifest;
  if (typeof license === 'string') {
    return license;
  }
  if (license?.type) {
    return license.type;
  }
  if (Array.isArray(licenses)) {
    return licenses.map(entry => entry.type ?? entry).join(', ');
  }
  return 'UNKNOWN';
}

function normalizeAuthor(manifest) {
  const { author } = manifest;
  if (typeof author === 'string') {
    return author;
  }
  return author?.name ?? null;
}

function normalizeRepository(manifest) {
  const url = typeof manifest.repository === 'string' ? manifest.repository : manifest.repository?.url;
  if (!url) {
    return null;
  }
  return url
    .replace(/^git\+/, '')
    .replace(/^git:\/\//, 'https://')
    .replace(/\.git$/, '');
}

const packages = collectProductionPackages()
  .map(name => {
    const manifest = readManifest(name);
    if (!manifest) {
      return null;
    }
    return {
      name,
      version: manifest.version,
      license: normalizeLicense(manifest),
      author: normalizeAuthor(manifest),
      repository: normalizeRepository(manifest),
      licenseText: readLicenseText(name),
    };
  })
  .filter(Boolean);

const missing = packages.filter(pkg => !pkg.licenseText);
const output = join(root, 'src/features/Licenses/data/licenses.json');
writeFileSync(output, `${JSON.stringify(packages, null, 2)}\n`);

console.log(`패키지 ${packages.length}개 수집`);
console.log(`라이선스 전문 없음: ${missing.length}개${missing.length ? ` (${missing.map(p => p.name).join(', ')})` : ''}`);

const byLicense = packages.reduce((acc, pkg) => {
  acc[pkg.license] = (acc[pkg.license] ?? 0) + 1;
  return acc;
}, {});
console.log('라이선스 분포:', byLicense);
