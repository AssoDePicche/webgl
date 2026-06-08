import { Point2D } from './point.js';

import { clamp, deg2Rad } from './utils.js';

export const cameraState = {
    phi: 0.0,
    radius: 16.0,
    theta: 0.0,
};

export const CONFIG = {
    minRadius: 1.5,
    maxRadius: 20.0,
    moveSpeed: 0.5,
    sensibility: 0.1,
    zoomSpeed: 0.5,
};

var keys: { [key: string]: boolean } = {
    w: false,
    a: false,
    s: false,
    d: false,
};

var isDragging: boolean = false;

var lastTouchDistance: number = 0;

var lastPosition = {
    x: 0,
    y: 0,
};

const handleKeyEvent = (event: KeyboardEvent, isPressed: boolean) => {
    const key = event.key.toLowerCase();

    if (!keys.hasOwnProperty(key)) {
        return;
    }

    event.preventDefault();

    keys[key] = isPressed;
};

const handleKeyDown = (event: KeyboardEvent) => handleKeyEvent(event, true);

const handleKeyUp = (event: KeyboardEvent) => handleKeyEvent(event, false);

window.addEventListener('keydown', handleKeyDown);

window.addEventListener('keyup', handleKeyUp);

const getTouchDistance = (t1: Touch, t2: Touch) => {
    const dx = t1.clientX - t2.clientX;

    const dy = t1.clientY - t2.clientY;

    return Math.sqrt(dx * dx + dy * dy);
};

const dragStart = (clientX: number, clientY: number) => {
    isDragging = true;

    lastPosition = {
        x: clientX,
        y: clientY,
    };
};

const dragEnd = () => {
    isDragging = false;
};

const dragMove = (clientX: number, clientY: number) => {
    if (!isDragging) {
        return;
    }

    const dx = clientX - lastPosition.x;

    const dy = clientY - lastPosition.y;

    const offset = 10;

    cameraState.theta -= deg2Rad(dx * CONFIG.sensibility * offset);

    cameraState.phi += deg2Rad(dy * CONFIG.sensibility * offset);

    const bounds = Math.PI / 2.1;

    cameraState.phi = clamp(cameraState.phi, -bounds, bounds);

    lastPosition = {
        x: clientX,
        y: clientY,
    };
};

const handleMouseDown = (event: MouseEvent) => dragStart(event.clientX, event.clientY);

const handleMouseUp = () => dragEnd();

const handleMouseMove = (event: MouseEvent) => dragMove(event.clientX, event.clientY);

const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();

    if (event.touches.length === 1) {
        dragStart(event.touches[0]!.clientX, event.touches[0]!.clientY);
    } else if (event.touches.length === 2 && event.touches[0] && event.touches[1]) {
        isDragging = false;

        lastTouchDistance = getTouchDistance(event.touches[0], event.touches[1]);
    }
};

const handleTouchEnd = (event: TouchEvent) => {
    if (event.touches.length === 1) {
        dragStart(event.touches[0]!.clientX, event.touches[0]!.clientY);
    } else if (event.touches.length === 0) {
        dragEnd();
        lastTouchDistance = 0;
    }
};

const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();

    if (event.touches.length === 1 && isDragging) {
        dragMove(event.touches[0]!.clientX, event.touches[0]!.clientY);
    } else if (event.touches.length === 2 && event.touches[0] && event.touches[1]) {
        const currentDistance: number = getTouchDistance(event.touches[0], event.touches[1]);

        const delta: number = currentDistance - lastTouchDistance;

        const pinchSensitivity: number = 0.05;

        cameraState.radius -= delta * CONFIG.zoomSpeed * pinchSensitivity;

        cameraState.radius = clamp(cameraState.radius, CONFIG.minRadius, CONFIG.maxRadius);

        lastTouchDistance = currentDistance;
    }
};

const handleZoomInOut = (event: WheelEvent) => {
    event.preventDefault();

    cameraState.radius += event.deltaY * CONFIG.zoomSpeed * 0.01;

    cameraState.radius = clamp(cameraState.radius, CONFIG.minRadius, CONFIG.maxRadius);
};

export const attachEventListeners = (canvas: HTMLCanvasElement) => {
    canvas.addEventListener('mousedown', handleMouseDown);

    canvas.addEventListener('mouseup', handleMouseUp);

    canvas.addEventListener('mousemove', handleMouseMove);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });

    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    canvas.addEventListener('touchend', handleTouchEnd);

    canvas.addEventListener('touchcancel', handleTouchEnd);

    canvas.addEventListener('wheel', handleZoomInOut, { passive: false });
};

export const updateCamera = () => {
    if (keys.w) cameraState.radius -= CONFIG.zoomSpeed;

    if (keys.a) cameraState.theta -= CONFIG.sensibility;

    if (keys.s) cameraState.radius += CONFIG.zoomSpeed;

    if (keys.d) cameraState.theta += CONFIG.sensibility;

    cameraState.radius = clamp(cameraState.radius, CONFIG.minRadius, CONFIG.maxRadius);
};

export const inputState = {
    control: {
        isDragging,
        lastTouchDistance,
        lastPosition,
    },
    coords: {
        x: document.getElementById('angleX') as HTMLInputElement,
        y: document.getElementById('angleY') as HTMLInputElement,
        z: document.getElementById('angleZ') as HTMLInputElement,
    },
    fov: document.getElementById('fieldOfView') as HTMLInputElement,
    near: document.getElementById('nearBound') as HTMLInputElement,
    far: document.getElementById('farBound') as HTMLInputElement,
};

export class Input {
    private canvas: HTMLCanvasElement;

    private keys: Record<string, boolean> = {
        w: false,
        a: false,
        s: false,
        d: false,
    };

    private isDragging: boolean = false;

    private lastTouchDistance: number = 0;

    private lastPosition: Point2D = new Point2D(0, 0);

    private deltaX: number = 0;

    private deltaY: number = 0;

    private deltaZoom: number = 0;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.attachListeners();
    }

    private attachListeners(): void {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mouseup', this.handleMouseUp);

        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchMove, { passive: false });
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

    public isKeyPresed(key: string): boolean {
        return !!this.keys[key.toLowerCase()];
    }

    private handleMouseDown = (event: MouseEvent) => {
        this.isDragging = true;

        this.lastPosition = new Point2D(event.clientX, event.clientY);
    };

    private handleMouseMove = (event: MouseEvent) => {
        if (!this.isDragging) return;

        this.deltaX += event.clientX - this.lastPosition.x;

        this.deltaY += event.clientY - this.lastPosition.y;

        this.lastPosition = new Point2D(event.clientX, event.clientY);
    };

    private handleMouseUp = () => {
        this.isDragging = false;
    };

    private handleTouchStart = (event: TouchEvent) => {
        event.preventDefault();

        const touches: TouchList = event.touches;

        if (touches.length === 1) {
            this.isDragging = true;

            const touch: Touch = touches[0]!;

            this.lastPosition = new Point2D(touch.clientX, touch.clientY);
        } else if (touches.length === 2) {
            this.isDragging = false;

            const firstTouch = touches[0]!;

            const secondTouch = touches[0]!;

            this.lastTouchDistance = this.getTouchDistance(firstTouch, secondTouch);
        }
    };

    private handleTouchMove = (event: TouchEvent) => {
        event.preventDefault();

        const touches: TouchList = event.touches;

        if (touches.length === 1 && this.isDragging) {
            const touch: Touch = touches[0]!;

            this.deltaX += touch.clientX - this.lastPosition.x;

            this.deltaY += touch.clientY - this.lastPosition.y;

            this.lastPosition = new Point2D(touch.clientX, touch.clientY);
        } else if (touches.length === 2) {
            const firstTouch: Touch = touches[0]!;

            const secondTouch: Touch = touches[0]!;

            const currentDistance: number = this.getTouchDistance(firstTouch, secondTouch);

            this.deltaZoom += currentDistance - this.lastTouchDistance;

            this.lastTouchDistance = currentDistance;
        }
    };

    private handleTouchEnd = (event: TouchEvent) => {
        if (event.touches.length === 1) {
            const touch: Touch = event.touches[0]!;

            this.lastPosition = new Point2D(touch.clientX, touch.clientY);

            this.isDragging = true;
        } else if (event.touches.length === 0) {
            this.isDragging = false;

            this.lastTouchDistance = 0;
        }
    };

    private handleMouseWheel = (event: WheelEvent) => {
        event.preventDefault();

        this.deltaZoom -= event.deltaY * 0.02;
    };

    private getTouchDistance(firstTouch: Touch, secondTouch: Touch): number {
        const p = new Point2D(firstTouch.clientX, firstTouch.clientY);

        const q = new Point2D(secondTouch.clientX, secondTouch.clientY);

        return p.euclidian(q);
    }

    public consumeDeltas(): void {
        this.deltaX = 0;

        this.deltaY = 0;

        this.deltaZoom = 0;
    }
}
