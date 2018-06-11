export const string = (a, b) => (a || '').toLocaleLowerCase().localeCompare((b || '').toLocaleLowerCase());

export const number = (a, b) =>
  // eslint-disable-next-line no-nested-ternary
  parseFloat(a || 0) < parseFloat(b || 0) ? -1 : parseFloat(a || 0) > parseFloat(b || 0) ? 1 : 0;

export const dumb = (a, b) => (a < b ? -1 : a > b ? 1 : 0); // eslint-disable-line no-nested-ternary
