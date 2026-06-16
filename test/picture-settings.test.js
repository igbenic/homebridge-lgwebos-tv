import assert from 'node:assert/strict';
import test from 'node:test';

import {
    createHdrDynamicToneMappingPayload,
    normalizeHdrDynamicToneMapping
} from '../src/picture-settings.js';

test('creates the LG picture payload for HDR Dynamic Tone Mapping', () => {
    assert.deepEqual(createHdrDynamicToneMappingPayload('HGIG'), {
        category: 'picture',
        settings: {
            hdrDynamicToneMapping: 'HGIG'
        }
    });
});

test('normalizes supported HDR Dynamic Tone Mapping values', () => {
    assert.equal(normalizeHdrDynamicToneMapping('off'), 'off');
    assert.equal(normalizeHdrDynamicToneMapping('on'), 'on');
    assert.equal(normalizeHdrDynamicToneMapping('HGIG'), 'HGIG');
    assert.equal(normalizeHdrDynamicToneMapping('hgig'), 'HGIG');
});

test('rejects unsupported HDR Dynamic Tone Mapping values', () => {
    assert.throws(
        () => createHdrDynamicToneMappingPayload('auto'),
        /Unsupported HDR Dynamic Tone Mapping value/
    );
});
