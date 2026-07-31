import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { toggleTheme } = useTheme();

  let recognition = null;

  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      setLastResponse(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const processCommand = (cmdText) => {
    const text = cmdText.toLowerCase().trim();
    setTranscript(cmdText);

    if (text.includes('dashboard') || text.includes('home')) {
      speak('Opening Dashboard');
      navigate('/dashboard');
    } else if (text.includes('billing') || text.includes('pos') || text.includes('invoice') || text.includes('sale')) {
      speak('Navigating to Billing POS system');
      navigate('/billing');
    } else if (text.includes('inventory') || text.includes('stock')) {
      speak('Opening Inventory management');
      navigate('/inventory');
    } else if (text.includes('product') || text.includes('catalog')) {
      speak('Opening Product Catalog');
      navigate('/products');
    } else if (text.includes('ai') || text.includes('detect') || text.includes('camera') || text.includes('scan')) {
      speak('Launching AI Product Detection module');
      navigate('/ai-detection');
    } else if (text.includes('analytics') || text.includes('chart') || text.includes('revenue')) {
      speak('Opening Sales and Revenue Analytics');
      navigate('/analytics');
    } else if (text.includes('recommend') || text.includes('suggestion')) {
      speak('Showing AI product recommendations');
      navigate('/recommendations');
    } else if (text.includes('notification') || text.includes('alert')) {
      speak('Opening Notifications center');
      navigate('/notifications');
    } else if (text.includes('dark mode') || text.includes('light mode') || text.includes('theme')) {
      speak('Toggling interface theme');
      toggleTheme();
    } else if (text.includes('help') || text.includes('what can you do')) {
      const msg = 'I can help you navigate to Dashboard, Billing POS, Inventory, AI Product Detection, Analytics, and Recommendations.';
      speak(msg);
      addToast(msg, 'info', 'ShopGenie AI Assistant');
    } else {
      const fallback = `Command not recognized: "${cmdText}". Try saying "open billing" or "go to inventory".`;
      speak('Command not recognized. Try saying open billing or go to inventory.');
      addToast(fallback, 'error', 'Voice Command');
    }
  };

  const startListening = () => {
    if (!recognition) {
      addToast('Web Speech API is not supported in this browser. Please use Chrome or Edge.', 'error', 'Speech Recognition');
      return;
    }

    try {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        processCommand(spokenText);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          addToast(`Voice error: ${event.error}`, 'error');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    lastResponse,
    startListening,
    stopListening,
    speak,
  };
};
