/// <reference types="astro/client" />

declare module "*.css" {}

interface ImportMetaEnv {
  readonly SQUARE_ACCESS_TOKEN?: string;
  readonly SQUARE_LOCATION_ID?: string;
  readonly SQUARE_ENVIRONMENT?: "sandbox" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
