import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter, RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import './index.css';

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
});

const router = createRouter({ routeTree, history: memoryHistory });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No root element found!');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
