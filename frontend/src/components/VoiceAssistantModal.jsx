import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { isListening, transcript, lastResponse, startListening, stopListening } = useVoiceAssistant();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-md animate-fade-in">
      <div className="card max-w-md w-full rounded-3xl p-8 relative overflow-hidden border border-border dark:border-border-dark shadow-modal text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-surface/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-surface/30 rounded-full blur-3xl"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted dark:text-text-mutedDark hover:text-text-primary dark:hover:text-text-dark transition-colors rounded-full hover:bg-background dark:hover:bg-background-dark"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-accent text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ShopGenie AI Voice Assistant</span>
        </div>

        <h3 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-2">
          How can I help you today?
        </h3>
        <p className="text-text-muted dark:text-text-mutedDark text-sm mb-8">
          Speak naturally. Try saying <span className="text-accent font-medium font-mono">"Go to billing"</span> or <span className="text-accent font-medium font-mono">"Open inventory"</span>
        </p>

        {/* Visualizer Equalizer */}
        <div className="flex items-center justify-center gap-2 h-16 mb-8">
          {isListening ? (
            <div className="flex items-center gap-1.5 h-12">
              <div className="w-1.5 bg-text-muted rounded-full animate-bounce h-6"></div>
              <div className="w-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s] h-10"></div>
              <div className="w-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s] h-12"></div>
              <div className="w-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.1s] h-8"></div>
              <div className="w-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.3s] h-5"></div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text-muted dark:text-text-mutedDark">
              <Mic className="w-8 h-8 opacity-40" />
            </div>
          )}
        </div>

        {transcript && (
          <div className="mb-4 p-3 rounded-button bg-background dark:bg-background-dark text-xs font-mono text-accent border border-border dark:border-border-dark">
            "{transcript}"
          </div>
        )}

        {lastResponse && (
          <div className="mb-6 text-xs text-text-muted dark:text-text-mutedDark flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4 text-accent" />
            <span>{lastResponse}</span>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!isListening ? (
            <button
              onClick={startListening}
              className="btn-primary px-8 py-3 rounded-button flex items-center gap-2 font-medium"
            >
              <Mic className="w-5 h-5" />
              <span>Start Speaking</span>
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="bg-error hover:bg-error text-white px-8 py-3 rounded-button flex items-center gap-2 font-medium transition-all"
            >
              <MicOff className="w-5 h-5" />
              <span>Stop Listening</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;



