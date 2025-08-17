// @ts-check
import eslint from "@eslint/js";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        files: ["**/*.{ts,tsx,cts,mts,js,cjs,mjs}"],
    },
    {
        ignores: [
            "**/dist/**",
            "**/node_modules/**",
            "coverage/**",
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylistic,
    eslintPluginUnicorn.configs["flat/recommended"],
    {
        languageOptions: {
            parserOptions: {
                warnOnUnsupportedTypeScriptVersion: false,
                ecmaVersion: "latest",
                sourceType: "module",
                project: true,
            },
            globals: globals.node,
        },
        plugins: {
            "simple-import-sort": eslintPluginSimpleImportSort,
        },
    },
    {
        "rules": {
            "eqeqeq": "error",
            "no-constant-condition": "off",
            "no-inner-declarations": "off",
            "no-undef": "off",
            "no-unused-vars": "off", // Doesn't work in TS.
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/camelcase": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-this-alias": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-use-before-define": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-import-type-side-effects": "error",
            "unicorn/catch-error-name": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-await-expression-member": "off",
            "unicorn/no-useless-undefined": "off",
            "unicorn/prevent-abbreviations": "off",
            "unicorn/switch-case-braces": "off",
            "unicorn/no-empty-file": "off",
            "unicorn/import-style": "off",
            "unicorn/prefer-module": "off",
        },
    },
    {
        files: [
            ".ncurc.cjs",
            "eslint.config.mjs",
        ],
        extends: [tseslint.configs.disableTypeChecked],
    },
);
