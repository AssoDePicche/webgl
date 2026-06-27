import { type FC, type ReactNode, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { Input } from './components/Input.js';

import { getFileContents } from './fs.js';

import { Context } from './context.js';

import { Entity, EntityFactory } from './entity.js';

import { Application } from './application.js';

const Canvas = styled.canvas`
    max-width: 100%;
`;

const Container = styled.div`
    align-items: center;
    background-color: black;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
`;

const DEBUG = styled.div`
    display: flex;
    font-family: monospace;
    font-size: 1.2rem;
    padding: 1rem;
    position: absolute;
    right: 0;
    top: 0;

    @media(max-width: 767px) {
        flex-direction: column;
    }
`;

const ERROR = styled.div`
    align-items: center;
    display: flex;
    font-size: 2rem;
    justify-content: center;
    padding: 1rem;
    text-align: center;
`;

const HUD = styled.span`
    font-size: 1.8rem;
    left: 0;
    padding: 1rem;
    position: absolute;
    top: 0;
    white-space: pre-wrap;
`;

const Button = styled.button`
    font-size: 1.8rem;
    min-height: 36px;
    min-width: 280px;

    &:hover {
        cursor: pointer;
    }
`;

const Select = styled.select`
    font-size: 1.8rem;
    min-height: 36px;
    min-width: 280px;
    padding: 0 10px;
`;

const DebugButton: FC = (): ReactNode => {
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const toggleState = () => setIsPressed(!isPressed);

    return (
        <Button id="toggleDebugging" onClick={toggleState}>
        {!isPressed ? 'Show Debugging' : 'Hide Debugging'}
        </Button>
    );
};

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isInitialized = useRef(false);

  const applicationRef = useRef<Application | null>(null);

  const [entity, setEntity] = useState<string>('sphere');

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

        const application = new Application(context, [
            factory.createSphere('planet.jpg'),
        ]);

        applicationRef.current = application;

        requestAnimationFrame((time: number) => application.render(time));
      } catch (exception: unknown) {
        console.error("WebGL Engine Initialization failed: ", exception);
      }
    };

    bootWebGL();
  }, []);

  useEffect(() => {
      if (!applicationRef.current) {
          return;
      }

      const factory = new EntityFactory(applicationRef.current.context);

      const newEntity = entity === 'sphere' ? factory.createSphere('planet.jpg') : factory.createCube('crate.svg');

      applicationRef.current.updateEntities([newEntity]);
  }, [entity]);

  return (
    <Container>
      <Canvas ref={canvasRef} id="canvas" width="800" height="600" />

      <ERROR id="error" />

      <DebugButton />

      <Select id="geometry" onChange={(event) => setEntity(event.target.value)}>
        <option value="sphere">Sphere</option>
        <option value="cube">Cube</option>
      </Select>

      <Input defaultValue="30" id="fieldOfView" label="FOV" max="120" min="30" step="15" type="range" />

      <Input defaultValue="0.1" id="nearBound" label="Near" max="1" min="0.1" step="0.1" type="range" />

      <Input defaultValue="20" id="farBound" label="Far" max="50" min="20" step="0.1" type="range" />

      <Input id="lightOrbit" label="Light Orbit" type="checkbox" />
      
      <Input defaultValue="1" id="lightX" label="Light X" max="5" min="-5" step="0.1" type="range" />

      <Input defaultValue="1" id="lightY" label="Light Y" max="5" min="-5" step="0.1" type="range" />

      <Input defaultValue="-1" id="lightZ" label="Light Z" max="5" min="-5" step="0.1" type="range" />

      <Input defaultValue="#ffffff" id="lightColor" label="Light Color" type="color" />

      <HUD id="HUD" />

      <DEBUG id="DEBUG" />
    </Container>
  );
};

export default App;
