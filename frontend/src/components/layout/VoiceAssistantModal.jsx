import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { isListening, transcript, lastResponse, startListening, stopListening } = useVoiceAssistant();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-md w-full rounded-3xl p-8 relative overflow-hidden border border-charcoal/30 shadow-2xl shadow-charcoal/20 text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-charcoal/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-charcoal/30 rounded-full blur-3xl"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate/80 hover:text-slate/60 transition-colors rounded-full hover:bg-charcoal/40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal/10 border border-charcoal/30 text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ShopGenie AI Voice Assistant</span>
        </div>

        <h3 className="text-2xl font-bold text-charcoal dark:text-slate/60 mb-2">
          How can I help you today?
        </h3>
        <p className="text-slate dark:text-slate/80 text-sm mb-8">
          Speak naturally. Try saying <span className="text-indigo-400 font-medium font-mono">"Go to billing"</span> or <span className="text-indigo-400 font-medium font-mono">"Open inventory"</span>
        </p>

        {/* Visualizer Equalizer */}
        <div className="flex items-center justify-center gap-2 h-16 mb-8">
          {isListening ? (
            <div className="flex items-center gap-1.5 h-12">
              <div className="w-1.5 bg-charcoal rounded-full animate-bounce h-6"></div>
              <div className="w-1.5 bg-charcoal rounded-full animate-bounce [animation-delay:0.2s] h-10"></div>
              <div className="w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s] h-12"></div>
              <div className="w-1.5 bg-charcoal rounded-full animate-bounce [animation-delay:0.1s] h-8"></div>
              <div className="w-1.5 bg-charcoal rounded-full animate-bounce [animation-delay:0.3s] h-5"></div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-warmwhite dark:bg-charcoal/80 flex items-center justify-center text-slate/80">
              <Mic className="w-8 h-8 opacity-40" />
            </div>
          )}
        </div>

        {transcript && (
          <div className="mb-4 p-3 rounded-xl bg-warmwhite dark:bg-charcoal/60 text-xs font-mono text-indigo-400 border border-warmwhite/60 dark:border-charcoal/50">
            "{transcript}"
          </div>
        )}

        {lastResponse && (
          <div className="mb-6 text-xs text-slate dark:text-slate/60 flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>{lastResponse}</span>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!isListening ? (
            <button
              onClick={startListening}
              className="gradient-btn-primary px-8 py-3 rounded-full flex items-center gap-2 font-medium"
            >
              <Mic className="w-5 h-5" />
              <span>Start Speaking</span>
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="bg-red hover:bg-red text-white px-8 py-3 rounded-full flex items-center gap-2 font-medium transition-all"
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



