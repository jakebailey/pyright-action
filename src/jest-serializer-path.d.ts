declare module "jest-serializer-path" {
    export const print: import("@vitest/pretty-format").OldPlugin["print"];
    export const test: import("@vitest/pretty-format").OldPlugin["test"];
}
