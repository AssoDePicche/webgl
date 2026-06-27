import type { FC, ReactNode } from 'react';

import styled from 'styled-components';

const Container = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  max-width: 280px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 2rem;
`;

interface Properties {
  defaultValue?: string;
  id: string;
  label: string;
  max?: string;
  min?: string;
  step?: string;
  type: string;
}

export const Input: FC<Properties> = (properties: Properties): ReactNode => {
    const {
      defaultValue,
      id,
      label,
      max,
      min,
      step,
      type
    } = properties;

    return (
        <Container>
          <Label htmlFor={id}>{label}</Label>
          <input
            defaultValue={defaultValue}
            id={id}
            max={max}
            min={min}
            step={step}
            type={type}
          />
        </Container>
    );
};
