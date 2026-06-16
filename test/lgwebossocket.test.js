import assert from 'node:assert/strict';
import test from 'node:test';

import { createAlertPayload } from '../src/lgwebossocket.js';

test('creates the default modal alert payload used by existing commands', () => {
    assert.deepEqual(createAlertPayload('luna://example/set', { value: 1 }, 'Title', 'Message'), {
        title: 'Title',
        message: 'Message',
        modal: true,
        buttons: [{ label: 'Ok', focus: true, buttonType: 'ok', onClick: 'luna://example/set', params: { value: 1 } }],
        onclose: { uri: 'luna://example/set', params: { value: 1 } },
        onfail: { uri: 'luna://example/set', params: { value: 1 } },
        type: 'confirm',
        timeout: 0
    });
});

test('creates a non-modal timed alert payload for temporary settings commands', () => {
    assert.deepEqual(createAlertPayload('luna://example/set', { value: 1 }, 'Title', 'Message', { modal: false, timeout: 2000 }), {
        title: 'Title',
        message: 'Message',
        modal: false,
        buttons: [{ label: 'Ok', focus: true, buttonType: 'ok', onClick: 'luna://example/set', params: { value: 1 } }],
        onclose: { uri: 'luna://example/set', params: { value: 1 } },
        onfail: { uri: 'luna://example/set', params: { value: 1 } },
        type: 'confirm',
        timeout: 2000
    });
});
