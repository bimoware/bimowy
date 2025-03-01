import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RouterManager from './router.tsx';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterManager/>
  </StrictMode>,
)
