import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/joy';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
