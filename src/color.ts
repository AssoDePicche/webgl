export interface Color {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export class RGBAColor implements Color {
    public constructor(
        public readonly red: number,
        public readonly green: number,
        public readonly blue: number,
        public readonly alpha: number
    ) { }

    public static fromHex(hex: string): Color {
        hex = hex.replace('#', '');

        const red: number = parseInt(hex.substring(0, 2), 16);

        const green: number = parseInt(hex.substring(2, 4), 16);

        const blue: number = parseInt(hex.substring(4, 6), 16);

        const alpha: number = 1;

        return new RGBAColor(red, green, blue, alpha);
    }
}

export const BLACK: Color = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 1,
};
