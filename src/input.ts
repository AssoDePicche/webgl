import { Point2D } from './point.js';

export class Input {
    private canvas: HTMLCanvasElement;

    private coordsX: HTMLInputElement;

    private coordsY: HTMLInputElement;

    private coordsZ: HTMLInputElement;

    private fov: HTMLInputElement;

    private near: HTMLInputElement;

    private far: HTMLInputElement;

    private keys: Record<string, boolean> = {
        w: false,
        a: false,
        s: false,
        d: false,
    };

    private _isDragging: boolean = false;

    private _lastTouchDistance: number = 0;

    private _lastPosition: Point2D = new Point2D(0, 0);

    private _deltaX: number = 0;

    private _deltaY: number = 0;

    private _deltaZoom: number = 0;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.coordsX = this.getSlider('angleX');

        this.coordsY = this.getSlider('angleY');

        this.coordsZ = this.getSlider('angleZ');

        this.fov = this.getSlider('fieldOfView');

        this.near = this.getSlider('nearBound');

        this.far = this.getSlider('farBound');

        this.attachListeners();
    }

    public get deltaX(): number {
        return this._deltaX;
    }

    public get deltaY(): number {
        return this._deltaY;
    }

    public get deltaZoom(): number {
        return this._deltaZoom;
    }

    public get isDragging(): boolean {
        return this._isDragging;
    }

    public get lastPosition(): Point2D {
        return this._lastPosition;
    }

    public get lastTouchDistance(): number {
        return this._lastTouchDistance;
    }

    public get rotations(): [number, number, number] {
        return [
            parseFloat(this.coordsX.value),
            parseFloat(this.coordsY.value),
            parseFloat(this.coordsZ.value)
        ];
    }

    public get fieldOfViewDegrees(): number {
        return parseFloat(this.fov.value);
    }

    public get nearBounds(): number {
        return parseFloat(this.near.value);
    }

    public get farBounds(): number {
        return parseFloat(this.far.value);
    }

    private getSlider(id: string): HTMLInputElement {
        const element = document.getElementById(id);

        if (!element) throw new Error(`Slider Input Element #${id} was not found in DOM.`);

        return element as HTMLInputElement;
    }

    private attachListeners(): void {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mouseup', this.handleMouseUp);

        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
        this.canvas.addEventListener('touchcancel', this.handleTouchEnd);
        this.canvas.addEventListener('wheel', this.handleMouseWheel, { passive: false });
    }

    private handleKeyDown = (event: KeyboardEvent) => this.setKey(event, true);

    private handleKeyUp = (event: KeyboardEvent) => this.setKey(event, false);

    private setKey(event: KeyboardEvent, isPressed: boolean): void {
        const key: string = event.key.toLowerCase();

        if (key in this.keys) {
            event.preventDefault();

            this.keys[key] = isPressed;
        }
    }

    public isKeyPressed(key: string): boolean {
        return !!this.keys[key.toLowerCase()];
    }

    private handleMouseDown = (event: MouseEvent) => {
        this._isDragging = true;

        this._lastPosition = new Point2D(event.clientX, event.clientY);
    };

    private handleMouseMove = (event: MouseEvent) => {
        if (!this._isDragging) return;

        this._deltaX += event.clientX - this._lastPosition.x;

        this._deltaY += event.clientY - this._lastPosition.y;

        this._lastPosition = new Point2D(event.clientX, event.clientY);
    };

    private handleMouseUp = () => {
        this._isDragging = false;
    };

    private handleTouchStart = (event: TouchEvent) => {
        event.preventDefault();

        const touches: TouchList = event.touches;

        if (touches.length === 1) {
            this._isDragging = true;

            const touch: Touch = touches[0]!;

            this._lastPosition = new Point2D(touch.clientX, touch.clientY);
        } else if (touches.length === 2) {
            this._isDragging = false;

            const firstTouch = touches[0]!;

            const secondTouch = touches[1]!;

            this._lastTouchDistance = this.getTouchDistance(firstTouch, secondTouch);
        }
    };

    private handleTouchMove = (event: TouchEvent) => {
        event.preventDefault();

        const touches: TouchList = event.touches;

        if (touches.length === 1 && this._isDragging) {
            const touch: Touch = touches[0]!;

            this._deltaX += touch.clientX - this._lastPosition.x;

            this._deltaY += touch.clientY - this._lastPosition.y;

            this._lastPosition = new Point2D(touch.clientX, touch.clientY);
        } else if (touches.length === 2) {
            const firstTouch: Touch = touches[0]!;

            const secondTouch: Touch = touches[1]!;

            const currentDistance: number = this.getTouchDistance(firstTouch, secondTouch);

            this._deltaZoom += currentDistance - this._lastTouchDistance;

            this._lastTouchDistance = currentDistance;
        }
    };

    private handleTouchEnd = (event: TouchEvent) => {
        if (event.touches.length === 1) {
            const touch: Touch = event.touches[0]!;

            this._lastPosition = new Point2D(touch.clientX, touch.clientY);

            this._isDragging = true;
        } else if (event.touches.length === 0) {
            this._isDragging = false;

            this._lastTouchDistance = 0;
        }
    };

    private handleMouseWheel = (event: WheelEvent) => {
        event.preventDefault();

        this._deltaZoom -= event.deltaY * 0.02;
    };

    private getTouchDistance(firstTouch: Touch, secondTouch: Touch): number {
        const p = new Point2D(firstTouch.clientX, firstTouch.clientY);

        const q = new Point2D(secondTouch.clientX, secondTouch.clientY);

        return p.euclidian(q);
    }

    public flush(): void {
        this._deltaX = 0;

        this._deltaY = 0;

        this._deltaZoom = 0;
    }
}
