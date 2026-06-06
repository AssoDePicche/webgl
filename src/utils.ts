export const deg2Rad = (deg: number): number => deg * Math.PI / 180;

export const rad2Deg = (radians: number): number => radians * (180 / Math.PI);

export const clamp = (value: number, minimum: number, maximum: number): number => Math.max(minimum, Math.min(value, maximum));
