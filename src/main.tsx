import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';
import './index.css';

import App from './App';
import FinancesPage from './pages/FinancesPage';
import HealthPage from './pages/HealthPage';
import GoalsPage from './pages/GoalsPage';
import HabitsPage from './pages/HabitsPage';

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <BrowserRouter basename="/sophos-arc">
      <Routes>
        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/habits"
          element={<HabitsPage />}
        />

        <Route
          path="/finances"
          element={<FinancesPage />}
        />

        <Route
          path="/health"
          element={<HealthPage />}
        />

        <Route
          path="/goals"
          element={<GoalsPage />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);