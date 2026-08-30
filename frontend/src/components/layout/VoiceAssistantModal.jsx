import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { isListening, transcript, lastResponse, startListening, stopListening } = useVoiceAssistant();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-md w-full rounded-3xl p-8 relative overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-slate-800/40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ShopGenie AI Voice Assistant</span>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          How can I help you today?
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          Speak naturally. Try saying <span className="text-indigo-400 font-medium font-mono">"Go to billing"</span> or <span className="text-indigo-400 font-medium font-mono">"Open inventory"</span>
        </p>

        {/* Visualizer Equalizer */}
        <div className="flex items-center justify-center gap-2 h-16 mb-8">
          {isListening ? (
            <div className="flex items-center gap-1.5 h-12">
              <div className="w-1.5 bg-indigo-500 rounded-full animate-bounce h-6"></div>
              <div className="w-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s] h-10"></div>
              <div className="w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s] h-12"></div>
              <div className="w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.1s] h-8"></div>
              <div className="w-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.3s] h-5"></div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Mic className="w-8 h-8 opacity-40" />
            </div>
          )}
        </div>

        {transcript && (
          <div className="mb-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs font-mono text-indigo-400 border border-slate-200 dark:border-slate-700/50">
            "{transcript}"
          </div>
        )}

        {lastResponse && (
          <div className="mb-6 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
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
              className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full flex items-center gap-2 font-medium transition-all"
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
