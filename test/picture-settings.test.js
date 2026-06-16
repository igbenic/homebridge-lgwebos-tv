import assert from 'node:assert/strict';
import test from 'node:test';

import {
    createHdrDynamicToneMappingPayload,
    createHdrDynamicToneMappingReadPayload,
    getHdrDynamicToneMappingModeStates,
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

test('creates the LG picture read payload for HDR Dynamic Tone Mapping', () => {
    assert.deepEqual(createHdrDynamicToneMappingReadPayload(), {
        category: 'picture',
        keys: ['hdrDynamicToneMapping']
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

test('maps HDR Dynamic Tone Mapping values to mutually exclusive switch states', () => {
    const modes = [
        { reference: 'on' },
        { reference: 'off' },
        { reference: 'HGIG' }
    ];

    assert.deepEqual(getHdrDynamicToneMappingModeStates(modes, 'hgig', true), [false, false, true]);
    assert.deepEqual(getHdrDynamicToneMappingModeStates(modes, 'on', true), [true, false, false]);
});

test('turns all HDR Dynamic Tone Mapping switches off when the TV is off', () => {
    const modes = [
        { reference: 'on' },
        { reference: 'off' },
        { reference: 'HGIG' }
    ];

    assert.deepEqual(getHdrDynamicToneMappingModeStates(modes, 'HGIG', false), [false, false, false]);
});
