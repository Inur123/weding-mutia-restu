import assert from 'node:assert/strict';
import test from 'node:test';
import { listenToMediaQuery } from '../resources/js/lib/media-query-listener.ts';

void test('subscribes and unsubscribes with the modern media query API', () => {
    const calls = [];
    const callback = () => {};
    const mediaQuery = {
        addEventListener(type, listener) {
            calls.push(['addEventListener', type, listener]);
        },
        removeEventListener(type, listener) {
            calls.push(['removeEventListener', type, listener]);
        },
    };

    const unsubscribe = listenToMediaQuery(mediaQuery, callback);
    unsubscribe();

    assert.deepEqual(calls, [
        ['addEventListener', 'change', callback],
        ['removeEventListener', 'change', callback],
    ]);
});

void test('subscribes and unsubscribes with the legacy media query API', () => {
    const calls = [];
    const callback = () => {};
    const mediaQuery = {
        addListener(listener) {
            calls.push(['addListener', listener]);
        },
        removeListener(listener) {
            calls.push(['removeListener', listener]);
        },
    };

    const unsubscribe = listenToMediaQuery(mediaQuery, callback);
    unsubscribe();

    assert.deepEqual(calls, [
        ['addListener', callback],
        ['removeListener', callback],
    ]);
});
