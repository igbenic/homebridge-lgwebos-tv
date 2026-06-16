import assert from 'node:assert/strict';
import test from 'node:test';

import LgWebOsSocket, {
    createAlertPayload,
    createLunaRequestAlertPayload,
    resolveResponsePayload
} from '../src/lgwebossocket.js';
import { ApiUrls } from '../src/constants.js';

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

test('creates a minimal Luna request alert payload', () => {
    assert.deepEqual(createLunaRequestAlertPayload('luna://example/set', { value: 1 }), {
        message: ' ',
        buttons: [{ label: '', focus: true, buttonType: 'ok', onClick: 'luna://example/set', params: { value: 1 } }],
        onclose: { uri: 'luna://example/set', params: { value: 1 } },
        onfail: { uri: 'luna://example/set', params: { value: 1 } },
        timeout: 0
    });
});

test('resolves successful response payloads', () => {
    assert.deepEqual(resolveResponsePayload({
        type: 'response',
        payload: {
            returnValue: true,
            settings: {
                hdrDynamicToneMapping: 'HGIG'
            }
        }
    }), {
        returnValue: true,
        settings: {
            hdrDynamicToneMapping: 'HGIG'
        }
    });
});

test('rejects LG error responses', () => {
    assert.throws(
        () => resolveResponsePayload({
            type: 'error',
            error: '401 insufficient permissions',
            payload: {
                returnValue: false
            }
        }),
        /401 insufficient permissions/
    );
});

test('sends a request and resolves it from the matching socket response', async () => {
    const socket = new LgWebOsSocket({ host: 'lgwebostv' }, '', '', '', '', false, false);
    let sentMessage;
    socket.socketOpen = true;
    socket.socket = {
        send(content, callback) {
            sentMessage = JSON.parse(content);
            callback();
        }
    };

    const response = socket.request(ApiUrls.SetSystemSettingsDirect, { category: 'picture' }, 'hdr-1');
    assert.deepEqual(sentMessage, {
        id: 'hdr-1',
        type: 'request',
        uri: ApiUrls.SetSystemSettingsDirect,
        payload: { category: 'picture' }
    });

    assert.equal(socket.resolvePendingRequest({
        id: 'hdr-1',
        type: 'response',
        payload: { returnValue: true }
    }), true);
    assert.deepEqual(await response, { returnValue: true });
});

test('uses a minimal alert trampoline for Luna requests on webOS 24 and newer', async () => {
    const socket = new LgWebOsSocket({ host: 'lgwebostv' }, '', '', '', '', false, false);
    const requests = [];
    const buttons = [];
    socket.tvInfo.webOS = 25.0;
    socket.request = async (uri, payload, cid) => {
        requests.push({ uri, payload, cid });
        return { returnValue: true, alertId: 'alert-1' };
    };
    socket.send = async (type, uri, payload) => {
        buttons.push({ type, uri, payload });
        return true;
    };

    assert.equal(await socket.lunaRequest('luna://example/set', { value: 1 }, 'luna-1'), true);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].uri, ApiUrls.CreateAlert);
    assert.deepEqual(requests[0].payload, createLunaRequestAlertPayload('luna://example/set', { value: 1 }));
    assert.deepEqual(buttons, [{ type: 'button', uri: undefined, payload: { name: 'ENTER' } }]);
});
