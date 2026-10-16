import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AIChatAssistant from './components/ai/AIChatAssistant';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const location = useLocation();

  // Ye routes pe Navbar/Footer nahi dikhega
  const hideLayout =
    location.pathname === '/auth' ||
    location.pathname === '/admin-login';

  return (
    <div className="app">
      <ScrollToTop />

      {!hideLayout && <Navbar />}

      <main className={`app__main ${hideLayout ? 'app__main--no-navbar' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}

      {!hideLayout && <AIChatAssistant />}
    </div>
  );
}

export default App;