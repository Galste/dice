import {assertEquals} from 'https://deno.land/std/testing/asserts.ts';
import {range, returnOne} from './util.ts';

Deno.test('util::range One argument', () => {
    let i = 1;
    for (const n of range(10)) {
        assertEquals(n, i++);
    }
    assertEquals(i, 11);
});

Deno.test('util::range One negative argument', () => {
    let i = -1;
    for (const n of range(-10)) {
        assertEquals(n, i--);
    }
    assertEquals(i, -11);
});

Deno.test('util::range Two arguments', () => {
    let i = -5;
    for (const n of range(-5, 5)) {
        assertEquals(n, i++);
    }
    assertEquals(i, 6);
});

Deno.test('util::range Reverse', () => {
    let i = 5;
    for (const n of range(5, -5)) {
        assertEquals(n, i--);
    }
    assertEquals(i, -6);
});

Deno.test('util::range Zero', () => {
    let i = 5;
    for (const n of range(0)) {
        i++;
    }
    assertEquals(i, 5);
});

Deno.test('util::returnOne Returns one', () => {
    assertEquals(returnOne(), 1);
});
