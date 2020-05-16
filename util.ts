export function returnOne(): 1 {
    return 1;
}

export function *range(from: number, to?: number): Iterable<number> {
    if (to === undefined) {
        if (from === 0) {
            return;
        }
        to = from;
        from = to > 0 ? 1 : -1;
    }
    const fromInt = Math.floor(from);
    const toInt = Math.floor(to);
    const direction = fromInt > toInt ? -1 : 1;
    let current = fromInt;
    yield current;
    while (current !== toInt) {
        yield current += direction;
    }
}
