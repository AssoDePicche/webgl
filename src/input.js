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

var keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

var isMouseDown = false;

var lastMousePosition = {
  x: 0,
  y: 0,
};

const handleKeyEvent = (event, isPressed) => {
  const key = event.key.toLowerCase();

  if (!keys.hasOwnProperty(key)) {
    return;
  }

  event.preventDefault();

  keys[key] = isPressed;
};

const handleKeyDown = (event) => handleKeyEvent(event, true);

const handleKeyUp = (event) => handleKeyEvent(event, false);

window.addEventListener('keydown', handleKeyDown);

window.addEventListener('keyup', handleKeyUp);

const handleMouseDown = (event) => {
  isMouseDown = true;

  lastMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
};

const handleMouseUp = (event) => {
  isMouseDown = false;
};

const handleMouseMove = (event) => {
  if (!isMouseDown) {
    return;
  }

  const dx = event.clientX - lastMousePosition.x;

  const dy = event.clientY - lastMousePosition.y;

  cameraState.theta -= deg2Rad(dx * CONFIG.sensibility * 10);

  cameraState.phi += deg2Rad(dy * CONFIG.sensibility * 10);

  const bounds = Math.PI / 2.1;

  cameraState.phi = clamp(cameraState.phi, -bounds, bounds);

  lastMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
};

const handleZoomInOut = (event) => {
  event.preventDefault();

  cameraState.radius += event.deltaY * CONFIG.zoomSpeed * 0.01;

  cameraState.radius = clamp(cameraState.radius, CONFIG.minRadius, CONFIG.maxRadius);
};

export const attachEventListeners = (canvas) => {
  canvas.addEventListener('mousedown', handleMouseDown);

  canvas.addEventListener('mouseup', handleMouseUp);

  canvas.addEventListener('mousemove', handleMouseMove);

  canvas.addEventListener('wheel', handleZoomInOut, { passive: false });
};

export const updateCamera = () => {
  if (keys.w) cameraState.radius -= CONFIG.zoomSpeed;

  if (keys.a) cameraState.theta -= CONFIG.sensibility;

  if (keys.s) cameraState.radius += CONFIG.zoomSpeed;

  if (keys.d) cameraState.theta += CONFIG.sensibility;

  cameraState.radius = clamp(cameraState.radius, CONFIG.minRadius, CONFIG.maxRadius);
};
