import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, Save, Eye, EyeOff, KeyRound } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [archivePassword, setArchivePassword] = useState('');
  const [tagPassword, setTagPassword] = useState('');
  const [showArchivePw, setShowArchivePw] = useState(false);
  const [showTagPw, setShowTagPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load passwords on open
  useEffect(() => {
    if (isOpen && !loaded && window.electronAPI?.getPasswords) {
      window.electronAPI.getPasswords().then(res => {
        if (res) {
          setArchivePassword(res.archivePassword || '');
          setTagPassword(res.tagFilePassword || '');
        }
        setLoaded(true);
      }).catch(() => setLoaded(true));
    }
  }, [isOpen, loaded]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setLoaded(false);
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (window.electronAPI?.setPasswords) {
      await window.electronAPI.setPasswords(archivePassword, tagPassword);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div
        className="w-[480px] max-w-[90vw] bg-surface border border-white/[0.15] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.12] bg-surface-elevated/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent-neon" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Security Settings</h2>
              <p className="text-[10px] font-mono text-slate-400">Archive & tag file passwords</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Archive Password */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 mb-2">
              <Lock className="w-3 h-3 text-accent-cyan" />
              Thumbnail Archive Password
            </label>
            <p className="text-[10px] font-mono text-slate-500 mb-2">
              Encrypts video & PDF thumbnail archives in the dump folder
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type={showArchivePw ? 'text' : 'password'}
                  value={archivePassword}
                  onChange={e => setArchivePassword(e.target.value)}
                  placeholder="Leave empty for no encryption"
                  className="w-full h-8 px-3 bg-black/50 border border-white/[0.12] text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
                />
                <button
                  onClick={() => setShowArchivePw(!showArchivePw)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showArchivePw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tag File Password */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 mb-2">
              <KeyRound className="w-3 h-3 text-accent-magenta" />
              Tags File Password
            </label>
            <p className="text-[10px] font-mono text-slate-500 mb-2">
              Encrypts the global tag array text file in the dump folder
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type={showTagPw ? 'text' : 'password'}
                  value={tagPassword}
                  onChange={e => setTagPassword(e.target.value)}
                  placeholder="Leave empty for no encryption"
                  className="w-full h-8 px-3 bg-black/50 border border-white/[0.12] text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-accent-magenta/60"
                />
                <button
                  onClick={() => setShowTagPw(!showTagPw)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showTagPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.12] bg-surface-elevated/50 flex items-center justify-between">
          <span className={`text-[10px] font-mono transition-opacity duration-300 ${saved ? 'text-accent-neon opacity-100' : 'opacity-0'}`}>
            ✓ Passwords saved successfully
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white border border-white/[0.12] hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-mono font-semibold bg-accent hover:bg-accent-hover text-white border border-accent/60 transition-all flex items-center gap-1.5 shadow-glow-accent"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
