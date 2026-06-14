import * as glMatrix from 'gl-matrix';

import { flatten } from './flatten.js';

import { Point3D } from './point.js';

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

    public renderHUD(eye: Point3D, at: Point3D, up: Point3D, fov: number, near: number, far: number, light: Point3D): void {
        const format = (n: number): string => n.toFixed(2);

        const formatPoint = (p: Point3D): string => `(${format(p.x)}, ${format(p.y)}, ${format(p.z)})`;

        this.HUD.textContent = '';

        this.HUD.textContent += `Eye = ${formatPoint(eye)}\n`;

        const spherical = eye.spherical;

        this.HUD.textContent += `Eye (Spherical) = (${spherical.radius.toFixed(2)}, ${spherical.theta.toFixed(2)}, ${spherical.phi.toFixed(2)})\n`;

        this.HUD.textContent += `At = ${formatPoint(at)}\n`;

        this.HUD.textContent += `Up = ${formatPoint(up)}\n`;

        this.HUD.textContent += `Light = ${formatPoint(light)}\n`;

        this.HUD.textContent += `FOV: ${fov}°\n`;

        this.HUD.textContent += `Near: ${near}\n`;

        this.HUD.textContent += `Far: ${far}\n`;
    }

    public renderMatrices(view: glMatrix.mat4, projection: glMatrix.mat4): void {
        if (!this._isDebuggingEnabled) {
            return;
        }

        let html: string = '';

        html += `<div>${this.formatMatrix(projection)}</div>`;

        html += `<div>${this.formatMatrix(view)}</div>`;

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
