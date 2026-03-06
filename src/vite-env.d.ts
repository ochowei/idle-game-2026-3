/// <reference types="vite/client" />

declare namespace React {
  namespace JSX {
    interface IntrinsicAttributes {
      key?: string | number | bigint | null;
    }
  }
}
