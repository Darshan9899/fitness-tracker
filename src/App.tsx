import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Planner from './pages/Planner';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// Define app routes
type Route = 'dashboard' | 'workouts' | 'planner' | 'analytics' | 'profile';

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('dashboard');

  // Render current page based on route
  const renderPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'workouts':
        return <Workouts />;
      case 'planner':
        return <Planner />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <WorkoutProvider>
          <Layout currentRoute={currentRoute} setCurrentRoute={setCurrentRoute}>
            {renderPage()}
          </Layout>
        </WorkoutProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;