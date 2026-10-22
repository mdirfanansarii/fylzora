import React, { Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

const rootElement = document.getElementById('root');

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <p style={{ textAlign: 'center', padding: '40px' }}>
            Loading...
          </p>
        }
      >
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
