/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_42_AUTH_URL: string;
  // 다른 환경 변수들에 대한 타입 정의...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
