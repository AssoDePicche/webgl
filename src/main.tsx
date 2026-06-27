import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App.js';

import GlobalStyle from './GlobalStyle.js';

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <GlobalStyle />
      <App />
    </React.StrictMode>
);
