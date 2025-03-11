import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import './style.css'

import SideBar from './components/SideBar.tsx'
import PageSection from './components/PageSection.tsx'

import TestPage from './pages/TestPage.tsx'
import ExercicePage from './pages/ExercicePage.tsx'
import RessourcesPage from './pages/RessourcesPage.tsx'

const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <SideBar />
      <PageSection className='w-full p-6'>
        <Routes>
          <Route index element={<TestPage />} />
          <Route path='subjects' element={<RessourcesPage />} />
          <Route path='exercice'>
            <Route path=':exercice_id' element={<ExercicePage />} />
          </Route>
        </Routes>
      </PageSection>
    </BrowserRouter>
  </StrictMode>,
)
