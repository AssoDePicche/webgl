export const deg2Rad = (deg) => deg * Math.PI / 180;

export const rad2Deg = (radians) => radians * (180 / Math.PI);

export const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(value, maximum));
