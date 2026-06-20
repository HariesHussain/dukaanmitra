import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// Define context type for App state
interface AppState {
  geminiKey: string;
  sheetsId: string;
  serviceAccountJson: string;
  upiId: string;
  whatsappPhone: string;
  whatsappToken: string;
  isAuthenticated: boolean;
  setCredentials: (creds: {
    geminiKey?: string;
    sheetsId?: string;
    serviceAccountJson?: string;
    upiId?: string;
    whatsappPhone?: string;
    whatsappToken?: string;
  }) => void;
  login: () => void;
  logout: () => void;
  clearConfig: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default function App() {
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_key') || '');
  const [sheetsId, setSheetsId] = useState(() => localStorage.getItem('sheets_id') || '');
  const [serviceAccountJson, setServiceAccountJson] = useState(() => localStorage.getItem('service_account_json') || '');
  const [upiId, setUpiId] = useState(() => localStorage.getItem('upi_id') || 'dukaanmitra@upi');
  const [whatsappPhone, setWhatsappPhone] = useState(() => localStorage.getItem('whatsapp_phone') || '');
  const [whatsappToken, setWhatsappToken] = useState(() => localStorage.getItem('whatsapp_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('is_authenticated') === 'true');

  useEffect(() => {
    localStorage.setItem('gemini_key', geminiKey);
    localStorage.setItem('sheets_id', sheetsId);
    localStorage.setItem('service_account_json', serviceAccountJson);
    localStorage.setItem('upi_id', upiId);
    localStorage.setItem('whatsapp_phone', whatsappPhone);
    localStorage.setItem('whatsapp_token', whatsappToken);
    localStorage.setItem('is_authenticated', String(isAuthenticated));
  }, [geminiKey, sheetsId, serviceAccountJson, upiId, whatsappPhone, whatsappToken, isAuthenticated]);

  const setCredentials = (creds: {
    geminiKey?: string;
    sheetsId?: string;
    serviceAccountJson?: string;
    upiId?: string;
    whatsappPhone?: string;
    whatsappToken?: string;
  }) => {
    if (creds.geminiKey !== undefined) setGeminiKey(creds.geminiKey);
    if (creds.sheetsId !== undefined) setSheetsId(creds.sheetsId);
    if (creds.serviceAccountJson !== undefined) setServiceAccountJson(creds.serviceAccountJson);
    if (creds.upiId !== undefined) setUpiId(creds.upiId);
    if (creds.whatsappPhone !== undefined) setWhatsappPhone(creds.whatsappPhone);
    if (creds.whatsappToken !== undefined) setWhatsappToken(creds.whatsappToken);
  };

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const clearConfig = () => {
    setGeminiKey('');
    setSheetsId('');
    setServiceAccountJson('');
    setUpiId('dukaanmitra@upi');
    setWhatsappPhone('');
    setWhatsappToken('');
  };

  // Helper component for protected routes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <AppContext.Provider value={{
      geminiKey,
      sheetsId,
      serviceAccountJson,
      upiId,
      whatsappPhone,
      whatsappToken,
      isAuthenticated,
      setCredentials,
      login,
      logout,
      clearConfig
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
