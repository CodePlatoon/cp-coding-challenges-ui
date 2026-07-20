import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import ChallengePage from './pages/ChallengePage';
import CongratsPage from './pages/CongratsPage';
import WelcomePage from './pages/WelcomePage';

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/welcome" replace /> : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/challenges/:id" element={<ChallengePage />} />
          <Route path="/complete" element={<CongratsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
