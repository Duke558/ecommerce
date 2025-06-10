import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';

// Clerk publishable key
const clerkPubKey = 'pk_test_Ym9zcy1kYXNzaWUtODUuY2xlcmsuYWNjb3VudHMuZGV2JA';

const router = createBrowserRouter(
  [
    {
      path: '*',
      element: <App />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
