import * as v from "@badrap/valita";
import { SemVer } from "semver";

export type Position = v.Infer<typeof Position>;
const Position = v.object({
    line: v.number(),
    character: v.number(),
});

function isEmptyPosition(p: Position) {
    return p.line === 0 && p.character === 0;
}

export type Range = v.Infer<typeof Range>;
const Range = v.object({
    start: Position,
    end: Position,
});

export function isEmptyRange(r: Range) {
    return isEmptyPosition(r.start) && isEmptyPosition(r.end);
}

export type FileStat = v.Infer<typeof FileStat>;
const FileStat = v.object({
    path: v.string(),
    timeInSec: v.number(),
});

export type VerifyTypesStats = v.Infer<typeof VerifyTypesStats>;
const VerifyTypesStats = v.object({
    packageName: v.string().optional(),
    completenessScore: v.number().optional(),
    moduleCount: v.number().optional(),
    symbolCount: v.number().optional(),
    completedSymbolCount: v.number().optional(),
    missingFunctionDocStringCount: v.number().optional(),
    missingClassDocStringCount: v.number().optional(),
    missingDefaultParamCount: v.number().optional(),
    missingFunctionVarArgTypeCount: v.number().optional(),
    missingFunctionKwArgTypeCount: v.number().optional(),
});

export type Diagnostic = v.Infer<typeof Diagnostic>;
const Diagnostic = v.object({
    file: v.string(),
    severity: v.union(v.literal("error"), v.literal("warning"), v.literal("information")),
    message: v.string(),
    rule: v.string().optional(),
    range: Range.optional(),
});

export type Report = v.Infer<typeof Report>;
const Report = v.object({
    generalDiagnostics: v.array(Diagnostic),
    summary: v.object({
        errorCount: v.number(),
        warningCount: v.number(),
        informationCount: v.number(),
        filesAnalyzed: v.number().optional(),
        timeInSec: v.number().optional(),
    }),
    stats: v.object({
        requiresTypeIgnoreComment: v.number().optional(),
        files: v.array(FileStat).optional(),
    }).optional(),
    verifyTypesStats: VerifyTypesStats.optional(),
});

export function parseReport(v: unknown): Report {
    return Report.parse(v, { mode: "strip" });
}

function isSemVer(version: string): boolean {
    try {
        new SemVer(version);
        return true;
    } catch {
        return false;
    }
}

export type NpmRegistryResponse = v.Infer<typeof NpmRegistryResponse>;
const NpmRegistryResponse = v.object({
    version: v.string().assert(isSemVer, "must be a semver"),
    dist: v.object({
        tarball: v.string(),
    }),
});

export function parseNpmRegistryResponse(v: unknown): NpmRegistryResponse {
    return NpmRegistryResponse.parse(v, { mode: "strip" });
}

export type PylanceBuildMetadata = v.Infer<typeof PylanceBuildMetadata>;
const PylanceBuildMetadata = v.object({
    pylanceVersion: v.string().assert(isSemVer, "must be a semver"),
    pyrightVersion: v.string().assert(isSemVer, "must be a semver"),
});

export function parsePylanceBuildMetadata(v: unknown): PylanceBuildMetadata {
    return PylanceBuildMetadata.parse(v, { mode: "strip" });
}
