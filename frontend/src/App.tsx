import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Rsvp from './pages/Rsvp/Rsvp';
import Food from './pages/Food/Food';
import Wall from './pages/Wall/Wall';
import Media from './pages/Media/Media';
import Killer from './pages/Killer/Killer';
import Admin from './pages/Admin/Admin';
import Questionnaire from './pages/Questionnaire/Questionnaire';
import Anecdotes from './pages/Anecdotes/Anecdotes';
import AnecdotesScreen from './pages/Screens/AnecdotesScreen';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"              element={<Login />} />
        <Route path="/dashboard"          element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/rsvp"               element={<PrivateRoute><Rsvp /></PrivateRoute>} />
        <Route path="/food"               element={<PrivateRoute><Food /></PrivateRoute>} />
        <Route path="/wall"               element={<PrivateRoute><Wall /></PrivateRoute>} />
        <Route path="/media"              element={<PrivateRoute><Media /></PrivateRoute>} />
        <Route path="/killer"             element={<PrivateRoute><Killer /></PrivateRoute>} />
        <Route path="/questionnaire"      element={<PrivateRoute><Questionnaire /></PrivateRoute>} />
        <Route path="/anecdotes"          element={<PrivateRoute><Anecdotes /></PrivateRoute>} />
        <Route path="/admin"              element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/screen/anecdotes"   element={<AdminRoute><AnecdotesScreen /></AdminRoute>} />
        <Route path="*"                   element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
