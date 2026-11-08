"use client";

import React, { useState } from "react";

interface WhatsAppConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  setPhoneNumber: (num: string) => void;
  pairingCode: string | null;
  qrCode: string | null;
  status: string | null;
  isConnecting: boolean;
  onStartConnect: (phone: string) => void;
  onStartConnectQR: () => void;
  onConnectSimulated: () => void;
}

export default function WhatsAppConnectModal({
  isOpen,
  onClose,
  phoneNumber,
  setPhoneNumber,
  pairingCode,
  qrCode,
  status,
  isConnecting,
  onStartConnect,
  onStartConnectQR,
  onConnectSimulated,
}: WhatsAppConnectModalProps) {
  const [method, setMethod] = useState<"code" | "qr">("code");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    setError(null);
    onStartConnect(phoneNumber);
  };

  // Format pairing code for display (e.g., ABCD-EFGH)
  const formatPairingCode = (code: string) => {
    if (!code) return "";
    const clean = code.replace(/[-\s]/g, "");
    if (clean.length === 8) {
      return `${clean.substring(0, 4)}-${clean.substring(4)}`;
    }
    return code;
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0d121f] light:bg-white border border-[#1e293b]/45 light:border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 overflow-hidden glass-panel text-left relative transition-all">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b]/20 light:border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/20 border border-emerald-900/30 light:border-emerald-200/50 flex items-center justify-center text-emerald-400 shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.16 1.453 4.828 1.455 5.482 0 9.945-4.437 9.948-9.896.002-2.643-1.022-5.13-2.885-6.996C16.68 1.85 14.195.825 11.55.826c-5.485 0-9.948 4.44-9.95 9.898-.001 2.012.524 3.985 1.52 5.722L2.1 20.254l4.547-1.1c.001 0 .001 0 0 0zm12.382-7.567c-.298-.15-1.771-.875-2.045-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-3.575-1.784-4.757-3.23-5.267-4.1-.175-.3 0-.45.1-.55.125-.125.275-.3.4-.45.125-.15.175-.25.25-.425.075-.175.038-.325-.019-.425-.057-.1-.475-1.15-.65-1.575-.171-.413-.343-.356-.469-.362-.122-.006-.263-.007-.404-.007s-.37.05-.563.26c-.193.21-.738.72-.738 1.758s.755 2.038.86 2.178c.105.14 1.485 2.27 3.602 3.185 1.636.707 2.256.786 3.072.66.47-.072 1.442-.59 1.643-1.16.201-.57.201-1.058.14-1.16-.06-.1-.22-.15-.518-.3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-white light:text-slate-900 flex items-center gap-1.5">
                Connect WhatsApp
                {status === "connected" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </h3>
              <p className="text-[10px] text-slate-400 light:text-slate-500">Expose WhatsApp tools securely to Aura Assistant.</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-100 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        {status === "connected" ? (
          /* Connection Success Screen */
          <div className="space-y-6 text-center py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-black text-white light:text-slate-900">WhatsApp Connected!</h4>
              <p className="text-xs text-slate-400 light:text-slate-500 max-w-xs mx-auto">
                Secure link established successfully. Your Aura agent is now monitoring communications in real-time.
              </p>
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
              Syncing local database...
            </div>
          </div>
        ) : !pairingCode && !qrCode && !isConnecting ? (
          /* Method Selection and Initial Form Screen */
          <div className="space-y-5">
            {/* Connection Method Tabs */}
            <div className="flex border-b border-[#1e293b]/20 mb-4 gap-2">
              <button
                type="button"
                onClick={() => { setMethod("code"); setError(null); }}
                className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                  method === "code"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Link with Code
              </button>
              <button
                type="button"
                onClick={() => { setMethod("qr"); setError(null); }}
                className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                  method === "qr"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Link with QR Code
              </button>
            </div>

            {method === "code" ? (
              /* Pairing Code Flow Input Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 light:text-slate-500">
                    WhatsApp Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+15550199 or +92300123456"
                      className="w-full h-12 rounded-2xl bg-[#090d16]/80 light:bg-slate-50 border border-[#1e293b]/40 light:border-slate-200 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 text-white light:text-slate-900 px-4 outline-none transition-all text-xs font-semibold"
                    />
                  </div>
                  {error && <p className="text-[10px] font-semibold text-rose-500">{error}</p>}
                  <p className="text-[9px] text-slate-500 light:text-slate-600 leading-normal">
                    Include your country code without spaces or symbols (e.g. +14155552671).
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black text-center shadow-md shadow-emerald-950/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    Generate Linking Code
                  </button>

                  <div className="flex items-center my-1.5">
                    <div className="flex-grow border-t border-[#1e293b]/20 light:border-slate-100" />
                    <span className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-[#1e293b]/20 light:border-slate-100" />
                  </div>

                  <button
                    type="button"
                    onClick={onConnectSimulated}
                    className="w-full h-12 bg-slate-900 light:bg-slate-100 hover:bg-slate-800 light:hover:bg-slate-200 border border-white/5 light:border-slate-200 text-slate-300 light:text-slate-700 rounded-2xl text-xs font-black text-center hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    Connect in Simulated Mode
                  </button>
                </div>
              </form>
            ) : (
              /* QR Code Flow Generate Screen */
              <div className="space-y-4 text-center">
                <p className="text-xs text-slate-300 light:text-slate-600 leading-normal text-left">
                  Scan the generated QR Code using WhatsApp's built-in **Linked Devices** camera on your mobile phone to establish the connection immediately.
                </p>

                <div className="flex flex-col gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={onStartConnectQR}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black text-center shadow-md shadow-emerald-950/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    Generate QR Code
                  </button>

                  <div className="flex items-center my-1.5">
                    <div className="flex-grow border-t border-[#1e293b]/20 light:border-slate-100" />
                    <span className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-[#1e293b]/20 light:border-slate-100" />
                  </div>

                  <button
                    type="button"
                    onClick={onConnectSimulated}
                    className="w-full h-12 bg-slate-900 light:bg-slate-100 hover:bg-slate-800 light:hover:bg-slate-200 border border-white/5 light:border-slate-200 text-slate-300 light:text-slate-700 rounded-2xl text-xs font-black text-center hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    Connect in Simulated Mode
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : isConnecting && !pairingCode && !qrCode ? (
          /* Connecting Loading Screen */
          <div className="h-40 flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs text-slate-400">Initializing connection details...</span>
          </div>
        ) : qrCode ? (
          /* QR Code Scanning Screen */
          <div className="space-y-6 animate-fade-in text-center">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 light:text-slate-500">
                Scan QR Code with WhatsApp
              </span>
              <div className="flex justify-center p-3.5 bg-white rounded-2xl border border-[#1e293b]/10 max-w-[220px] mx-auto shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`}
                  alt="WhatsApp Web Link QR Code"
                  className="w-[180px] h-[180px] object-contain select-none"
                />
              </div>
            </div>

            {/* Instruction Steps for QR Code */}
            <div className="bg-slate-950/45 light:bg-slate-50 border border-[#1e293b]/20 light:border-slate-200/65 rounded-2xl p-4.5 space-y-3 text-left">
              <h4 className="text-[10px] font-black text-slate-400 light:text-slate-500 uppercase tracking-widest">
                How to Link Your Device:
              </h4>
              <ol className="space-y-2.5 text-[11px] text-slate-300 light:text-slate-600 font-medium">
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 light:bg-slate-200 text-slate-400 light:text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                  <span>Open **WhatsApp** on your mobile phone.</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 light:bg-slate-200 text-slate-400 light:text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">2</span>
                  <span>Tap **Menu** (three dots) or **Settings** and select **Linked Devices**.</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 light:bg-slate-200 text-slate-400 light:text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">3</span>
                  <span>Tap **Link a Device**.</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 light:bg-slate-200 text-slate-400 light:text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">4</span>
                  <span>Point your phone camera at the QR code above to scan.</span>
                </li>
              </ol>
            </div>

            {/* Polling/Syncing Status */}
            <div className="flex items-center justify-between text-xs px-1 text-slate-400 light:text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Waiting for QR code scan...</span>
              </div>
              <svg className="animate-spin h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        ) : (
          /* Pairing Code & Linking Instructions Screen */
          <div className="space-y-6 animate-fade-in">
            {/* Pairing Code Display */}
            <div className="text-center space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 light:text-slate-500">
                Your WhatsApp Link Code
              </span>
              
              <div className="flex justify-center items-center">
                {isConnecting && !pairingCode ? (
                  <div className="h-16 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <svg className="animate-spin h-5 w-5 text-emerald-500 mr-1.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Generating code...</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#040813] light:bg-slate-100 border border-white/5 light:border-slate-200 px-6 py-4.5 rounded-2xl font-mono text-3xl font-black text-emerald-400 light:text-emerald-600 tracking-[0.2em] shadow-inner select-all">
                    {formatPairingCode(pairingCode || "")}
                  </div>
                )}
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="bg-slate-950/45 light:bg-slate-50 border border-[#1e293b]/20 light:border-slate-200/65 rounded-2xl p-4.5 space-y-3 text-left">
              <h4 className="text-[10px] font-black text-slate-400 light:text-slate-500 uppercase tracking-widest">
                How to Link Your Device:
              </h4>
              <ol className="space-y-2.5 text-[11px] text-slate-300 light:text-slate-600 font-medium">
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 light:bg-slate-200 text-slate-400 light:text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                  <span>Open **WhatsApp** on your mobile phone.</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 light:bg-slate-200 text-slate-400 light:text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">2</span>
                  <span>Tap **Menu** (three dots) or **Settings** and select **Linked Devices**.</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 light:bg-slate-200 text-slate-400 light:text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">3</span>
                  <span>Tap **Link a Device**, then select **Link with phone number instead**.</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 light:bg-slate-200 text-slate-400 light:text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">4</span>
                  <span>Enter the 8-character pairing code shown above.</span>
                </li>
              </ol>
            </div>

            {/* Polling/Syncing Status */}
            <div className="flex items-center justify-between text-xs px-1 text-slate-400 light:text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Waiting for mobile device to link...</span>
              </div>
              <svg className="animate-spin h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
