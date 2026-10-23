import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './site/App.jsx';
import Chatbot from './site/Chatbot.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Chatbot />
  </React.StrictMode>,
);
