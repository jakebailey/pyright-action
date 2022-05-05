import myzod, { Infer } from 'myzod';
import SemVer from 'semver/classes/semver';

export type Position = Infer<typeof Position>;
const Position = myzod.object({
    line: myzod.number(),
    character: myzod.number(),
});

function isEmptyPosition(p: Position) {
    return p.line === 0 && p.character === 0;
}

export type Range = Infer<typeof Range>;
const Range = myzod.object({
    start: Position,
    end: Position,
});

export function isEmptyRange(r: Range) {
    return isEmptyPosition(r.start) && isEmptyPosition(r.end);
}

export type Diagnostic = Infer<typeof Diagnostic>;
const Diagnostic = myzod.object({
    file: myzod.string(),
    severity: myzod.literals('error', 'warning', 'information'),
    message: myzod.string(),
    rule: myzod.string().optional(),
    range: Range.optional(),
});

export type Report = Infer<typeof Report>;
export const Report = myzod.object({
    generalDiagnostics: myzod.array(Diagnostic),
    summary: myzod.object({
        errorCount: myzod.number(),
        warningCount: myzod.number(),
        informationCount: myzod.number(),
    }),
});

export type NpmRegistryResponse = Infer<typeof NpmRegistryResponse>;
export const NpmRegistryResponse = myzod.object({
    version: myzod.string().withPredicate((value) => !!new SemVer(value), 'must be a semver'),
});
