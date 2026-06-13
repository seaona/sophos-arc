import AddHabitForm from "../components/AddHabitForm";
import AppLayout from "../components/AppLayout";
import BackupButton from "../components/BackupButton";
import HabitGrid from "../components/HabitGrid";
import MonthNavigator from "../components/MonthNavigator";
import RestoreButton from "../components/RestoreButton";
import StatsBar from "../components/StatsBar";
import ThemeToggle from "../components/ThemeToggle";
import { useHabits } from "../hooks/useHabits";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Goal } from "../types/goal";

export default function HabitsPage() {
  const {
    habits,
    logs,
    currentDate,
    setCurrentDate,
    addHabit,
    deleteHabit,
    toggleDay,
    setHabits,
    setLogs
  } = useHabits();

   const [darkMode, setDarkMode] =
    useLocalStorage<boolean>(
      'habit-tracker-theme',
      false
    );

  const [goals] =
    useLocalStorage<Goal[]>(
      'goals',
      []
    );

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  return (
   <AppLayout>
       <div className="flex items-center gap-3 justify-end mb-6">
         <BackupButton
           habits={habits}
           logs={logs}
         />
   
         <RestoreButton
           setHabits={setHabits}
           setLogs={setLogs}
         />
   
         <ThemeToggle
           darkMode={darkMode}
           toggleTheme={toggleTheme}
         />
       </div>
   
       <MonthNavigator
         currentDate={currentDate}
         setCurrentDate={setCurrentDate}
       />
   
       <div className="glass-card p-8">
         <StatsBar
           habits={habits}
           logs={logs}
           currentDate={currentDate}
         />
       </div>
   
       <AddHabitForm
         onAddHabit={addHabit}
         goals={goals}
       />
   
       <div className="glass-card p-8">
         <HabitGrid
           goals={goals}
           habits={habits}
           logs={logs}
           currentDate={currentDate}
           toggleDay={toggleDay}
           deleteHabit={deleteHabit}
         />
       </div>
     </AppLayout>
  )
}