import {
  Routes,
  Route
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import HabitsPage from './pages/HabitsPage';
import GoalsPage from './pages/GoalsPage';
import FinancesPage from './pages/FinancesPage';
import SchedulePage from './pages/SchedulePage';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/habits"
        element={<HabitsPage />}
      />

      <Route
        path="/goals"
        element={<GoalsPage />}
      />

      <Route
        path="/finances"
        element={<FinancesPage />}
      />

      <Route
        path="/schedule"
        element={<SchedulePage/>}
      />  

    </Routes>
  );
}