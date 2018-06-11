export const like = (entry, input) =>
  entry
    .trim()
    .toLocaleLowerCase()
    .slice(0, input.length) === input.trim().toLocaleLowerCase();

export const equal = (entry, input) => entry == input; // eslint-disable-line eqeqeq

export const strictEqual = (entry, input) => entry === input;
