export const shuffle= <T>(arr: T[]): T[] => {
    let m = arr.length, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
}
