const HdrDynamicToneMappingValues = {
    off: 'off',
    on: 'on',
    HGIG: 'HGIG',
    hgig: 'HGIG'
};

export const HdrDynamicToneMappingAlertOptions = Object.freeze({
    modal: false,
    timeout: 1,
    autoClose: false
});

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

export function getHdrDynamicToneMappingModeStates(modes, value, power) {
    if (!power || !value) {
        return modes.map(() => false);
    }

    let normalizedValue;
    try {
        normalizedValue = normalizeHdrDynamicToneMapping(value);
    } catch {
        return modes.map(() => false);
    }

    return modes.map((mode) => {
        try {
            return normalizeHdrDynamicToneMapping(mode.reference) === normalizedValue;
        } catch {
            return false;
        }
    });
}
