import {range, returnOne} from './util.ts';

type CountsOf<T> = Map<T, number>;
type DescriptorFn<T, R> = (info: {value: T, count: number; counts: CountsOf<T>, roll: number}) => R;
type UniquenessDescriptor<T> = boolean | number | DescriptorFn<T, number | boolean>;
type Count = number | {
    min: number;
    max: number;
};
type Weighted<T> = {
    value: T;
    weight: number;
};
type WeightedDynamic<T> = {
    value: T;
    weight: number | DescriptorFn<T, number>;
    unique?: UniquenessDescriptor<T>;
};
type WeightedPickOptions<T> = {
    normalize?: boolean | ((value: T) => number);
    default?: T;
};
type SampleOptions<T> = {
    unique?: UniquenessDescriptor<T>;
};
type WeightedSampleOptions<T> = WeightedPickOptions<T> & SampleOptions<T>;
type RollResult = {dice: Array<{d: number; rolled: number}>; sum: number};
type RollsResult = {rolls: RollResult[]; sum: number};

export class Dice {
    public constructor(private readonly randomFn: typeof Math.random) {}

    public integer(min: number, max: number) {
        return Math.floor(min + this.randomFn() * (max - min + 1));
    }

    public real(min: number, max: number) {
        return min + this.randomFn() * (max - min);
    }

    public integers(min: number, max: number, count: Count): number[] {
        const pickedCount = this._getRollCount(count);
        const integers: number[] = [];
        for (const _ of range(pickedCount)) {
            integers.push(this.integer(min, max));
        }
        return integers;
    }

    public reals(min: number, max: number, count: Count): number[] {
        const pickedCount = this._getRollCount(count);
        const reals: number[] = [];
        for (const _ of range(pickedCount)) {
            reals.push(this.real(min, max));
        }
        return reals;
    }

    public weightedPick<T>(items: Array<Weighted<T>>, options?: WeightedPickOptions<T>): T | undefined {
        const weightSum = items.reduce((sum, item) => sum + item.weight, 0);
        if (weightSum === 0) {
            if (options?.normalize !== undefined && options.normalize !== false) {
                const normalizeFn = options.normalize === true ? returnOne : options.normalize;
                return this.weightedPick(items.map((item) => ({
                    value: item.value,
                    weight: normalizeFn(item.value),
                })), {...options, normalize: false});
            }
            return options?.default;
        }
        const randomPosition = this.randomFn() * weightSum;
        let currentPosition = 0;
        for (const item of items) {
            currentPosition += item.weight;
            if (randomPosition <= currentPosition) {
                return item.value;
            }
        }
        const pick = items[items.length - 1];
        return pick ? pick.value : options?.default;
    }

    public weightedSample<T>(items: Array<WeightedDynamic<T>>, count: Count, options?: WeightedSampleOptions<T>): T[] {
        const pickedCount = this._getRollCount(count);
        const picks: T[] = [];
        const currentItems = new Map<T, WeightedDynamic<T>>();
        const counts: CountsOf<T> = new Map<T, number>();
        const getMaxUnique = ({value, unique, roll}: {
            value: T,
            unique?: UniquenessDescriptor<T>,
            roll: number,
        }): number => {
            if (unique === true) {
                return 1;
            }
            if (typeof unique === 'number') {
                return unique;
            }
            if (typeof unique === 'function') {
                const result = unique({
                    value,
                    count: counts.get(value) ?? 0,
                    counts,
                    roll,
                });
                if (result === true) {
                    return 1;
                }
                if (typeof result === 'number') {
                    return result;
                }
            }
            return Infinity;
        };
        for (const item of items) {
            currentItems.set(item.value, item);
            counts.set(item.value, 0);
        }
        for (const roll of range(pickedCount)) {
            const weightedStatic: Array<Weighted<T>> = [];
            for (const item of currentItems.values()) {
                weightedStatic.push({
                    value: item.value,
                    weight: typeof item.weight === 'number'
                        ? item.weight
                        : item.weight({
                            value: item.value,
                            count: counts.get(item.value) ?? 0,
                            counts,
                            roll,
                        }),
                })
            }
            const pick = this.weightedPick(weightedStatic, options);
            if (pick === undefined) {
                return picks;
            }
            const item = currentItems.get(pick);
            if (item === undefined) {
                return picks;
            }
            picks.push(pick);
            const previousPickCount = counts.get(pick) ?? 0;
            const newPickCount = previousPickCount + 1;
            counts.set(pick, newPickCount);
            if (newPickCount >= getMaxUnique({value: pick, unique: item.unique ?? options?.unique, roll})) {
                currentItems.delete(pick);
            }
        }
        return picks;
    }

    public sample<T>(values: T[], count: Count = 1, options?: SampleOptions<T>): T[] {
        return this.weightedSample(
            values.map((item) => ({value: item, weight: 1})),
            count,
            {unique: true, ...options}
        );
    }

    public shuffle<T>(items: T[]): T[] {
        return this.sample<T>(items, items.length, {unique: true});
    }

    public pick<T>(items: T[]): T | undefined {
        const [picked] = this.sample(items);
        return picked;
    }

    public roll(d: number | number[] = 6): RollResult {
        if (typeof d === 'number') {
            d = [d];
        }
        return d.reduce<RollResult>((acc, dd) => {
            const rolled = this.pick([...range(dd)]) ?? 1;
            acc.sum += rolled;
            acc.dice.push({d: dd, rolled});
            return acc;
        }, {dice: [], sum: 0});
    }

    public rolls(d: number | number[], count: Count): RollsResult {
        const pickedCount = this._getRollCount(count);
        const result: RollsResult = {rolls: [], sum: 0};
        for (const _ of range(pickedCount)) {
            const roll = this.roll(d);
            result.rolls.push(roll);
            result.sum += roll.sum;
        }
        return result;
    }

    private _getRollCount(count: Count): number {
        return typeof count === 'number'
            ? count
            : this.integer(count.min, count.max);
    }
}

export default new Dice(Math.random);
