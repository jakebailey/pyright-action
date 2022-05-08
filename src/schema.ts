import myzod, { Infer } from 'myzod';
import SemVer from 'semver/classes/semver';

export type Position = Infer<typeof Position>;
const Position = myzod
    .object({
        line: myzod.number(),
        character: myzod.number(),
    })
    .allowUnknownKeys();

function isEmptyPosition(p: Position) {
    return p.line === 0 && p.character === 0;
}

export type Range = Infer<typeof Range>;
const Range = myzod
    .object({
        start: Position,
        end: Position,
    })
    .allowUnknownKeys();

export function isEmptyRange(r: Range) {
    return isEmptyPosition(r.start) && isEmptyPosition(r.end);
}

export type Diagnostic = Infer<typeof Diagnostic>;
const Diagnostic = myzod
    .object({
        file: myzod.string(),
        severity: myzod.literals('error', 'warning', 'information'),
        message: myzod.string(),
        rule: myzod.string().optional(),
        range: Range.optional(),
    })
    .allowUnknownKeys();

export type Report = Infer<typeof Report>;
const Report = myzod
    .object({
        generalDiagnostics: myzod.array(Diagnostic),
        summary: myzod
            .object({
                errorCount: myzod.number(),
                warningCount: myzod.number(),
                informationCount: myzod.number(),
            })
            .allowUnknownKeys(),
    })
    .allowUnknownKeys();

export function parseReport(v: unknown): Report {
    return Report.parse(v);
}

function isSemVer(version: string): boolean {
    try {
        new SemVer(version);
        return true;
    } catch {
        return false;
    }
}

export type NpmRegistryResponse = Infer<typeof NpmRegistryResponse>;
const NpmRegistryResponse = myzod
    .object({
        version: myzod.string().withPredicate(isSemVer, 'must be a semver'),
        dist: myzod
            .object({
                tarball: myzod.string(),
            })
            .allowUnknownKeys(),
    })
    .allowUnknownKeys();

export function parseNpmRegistryResponse(v: unknown): NpmRegistryResponse {
    return NpmRegistryResponse.parse(v);
}
