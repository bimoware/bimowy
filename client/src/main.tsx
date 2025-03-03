import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import './style.css';
import DashboardPage from './pages/DashboardPage.tsx';
import SideBar from './components/SideBar.tsx';
import PageSection from './components/PageSection.tsx';
import TestPage from './pages/TestPage.tsx';
import QuizPage from './pages/QuizPage.tsx';
import SubjectsPage from './pages/SubjectsPage.tsx';

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <SideBar />
      <PageSection className="w-full p-6">
        <Routes>
          <Route index element={<TestPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="quiz">
            <Route path=":quizid" element={<QuizPage />} />
          </Route>
        </Routes>
      </PageSection>
    </BrowserRouter>
  </StrictMode>
);