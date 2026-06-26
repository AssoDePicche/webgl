import React, { useEffect, useRef } from 'react';

import { getFileContents } from './fs.js';

import { Context } from './context.js';

import { Entity, EntityFactory } from './entity.js';

import { Application } from './application.js';

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !canvasRef.current) {
        return;
    }

    isInitialized.current = true;

    const bootWebGL = async () => {
      try {
        const vertexShaderSourceCode = await getFileContents('vertex.glsl');

        const fragmentShaderSourceCode = await getFileContents('fragment.glsl');

        const context = new Context('canvas', vertexShaderSourceCode, fragmentShaderSourceCode);

        const factory = new EntityFactory(context);

        const entities: Entity[] = [
          factory.createSphere('planet.jpg'),
        ];

        const application = new Application(context, entities);

        requestAnimationFrame((time: number) => application.render(time));
      } catch (exception: unknown) {
        console.error("WebGL Engine Initialization failed: ", exception);
      }
    };

    bootWebGL();
  }, []);

  return (
    <div className="app-container">
      <canvas ref={canvasRef} id="canvas" width="800" height="600" />

      <div id="error"></div>
      <button id="toggleDebugging"></button>
      
      <div className="input__container">
        <label htmlFor="fieldOfView">FOV</label>
        <input id="fieldOfView" min="30" max="120" step="15" type="range" defaultValue="30" />
      </div>
      
      <div className="input__container">
        <label htmlFor="nearBound">Near</label>
        <input id="nearBound" min="0.1" max="1" step="0.1" type="range" defaultValue="0.1" />
      </div>
      
      <div className="input__container">
        <label htmlFor="farBound">Far</label>
        <input id="farBound" min="20" max="50" step="0.1" type="range" defaultValue="20" />
      </div>
      
      <div className="input__container">
        <label htmlFor="lightColor">Light Color</label>
        <input id="lightColor" type="color" defaultValue="#FFFFFF" />
      </div>

      <span id="HUD" className="output__container"></span>
      <div id="DEBUG"></div>
    </div>
  );
};
