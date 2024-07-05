// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './ContextAPI/AuthContext';
import AppRoutes from './components/Routes/Routes';
import { SidebarProvider } from './ContextAPI/SidebarContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <SidebarProvider>
          <AppRoutes />
        </SidebarProvider>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}

export default App;
