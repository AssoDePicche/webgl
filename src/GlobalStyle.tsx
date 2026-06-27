import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;
  }

  html, body {
    color: white;
    font-size: 62.5%;
    height: 100%;
    width: 100%;
  }

  body {
    align-items: center;
    background-color: black;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
  }
`;

export default GlobalStyle;
