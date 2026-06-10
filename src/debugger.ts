import * as glMatrix from 'gl-matrix';

import { flatten } from './flatten.js';

import { Point2D, Point3D } from './point.js';

export class Debugger {
    private debug: HTMLElement;

    private error: HTMLElement;

    private HUD: HTMLElement;

    private toggleButton: HTMLElement;

    public _isDebuggingEnabled: boolean = false;

    public constructor(hudId: string, debugId: string, errorId: string, toggleId: string) {
        this.HUD = this.getDomElement(hudId);
        this.debug = this.getDomElement(debugId);
        this.error = this.getDomElement(errorId);
        this.toggleButton = this.getDomElement(toggleId);
        this.toggleButton.addEventListener('click', () => {
            this._isDebuggingEnabled = !this._isDebuggingEnabled;

            this.toggleButton.innerHTML = this._isDebuggingEnabled ? 'Hide Debugging' : 'Show Debugging';

            if (!this._isDebuggingEnabled) {
                this.debug.innerHTML = '';
            }
        });
        this.toggleButton.innerHTML = 'Show Debugging';
    }

    public get isDebuggingEnabled(): boolean {
        return this._isDebuggingEnabled;
    }

    public renderHUD(eye: Point3D, at: Point3D, up: Point3D, fov: number, near: number, far: number): void {
        const format = (n: number): string => n.toFixed(2);

        const formatPoint = (p: Point3D): string => `(${format(p.x)}, ${format(p.y)}, ${format(p.z)})`;

        this.HUD.textContent = '';

        this.HUD.textContent += `Eye = ${formatPoint(eye)}\n`;

        this.HUD.textContent += `At = ${formatPoint(at)}\n`;

        this.HUD.textContent += `Up = ${formatPoint(up)}\n`;

        this.HUD.textContent += `FOV: ${fov}\n`;

        this.HUD.textContent += `Near: ${near}\n`;

        this.HUD.textContent += `Far: ${far}\n`;
    }

    public renderInputInfo(isDragging: boolean, touchDistance: number, mousePosition: Point2D): void {
        if (!this._isDebuggingEnabled) {
            return;
        }

        this.debug.innerHTML = `<div>(${isDragging}, ${touchDistance.toFixed(2)}, ${mousePosition.x}, ${mousePosition.y})</div>`;
    }

    public renderMatrices(world: glMatrix.mat4, view: glMatrix.mat4, projection: glMatrix.mat4): void {
        if (!this._isDebuggingEnabled) {
            return;
        }

        let html: string = '';

        html += `<div>${this.formatMatrix(projection)}</div>`;

        html += `<div>${this.formatMatrix(view)}</div>`;

        html += `<div>${this.formatMatrix(world)}</div>`;

        this.debug.innerHTML = html;
    }

    public renderErrorMessage(message: string): void {
        this.error.textContent = message;
    }

    private getDomElement(id: string): HTMLElement {
        const element: HTMLElement | null = document.getElementById(id);

        if (!element) {
            throw new Error(`Required HTML Element #${id} Missing From DOM`);
        }

        return element;
    }

    private formatMatrix(matrix: glMatrix.mat4 | Float32Array | number[]): string {
        const array: Float32Array = flatten(matrix);

        let result: string = '<table>';

        for (let index = 0; index < array.length; index += 4) {
            result += '<tr>';

            array.slice(index, index + 4).forEach((cell: number) => {
                result += '<td>';

                result += cell.toFixed(2);

                result += '</td>';
            });

            result += '</tr>';
        }

        result += '</table>';

        return result;
    }
}
