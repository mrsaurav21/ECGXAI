import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOG_CLIENT_ID = "913621730108-t9cp7g78co3ca72ffnfghqp0mp1ivrb6.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOG_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);