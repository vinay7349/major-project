import React, { useState } from 'react';
import { X, Camera, Barcode, Check } from 'lucide-react';

const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scannedCode, setScannedCode] = useState('');

  if (!isOpen) return null;

  const handleSimulateScan = (code) => {
    setScannedCode(code);
    setTimeout(() => {
      onScanSuccess(code);
      setScannedCode('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-md">
      <div className="glass-card max-w-md w-full rounded-3xl p-6 relative border border-charcoal/50 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate/80 hover:text-slate/60 rounded-full hover:bg-charcoal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-cyan-400 text-xs font-semibold mb-4">
          <Camera className="w-3.5 h-3.5" />
          <span>Live Barcode Scanner</span>
        </div>

        <h3 className="text-xl font-bold text-slate/60 mb-2">Scan Product Barcode</h3>
        <p className="text-xs text-slate/80 mb-6">Align barcode within red frame to auto-fill checkout</p>

        {/* Viewfinder simulation */}
        <div className="relative w-full h-48 rounded-2xl bg-charcoal border-2 border-charcoal overflow-hidden flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-indigo-500/10"></div>
          
          {/* Scanning Line Animation */}
          <div className="absolute left-4 right-4 h-0.5 bg-red shadow-[0_0_15px_#f43f5e] animate-pulse"></div>

          <Barcode className="w-24 h-24 text-slate opacity-60" />

          {scannedCode && (
            <div className="absolute inset-0 bg-mutedgreen/80 backdrop-blur-sm flex items-center justify-center text-emerald-300 font-mono text-lg font-bold gap-2">
              <Check className="w-6 h-6 text-emerald-400" />
              <span>{scannedCode}</span>
            </div>
          )}
        </div>

        {/* Sample Barcode Buttons */}
        <div className="text-left mb-2">
          <span className="text-xs text-slate/80 font-medium block mb-2">Quick Test Barcodes:</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleSimulateScan('8901234567891')}
              className="px-3 py-2 rounded-xl bg-charcoal hover:bg-charcoal/30 border border-charcoal text-slate/60 transition-all font-mono"
            >
              8901234567891
            </button>
            <button
              onClick={() => handleSimulateScan('8901234567892')}
              className="px-3 py-2 rounded-xl bg-charcoal hover:bg-charcoal/30 border border-charcoal text-slate/60 transition-all font-mono"
            >
              8901234567892
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;



