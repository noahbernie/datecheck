import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
import store from './reducer/store'
import AppWithRouter from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <AppWithRouter />
    </Provider>
  </StrictMode>
);
