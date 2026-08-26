export interface LicenseEntry {
  name: string;
  version: string;
  license: string;
  author: string | null;
  repository: string | null;
  /** 패키지에 LICENSE 파일이 없으면 null */
  licenseText: string | null;
}
