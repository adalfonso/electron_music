/**
 * Shuffle an array in place
 *
 * https://bost.ocks.org/mike/shuffle/
 * @param arr - array
 *
 * @return shuffled aray
 */
export const shuffle = <T>(arr: T[]): T[] => {
  let m = arr.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
};
