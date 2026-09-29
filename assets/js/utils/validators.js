export const isPositiveNumber = (val) => !isNaN(val) && parseFloat(val) > 0;
export const isNonEmptyString = (val) => typeof val === 'string' && val.trim().length > 0;