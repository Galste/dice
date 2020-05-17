# Dice
Game-oriented random sampling library for Deno.

## Usage
Quick API usage summary, see API reference below for more details.
```typescript
import dice from 'https://raw.githubusercontent.com/Galste/dice/v1.0.2/Dice.ts';

// Roll one d6.
dice.roll();
// Roll one d20.
dice.roll(20);
// Roll one d6 and one d20.
dice.roll([6, 20]);
// Roll one d6 three times.
dice.rolls(6, 3);
// Roll one d6 and one d20 three times each.
dice.rolls([6, 20], 3);
// Pick either 'foo' or 'bar' randomly.
dice.pick(['foo', 'bar']);
// Pick either 'foo', 'bar', or 'baz' randomly, twice.
// Each value can only be picked once.
dice.sample(['foo', 'bar', 'baz'], 2);
// Shuffle an array.
dice.shuffle(['foo', 'bar', 'baz']);
// Pick either 'foo' or 'bar' randomly, with regards to weight.
// Here, 'bar' has twice the chance to be picked than 'foo'.
dice.weightedPick([{value: 'foo', weight: 1}, {value: 'bar', weight: 2}]);
// Pick either 'foo' or 'bar' randomly, with regards to weight, twice.
// Unlike `sample`, the default behavior for this method is that
// each value can picked more than once.
dice.weightedSample([{value: 'foo', weight: 1}, {value: 'bar', weight: 2}], 2);
// Pick an integer between 1 inclusive and 6 inclusive.
dice.integer(1, 6);
// Pick an integer between 1 inclusive and 6 inclusive, three times.
dice.integers(1, 6, 3);
// Pick a float between 0.5 inclusive and 5.5 exclusive.
dice.real(0.5, 5.5);
// Pick a float between 0.5 inclusive and 5.5 exclusive, three times.
dice.reals(0.5, 5.5, 3);
```
## API Reference
---
### `constructor(randomFn: typeof Math.random)`
Use `new Dice(randomFn)` to get a `Dice` instance that uses `randomFn` for generating random number.
That function must return a `number` in the range [0, 1). The `default` export of this module is `new Dice(Math.random)`.

### `integer(min: number, max: number): number`
Picks an integer between `min` inclusive and `max` inclusive.
- `min: number` Minimum value.
- `min: number` Maximum value.
- returns `number` The picked integer.

### `integers(min: number, max: number, count: number | {min: number; max: number}): number[]`
Picks an integer between `min` inclusive and `max` inclusive, `count` times.
- `min: number` Minimum value.
- `min: number` Maximum value.
- `count: number | {min: number; max: number}` Pick count. If type is `{min: number; max: number}`, First determine the pick count by picking a random integer using `this.integer(count.min, count.max)`.
- returns `number[]` The picked integers.

### `real(min: number, max: number): number`
Picks a float between `min` inclusive and `max` exclusive.
- `min: number` Minimum value.
- `min: number` Maximum value.
- returns `number` The picked float.

### `reals(min: number, max: number, count: number | {min: number; max: number}): number[]`
Picks a float between `min` inclusive and `max` exclusive, `count` times.
- `min: number` Minimum value.
- `min: number` Maximum value.
- `count: number | {min: number; max: number}` Pick count. If type is `{min: number; max: number}`, First determine the pick count by picking a random integer using `this.integer(count.min, count.max)`.
- returns `number[]` The picked floats.

### `roll(d: number | number[] = 6): {dice: Array<{d: number; rolled: number}>; sum: number}`
Rolls one or more dice.
- `d: number | number[] = 6` How many sides to the die. Specify multiple dice when type of `d` is `number[]`. Defaults to 6.
- returns `{dice: Array<{d: number; rolled: number}>; sum: number}` Describes the outcome of the roll.
  - `dice: Array<{d: number; rolled: number}>` Describes the outcome of an individual die roll.
    - `d: number` How many sides the rolled die had.
    - `rolled: number` The outcome of the roll.
  - `sum: number` The sum of all die outcomes.

### `rolls(d: number | number[], count: number | {min: number; max: number}): {rolls: Array<{dice: Array<{d: number; rolled: number}>; sum: number}>; sum: number}`
Rolls one or more dice `count` times.
- `d: number | number[]` How many sides to the die. Specify multiple dice when type of d is `number[]`.
- `count: number | {min: number; max: number}` Roll count. If type is `{min: number; max: number}`, First determine the roll count by picking a random integer using `this.integer(count.min, count.max)`.
- returns `{rolls: Array<{dice: Array<{d: number; rolled: number}>; sum: number}>; sum: number}` Describes the outcome of the rolls.
  - `rolls: Array<{dice: Array<{d: number; rolled: number}>; sum: number}>` Describes the outcome of an individual roll (of one or more dice).
    - `dice: Array<{d: number; rolled: number}>` Describes the outcome of an individual die roll.
      - `d: number` How many sides the rolled die had.
      - `rolled: number` The outcome of the roll.
    - `sum: number` The sum of all die outcomes.
  - `sum: number` The sum of all roll sums.

### `pick<T>(values: T[]): T | undefined`
Picks a value from an array of `values` at random.
- `values: T[]` The array to pick from.
- returns `T | undefined` The picked value, or `undefined` if `items` is empty.

### `sample<T>(values: T[], count: number | {min: number; max: number} = 1, options?: {unique?: boolean | number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean}): T[]`
Picks a value from an array of `values` at random, `count` times.
- `values: T[]` The array to pick from.
- `count: number | {min: number; max: number} = 1` Pick count. If type is `{min: number; max: number}`, First determine the pick count by picking a random integer using `this.integer(count.min, count.max)`. Defaults to 1.
- `options?: {unique?: boolean | number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean}` Additional options. Optional.
  - `unique?: boolean | number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean` Specifies if values in `items` can be picked more than once. If type is `number`, then the same value can be picked no more than `unique` times, but never less than once. If type is `(info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean`, then `unique` is invoked every time after a value is picked. Defaults to `true`.
    - `value: T` The picked value.
    - `count: number` How many times `value` has been picked, including the current pick, i.e. the first time `unique` is invoked, `count` will equal `1`.
    - `counts: Map<T, number>` Counts of how many times other values have been picked.
    - `pick: number` The current pick index. Starts at `1`.
    - returns `number | boolean`
- returns `T[]` The picked values.

### `shuffle<T>(values: T[]): T[]`
Shuffles an array. Same as `sample(values, values.length)`.
- `values: T[]` The array to shuffle.
- returns `T[]` The shuffled array.

### `weightedPick<T>(items: Array<{value: T; weight: number}>, options?: {normalize?: boolean | ((value: T) => number); default?: T}): T | undefined`
Picks a value from a an array of `items`. Each item's `weight` determines how likely it would be for it to be picked, i.e. an item with a weight of 2 is twice as likely to be picked than an item with a weight of 1.
- `items: Array<{value: T; weight: number}` The array to pick values from.
  - `value: T` The value to be picked.
  - `weight: number` The value's weight.
- `options?: {normalize?: boolean | ((value: T) => number); default?: T}` Additional options. Optional.
  - `normalize?: boolean | ((value: T) => number)` Specifies how to handle a weight sum of `0`. If `undefined` or `false`, the picked value will be `undefined`. If `true`, all items' weights will be considered as `1`. if type is `(value: T) => number`, `normalize` is invoked once per item to determine its weight. Optional.
    - `value: T` The item's value.
    - returns `number` The desired weight.
  - `default?: T` The default value to return if all items have a weight sum of `0` and `options.normalize` is either `undefined` or `false`. Optional.
- returns `T | undefined` The picked value.

### `weightedSample<T>(items: Array<{value: T; weight: number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number; unique?: boolean | number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean}>, count: number | {min: number; max: number}, options?: {normalize?: boolean | ((value: T) => number); default?: T; unique?: boolean | number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean}): T[]`
Picks a value from an array of `items`, `count` times. Each item's `weight` determines how likely it would be for its value to be picked, i.e. an item with a weight of 2 is twice as likely to have its value picked than an item with a weight of 1.
- `items: Array<{value: T; weight: number}` The array to pick values from.
  - `value: T` The value to be picked.
  - `weight: number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number` The value's weight. If type is `(info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number`, then weight is calculated individualy before every pick (`count` times).
    - `value: T` The value for which `weight` is being calculated for.
    - `count: number` How many times `value` has been picked before.
    - `counts: Map<T, number>` Counts of how many times other values in `items` have been picked.
    - `pick: number` The current pick index. Starts at `1`.
    - returns `number` The desired weight.
  - `unique?: boolean | number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean}` Specifies if this item's value can be picked more than once. If type is `number`, then this item's value can be picked no more than `unique` times, but never less than once. If type is `(info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean`, then `unique` is invoked every time after this item's value is picked. Takes precedence over `options.unique`. Optional.
    - `value: T` The picked value.
    - `count: number` How many times `value` has been picked, including the current pick, i.e. the first time `unique` is invoked, `count` will equal `1`.
    - `counts: Map<T, number>` Counts of how many times other values in `items` have been picked.
    - `pick: number` The current pick index. Starts at `1`.
    - returns `number | boolean`
- `count: number | {min: number; max: number}` Pick count. If type is `{min: number; max: number}`, First determine the pick count by picking a random integer using `this.integer(count.min, count.max)`. Defaults to `1`.
- `options?: {normalize?: boolean | ((value: T) => number); default?: T; unique?: boolean | number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean}` Additional options. Optional.
  - `normalize?: boolean | ((value: T) => number)` Specifies how to handle a weight sum of `0`. If `undefined` or `false`, the method will return immediately with the all the previous picks, if any. If `true`, all items' weights will be considered as `1`. if type is `(value: T) => number`, `normalize` is invoked once per item to determine how to normalize its weight. Optional.
    - `value: T` The item's value.
    - returns `number` The desired weight of the item.
  - `default?: T` The default value to return if all items have a weight sum of `0` and `options.normalize` is either `undefined` or `false`. Optional.
  - `unique?: boolean | number | (info: {value: T, count: number; counts: Map<T, number>, pick: number}` Specifies if an item's value can be picked more than once. If type is `number`, then values can be picked no more than `unique` times, but never less than once. If type is `(info: {value: T, count: number; counts: Map<T, number>, pick: number}) => number | boolean`, then `unique` is invoked every time after a value is picked. `item.unique` takes precedence over this. Optional.
    - `value: T` The picked value.
    - `count: number` How many times `value` has been picked, including the current pick, i.e. the first time `unique` is invoked, `count` will equal `1`.
    - `counts: Map<T, number>` Counts of how many times other values in `items` have been picked.
    - `pick: number` The current pick index. Starts at `1`.
    - returns `number | boolean`
- returns `T[]` The picked values.

## Notes
- Values in `items` in `weightedPick` and `weightedSample` must be unique, either by unique primitives or references. For example, if you want to have similar values in `items`, assign different objects to `item.value` like so: `weightedPick([{value: {foo: 'bar'}, weight: 1}, {value: {foo: 'bar'}, weight: 2}])`.
- A value cannot have a uniqueness of less than 1. For more control over uniqueness, use `weight` instead. A `unique` function can be seen as a more simplified version of a `weight` function.

## Authors

* **Gal Steinberg** - [GlidingDeer](https://www.glidingdeer.com/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details

