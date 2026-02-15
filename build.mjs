import fs from "node:fs/promises";

import esbuild from "esbuild";

const result = await esbuild.build({
    logLevel: "info",
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    platform: "node",
    target: "node24",
    metafile: true,
    plugins: [
        {
            name: "replace-undici",
            setup(build) {
                build.onLoad({ filter: /undici\/index.js$/ }, () => {
                    return {
                        contents: "module.exports = {}",
                    };
                });
            },
        },
    ],
});

await fs.writeFile("dist/meta.json", JSON.stringify(result.metafile, undefined, 2));
