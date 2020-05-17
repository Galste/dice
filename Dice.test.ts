import {assertEquals, assertStrictEq} from "https://deno.land/std/testing/asserts.ts";
import {Dice} from "./Dice.ts";

type Foo = {foo: number};
type IndividualFnArgs = {value: Foo, count: number; counts: Map<Foo, number>, pick: number};

const low = new Dice(() => 0);
const mid = new Dice(() => 0.5);
const high = new Dice(() => 0.9999999999999999);

const weightedNumbersEvenDist = [
    {value: 4, weight: 1},
    {value: 8, weight: 1},
    {value: 15, weight: 1},
    {value: 16, weight: 1},
    {value: 23, weight: 1},
    {value: 42, weight: 1},
    {value: 108, weight: 1},
];

const weightedNumbersExpDist = [
    {value: 4, weight: 1},
    {value: 8, weight: 2},
    {value: 15, weight: 4},
    {value: 16, weight: 8},
    {value: 23, weight: 16},
    {value: 42, weight: 32},
    {value: 108, weight: 64},
];

const weightedRefsEvenDist = [
    {value: {'foo': 4}, weight: 1},
    {value: {'foo': 8}, weight: 1},
    {value: {'foo': 15}, weight: 1},
    {value: {'foo': 16}, weight: 1},
    {value: {'foo': 23}, weight: 1},
    {value: {'foo': 42}, weight: 1},
    {value: {'foo': 108}, weight: 1},
];

const weightedRefsZeroSum = [
    {value: {'foo': 4}, weight: 0},
    {value: {'foo': 8}, weight: 0},
    {value: {'foo': 15}, weight: 0},
    {value: {'foo': 16}, weight: 0},
    {value: {'foo': 23}, weight: 0},
    {value: {'foo': 42}, weight: 0},
    {value: {'foo': 108}, weight: 0},
];

Deno.test('Dice#integer Low', () => {
    assertEquals(low.integer(-42, 108), -42);
});

Deno.test('Dice#integer Mid', () => {
    assertEquals(mid.integer(-42, 108), 33);
});

Deno.test('Dice#integer High', () => {
    assertEquals(high.integer(-42, 108), 108);
});

Deno.test('Dice#real Low', () => {
    assertEquals(low.real(-42.5, 108.5), -42.5);
});

Deno.test('Dice#real Mid', () => {
    assertEquals(mid.real(-42.5, 108.5), 33);
});

Deno.test('Dice#real High', () => {
    assertEquals(high.real(-42.5, 108.5), 108.49999999999997);
});

Deno.test('Dice#integers Positive count', () => {
    assertEquals(mid.integers(-42, 108, 3), [33, 33, 33]);
});

Deno.test('Dice#integers Alt count', () => {
    assertEquals(mid.integers(-42, 108, {min: 1, max: 3}), [33, 33]);
});

Deno.test('Dice#integers Zero count', () => {
    assertEquals(mid.integers(-42, 108, 0), []);
});

Deno.test('Dice#integers Negative count', () => {
    assertEquals(mid.integers(-42, 108, -2), [33, 33]);
});

Deno.test('Dice#integers Negative real count', () => {
    assertEquals(mid.integers(-42, 108, -Math.PI), [33, 33, 33, 33]);
});

Deno.test('Dice#reals Positive count', () => {
    assertEquals(mid.integers(-42.5, 108.5, 3), [33, 33, 33]);
});


Deno.test('Dice#reals Alt count', () => {
    assertEquals(mid.reals(-42.5, 108.5, {min: 1, max: 3}), [33, 33]);
});

Deno.test('Dice#reals Zero count', () => {
    assertEquals(mid.integers(-42.5, 108.5, 0), []);
});

Deno.test('Dice#reals Negative count', () => {
    assertEquals(mid.integers(-42.5, 108.5, -2), [33, 33]);
});

Deno.test('Dice#reals Negative real count', () => {
    assertEquals(mid.integers(-42.5, 108.5, -Math.PI), [33, 33, 33, 33]);
});

Deno.test('Dice#weightedPick Low even', () => {
    assertEquals(low.weightedPick(weightedNumbersEvenDist), 4);
});

Deno.test('Dice#weightedPick Mid even', () => {
    assertEquals(mid.weightedPick(weightedNumbersEvenDist), 16);
});

Deno.test('Dice#weightedPick High even', () => {
    assertEquals(high.weightedPick(weightedNumbersEvenDist), 108);
});

Deno.test('Dice#weightedPick Empty', () => {
    assertStrictEq(high.weightedPick([]), undefined);
});

Deno.test('Dice#weightedPick Uneven', () => {
    assertStrictEq(mid.weightedPick(weightedNumbersExpDist), weightedNumbersExpDist[6].value);
});

Deno.test('Dice#weightedPick Refs equal', () => {
    assertStrictEq(mid.weightedPick(weightedRefsEvenDist), weightedRefsEvenDist[3].value);
});

Deno.test('Dice#weightedPick Zero weight sum', () => {
    assertStrictEq(mid.weightedPick(weightedRefsZeroSum), undefined);
});

Deno.test('Dice#weightedPick Zero weight sum with default', () => {
    assertStrictEq(mid.weightedPick(
        weightedRefsZeroSum,
        {default: weightedRefsZeroSum[4].value},
    ), weightedRefsZeroSum[4].value);
});

Deno.test('Dice#weightedPick Zero weight sum with normalize true', () => {
    assertStrictEq(mid.weightedPick(
        weightedRefsZeroSum,
        {normalize: true},
    ), weightedRefsZeroSum[3].value);
});

Deno.test('Dice#weightedPick Zero weight sum with normalize fn', () => {
    assertStrictEq(mid.weightedPick(
        weightedRefsZeroSum,
        {normalize: (value) => value.foo % 2},
    ), weightedRefsZeroSum[2].value);
});

Deno.test('Dice#weightedPick Zero weight sum with failed normalize fn, no default', () => {
    assertStrictEq(mid.weightedPick(
        weightedRefsZeroSum,
        {normalize: () => 0},
    ), undefined);
});

Deno.test('Dice#weightedPick Zero weight sum with failed normalize fn, with default', () => {
    assertStrictEq(mid.weightedPick(
        weightedRefsZeroSum,
        {normalize: () => 0, default: weightedRefsZeroSum[4].value},
    ), weightedRefsZeroSum[4].value);
});

Deno.test('Dice#weightedSample Low', () => {
    assertEquals(low.weightedSample(weightedRefsEvenDist, 3), Array.from({length: 3}, () => weightedRefsEvenDist[0].value));
});

Deno.test('Dice#weightedSample Mid', () => {
    assertEquals(mid.weightedSample(weightedRefsEvenDist, 3), Array.from({length: 3}, () => weightedRefsEvenDist[3].value));
});

Deno.test('Dice#weightedSample High', () => {
    assertEquals(high.weightedSample(weightedRefsEvenDist, 3), Array.from({length: 3}, () => weightedRefsEvenDist[6].value));
});

Deno.test('Dice#weightedSample Zero samples', () => {
    assertEquals(mid.weightedSample(weightedRefsEvenDist, 0), []);
});

Deno.test('Dice#weightedSample Samples > length', () => {
    const samples = weightedRefsEvenDist.length + 1;
    const sampled = mid.weightedSample(weightedRefsEvenDist, samples);
    assertEquals(sampled, Array.from({length: samples}, () => weightedRefsEvenDist[3].value));
});

Deno.test('Dice#weightedSample Unique true', () => {
    assertEquals(
        mid.weightedSample(weightedRefsEvenDist, 3, {unique: true}),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[4].value,
        ],
    );
});

Deno.test('Dice#weightedSample Unique false', () => {
    assertEquals(
        mid.weightedSample(weightedRefsEvenDist, 3, {unique: false}),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
        ],
    );
});

Deno.test('Dice#weightedSample Unique number', () => {
    assertEquals(
        mid.weightedSample(weightedRefsEvenDist, 6, {unique: 2}),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[4].value,
            weightedRefsEvenDist[4].value,
        ],
    );
});

Deno.test('Dice#weightedSample Unique number less than 1 same as 1', () => {
    assertEquals(
        mid.weightedSample(weightedRefsEvenDist, 3, {unique: 0}),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[4].value,
        ],
    );
});

Deno.test('Dice#weightedSample Unique function args, unique function returns true', () => {
    let pickCount = 0;
    assertEquals(
        mid.weightedSample(weightedRefsEvenDist, 3, {unique: ({value, count, counts, pick}) => {
            const unique = value.foo % 2 === 0;
            assertEquals(count, counts.get(value));
            assertEquals(pick, ++pickCount);
            return unique;
        }}),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[2].value,
        ],
    );
});

Deno.test('Dice#weightedSample Unique function returns false', () => {
    assertEquals(
        mid.weightedSample(weightedRefsEvenDist, 4, {unique: () => {
            return false;
        }}),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
        ],
    );
});

Deno.test('Dice#weightedSample Unique function returns number', () => {
    assertEquals(
        mid.weightedSample(weightedRefsEvenDist, 4, {unique: ({value}) => {
            return 2 - value.foo % 2;
        }}),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[4].value,
        ],
    );
});

Deno.test('Dice#weightedSample Unique function returns number less than 1 same as 1', () => {
    assertEquals(
        mid.weightedSample(weightedRefsEvenDist, 3, {unique: ({value}) => {
            return 0;
        }}),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[4].value,
        ],
    );
});

Deno.test('Dice#weightedSample Individual unique boolean', () => {
    const weightedRefsEvenDistWithUnique = weightedRefsEvenDist.map((item) => ({
        ...item,
        unique: item.value.foo % 2 === 0,
    }));
    assertEquals(
        mid.weightedSample(weightedRefsEvenDistWithUnique, 3),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[2].value,
        ],
    );
});

Deno.test('Dice#weightedSample Individual unique number', () => {
    const weightedRefsEvenDistWithUnique = weightedRefsEvenDist.map((item) => ({
        ...item,
        unique: 2 - item.value.foo % 2,
    }));
    assertEquals(
        mid.weightedSample(weightedRefsEvenDistWithUnique, 4),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[4].value,
        ],
    );
});

Deno.test('Dice#weightedSample Individual unique function args, returns true', () => {
    let pickCount = 0;
    const weightedRefsEvenDistWithUnique = weightedRefsEvenDist.map((item) => ({
        ...item,
        unique: ({value, count, counts, pick}: IndividualFnArgs) => {
            const unique = value.foo % 2 === 0;
            assertEquals(count, counts.get(value));
            assertEquals(pick, ++pickCount);
            return unique;
        },
    }));
    assertEquals(
        mid.weightedSample(weightedRefsEvenDistWithUnique, 3),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[2].value,
        ],
    );
});

Deno.test('Dice#weightedSample Individual unique function returns false', () => {
    const weightedRefsEvenDistWithUnique = weightedRefsEvenDist.map((item) => ({
        ...item,
        unique: () => {
            return false;
        },
    }));
    assertEquals(
        mid.weightedSample(weightedRefsEvenDistWithUnique, 3),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
        ],
    );
});

Deno.test('Dice#weightedSample Individual unique function returns number', () => {
    const weightedRefsEvenDistWithUnique = weightedRefsEvenDist.map((item) => ({
        ...item,
        unique: () => {
            return 2;
        },
    }));
    assertEquals(
        mid.weightedSample(weightedRefsEvenDistWithUnique, 6),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[4].value,
            weightedRefsEvenDist[4].value,
        ],
    );
});

Deno.test('Dice#weightedSample Individual unique function returns number less than 1 same as 1', () => {
    const weightedRefsEvenDistWithUnique = weightedRefsEvenDist.map((item) => ({
        ...item,
        unique: () => {
            return 0;
        },
    }));
    assertEquals(
        mid.weightedSample(weightedRefsEvenDistWithUnique, 3),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[2].value,
            weightedRefsEvenDist[4].value,
        ],
    );
});

Deno.test('Dice#weightedSample Individual weight function', () => {
    let pickCount = 0;
    const weightedRefsUnevenDist = weightedRefsEvenDist.map((item) => ({
        ...item,
        weight: ({value, count, counts, pick}: IndividualFnArgs) => {
            const weight = count > 0 ? 0 : 1 - value.foo % 2;
            assertEquals(count, counts.get(value));
            assertEquals(pick, Math.ceil(++pickCount / weightedRefsUnevenDist.length));
            return weight;
        },
    }));
    assertEquals(
        mid.weightedSample(weightedRefsUnevenDist, 3),
        [
            weightedRefsEvenDist[3].value,
            weightedRefsEvenDist[1].value,
            weightedRefsEvenDist[5].value,
        ],
    );
});

Deno.test('Dice#pick Non-empty argument', () => {
    assertEquals(mid.pick([4, 8, 15, 16, 23, 42, 108]), 16);
});

Deno.test('Dice#pick Empty argument', () => {
    assertEquals(mid.pick([]), undefined);
});

Deno.test('Dice#sample Default unique true', () => {
    assertEquals(mid.sample([4, 8, 15, 16, 23, 42, 108], 3), [16, 15, 23]);
});

Deno.test('Dice#sample Empty argument', () => {
    assertEquals(mid.sample([], 3), []);
});

Deno.test('Dice#sample Default count 1', () => {
    assertEquals(mid.sample([4, 8, 15, 16, 23, 42, 108]), [16]);
});

Deno.test('Dice#sample Unique override', () => {
    assertEquals(mid.sample([4, 8, 15, 16, 23, 42, 108], 3, {unique: false}), [16, 16, 16]);
});

Deno.test('Dice#shuffle', () => {
    assertEquals(mid.shuffle([4, 8, 15, 16, 23, 42, 108]), [16, 15, 23, 8, 42, 4, 108]);
});

Deno.test('Dice#roll Default argument', () => {
    assertEquals(mid.roll(), {sum: 3, dice: [{d: 6, rolled: 3}]});
});

Deno.test('Dice#roll Number argument', () => {
    assertEquals(mid.roll(10), {sum: 5, dice: [{d: 10, rolled: 5}]});
});

Deno.test('Dice#roll Array argument', () => {
    assertEquals(mid.roll([6, 10, 20]), {sum: 18, dice: [{d: 6, rolled: 3}, {d: 10, rolled: 5}, {d: 20, rolled: 10}]});
});

Deno.test('Dice#roll Number argument', () => {
    assertEquals(mid.rolls(6, 2), {sum: 6, rolls: [{sum: 3, dice: [{d: 6, rolled: 3}]}, {sum: 3, dice: [{d: 6, rolled: 3}]}]});
});

Deno.test('Dice#roll Alternative count', () => {
    assertEquals(mid.rolls(6, {min: 1, max: 3}), {sum: 6, rolls: [{sum: 3, dice: [{d: 6, rolled: 3}]}, {sum: 3, dice: [{d: 6, rolled: 3}]}]});
});

Deno.test('Dice#roll Array argument', () => {
    assertEquals(mid.rolls([6, 10], 2), {sum: 16, rolls: [
        {sum: 8, dice: [{d: 6, rolled: 3}, {d: 10, rolled: 5}]},
        {sum: 8, dice: [{d: 6, rolled: 3}, {d: 10, rolled: 5}]},
    ]});
});
