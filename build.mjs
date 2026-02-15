import esbuild from "esbuild";

await esbuild.build({
    logLevel: "info",
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    platform: "node",
    target: "node24",
    mainFields: ["module", "main"],
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
