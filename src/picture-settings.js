const HdrDynamicToneMappingValues = {
    off: 'off',
    on: 'on',
    HGIG: 'HGIG',
    hgig: 'HGIG'
};

export function normalizeHdrDynamicToneMapping(value) {
    const normalized = HdrDynamicToneMappingValues[value];
    if (!normalized) {
        throw new Error(`Unsupported HDR Dynamic Tone Mapping value: ${value}`);
    }

    return normalized;
}

export function createHdrDynamicToneMappingPayload(value) {
    return {
        category: 'picture',
        settings: {
            hdrDynamicToneMapping: normalizeHdrDynamicToneMapping(value)
        }
    };
}
