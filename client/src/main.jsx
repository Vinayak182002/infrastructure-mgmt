import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
    <ToastContainer
      position="top-right"
      autoClose={1500}
      hideProgressBar={false}
      closeOnClick
      // rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  </StrictMode>
);
