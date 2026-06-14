import { defineConfig } from "rolldown";

const undiciImport = "import { ProxyAgent } from 'undici';";

export default defineConfig({
    input: "src/index.ts",
    platform: "node",
    plugins: [
        {
            name: "replace-undici",
            transform: {
                filter: {
                    id: /@actions[/\\]http-client[/\\]lib[/\\]index\.js$/,
                    code: undiciImport,
                },
                handler(code, id) {
                    if (!code.includes(undiciImport)) {
                        this.error(`Expected to find ${undiciImport} in ${id}`);
                    }

                    return {
                        code: code.replace(undiciImport, "const ProxyAgent = undefined;"),
                        map: null,
                    };
                },
            },
        },
    ],
    checks: {
        eval: false,
    },
    output: {
        file: "dist/index.js",
        format: "cjs",
    },
    transform: {
        target: "node24",
    },
});
