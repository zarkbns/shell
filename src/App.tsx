/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Info,
  Fingerprint,
  Sparkles,
  ChevronRight,
  Settings,
  UserCheck,
  Bell,
  HelpCircle,
  ArrowRight,
  Wallet
} from 'lucide-react';

// Simplified types for clean, user-friendly layout
interface TrustedContact {
  id: string;
  name: string;
  addressLabel: string;
}

interface SimplifiedLog {
  id: string;
  timestamp: string;
  title: string;
  destination: string;
  amount: string;
  status: 'Safe & Approved' | 'Blocked by Shell';
  explanation: string;
}

interface PreSetScenario {
  id: string;
  title: string;
  description: string;
  threatLevel: 'Scam Threat' | 'Mimic Trap' | 'Rogue Background Attempt' | 'Safe Direct Transfer';
  recipientName: string;
  amount: string;
  payloadDescription: string;
  riskDescription: string;
  recommendation: string;
}

export default function App() {
  // --- Simplified State ---
  const [balance, setBalance] = useState<number>(85.75);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(true);
  const [isAwayModeActive, setIsAwayModeActive] = useState<boolean>(false);
  const [isPinRequired, setIsPinRequired] = useState<boolean>(true);
  const [scamDetectionEnabled, setScamDetectionEnabled] = useState<boolean>(true);
  
  const [pinCode] = useState<string>('7721'); // Simple passcode for high-value transfers
  const [transferLimit] = useState<number>(10); // Easy SOL limit
  const [newContactName, setNewContactName] = useState('');

  // --- Send Form State ---
  const [recipientInput, setRecipientInput] = useState('');
  const [amountInput, setAmountInput] = useState('1.5');
  const [txNote, setTxNote] = useState('');
  
  // --- Active Testing State ---
  const [pipelineState, setPipelineState] = useState<'idle' | 'checking' | 'blocked' | 'pin-required' | 'approved'>('idle');
  const [currentScenario, setCurrentScenario] = useState<PreSetScenario | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [customExplanation, setCustomExplanation] = useState('');

  // --- Trusted Contact List ---
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([
    { id: '1', name: 'Alice (Sister)', addressLabel: 'Verified Wallet •••• 7R8S' },
    { id: '2', name: 'Binance Exchange Pool', addressLabel: 'Verified Trusted Account' }
  ]);

  // --- Simplified Human-Readable Log (No technical jargon) ---
  const [logs, setLogs] = useState<SimplifiedLog[]>([
    {
      id: 'log-1',
      timestamp: 'Today, 2:15 PM',
      title: 'Safe Transfer Sent',
      destination: 'Alice (Sister)',
      amount: '5.0 SOL',
      status: 'Safe & Approved',
      explanation: 'No security warnings detected. Handled safely.'
    },
    {
      id: 'log-2',
      timestamp: 'Yesterday, 11:30 AM',
      title: 'Blocked Dangerous Link',
      destination: 'Unverified Claim Website',
      amount: '0.0 SOL',
      status: 'Blocked by Shell',
      explanation: 'A malicious website tried to secretly empty your wallet. Shell intercepted and stopped it automatically.'
    }
  ]);

  // --- Simplified Scenarios representing typical situations ---
  const SIMULATION_SCENARIOS: PreSetScenario[] = [
    {
      id: 'claim-scam',
      title: 'Claim "Free Crypto" Link',
      description: 'Simulate clicking a deceptive link claiming to give you free coins.',
      threatLevel: 'Scam Threat',
      recipientName: 'Fake Rewards Claim Site',
      amount: '0.0',
      payloadDescription: 'Secretly requests full permission to transfer your digital tokens.',
      riskDescription: 'This looks like a free token claim, but its hidden command is designed to drain your entire wallet instantly.',
      recommendation: 'Shell blocked this request. Never sign any permission prompts on unverified rewards pages.'
    },
    {
      id: 'cloned-wallet',
      title: 'Mimic Address Trap',
      description: 'Simulate a fake wallet generated to look like your sister Alice.',
      threatLevel: 'Mimic Trap',
      recipientName: 'Alice (Mimic Clone Wallet)',
      amount: '12.0',
      payloadDescription: 'Address matches the start and end of Alice, but has different middle characters.',
      riskDescription: 'Scammers generate fake addresses matching your friends to trick you into copy-pasting the wrong account.',
      recommendation: 'Do not copy this account. Use your saved Trusted Contacts instead.'
    },
    {
      id: 'offline-hack',
      title: 'Rogue App Activity (Away Test)',
      description: 'Simulate an unapproved app attempting a secret transfer while you are away.',
      threatLevel: 'Rogue Background Attempt',
      recipientName: 'Unknown External Address',
      amount: '25.0',
      payloadDescription: 'Automatic background transaction initiated without your active presence.',
      riskDescription: 'Unexpected high-value movement. Because Away Mode is turned ON, all outbound activity is frozen to safeguard your savings.',
      recommendation: 'Turn on Away Mode whenever you close your wallet to prevent rogue browser extensions from moving funds.'
    },
    {
      id: 'safe-transfer',
      title: 'Send to Sister Alice',
      description: 'Simulate a routine, secure transfer to your trusted contact.',
      threatLevel: 'Safe Direct Transfer',
      recipientName: 'Alice (Sister)',
      amount: '3.5',
      payloadDescription: 'Direct standard transfer to a verified contact.',
      riskDescription: 'This address is stored safely in your personal Trusted Contacts and has a clean security history.',
      recommendation: 'Perfect security rating. Safe to complete transfer.'
    }
  ];

  // Apply scenario parameters to the simple form
  const applyScenario = (sc: PreSetScenario) => {
    setCurrentScenario(sc);
    setRecipientInput(sc.recipientName);
    setAmountInput(sc.amount);
    setTxNote(sc.payloadDescription);
    setPipelineState('idle');
  };

  // Run protection logic
  const handleInterceptAndCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientInput.trim()) return;

    setPipelineState('checking');
    setPinError('');
    setEnteredPin('');

    setTimeout(() => {
      // 1. If shield is turned off completely
      if (!isShieldActive) {
        approveTransaction('Protection disabled. Completed unprotected.');
        return;
      }

      // 2. Is Away Mode ON?
      if (isAwayModeActive) {
        blockTransaction(
          'Blocked by Away-Mode Lock',
          'Shell stopped this outbound activity because your wallet is in Away Mode. Turn Away Mode off when you want to make transfers.'
        );
        return;
      }

      // 3. Scan for common mock indicators
      const isDangerousScam = recipientInput.toLowerCase().includes('scam') || 
                              recipientInput.toLowerCase().includes('fake') || 
                              (currentScenario && currentScenario.threatLevel === 'Scam Threat');
                     
      const isMimicAttack = recipientInput.toLowerCase().includes('mimic') || 
                            (currentScenario && currentScenario.threatLevel === 'Mimic Trap');

      const isRogueAttempt = (currentScenario && currentScenario.threatLevel === 'Rogue Background Attempt');

      if (scamDetectionEnabled) {
        if (isRogueAttempt) {
          blockTransaction(
            'Blocked: Device Protection Locked',
            'Shell prevented an automated transfer because your account is locked in Away Mode. This blocks background malware from running transactions.'
          );
          return;
        }

        if (isDangerousScam) {
          blockTransaction(
            'Blocked: Critical Theft Pattern',
            'Our scanner identified this destination as a known asset-draining trap designed to empty your wallet. Transfer stopped automatically.'
          );
          return;
        }

        if (isMimicAttack) {
          blockTransaction(
            'Blocked: Mimic Account Trap',
            'Warning: This address is designed to look like your sister Alice but is a different, unverified wallet. This is a clone hack attempt.'
          );
          return;
        }
      }

      // 4. Require PIN for high-value transfers
      const amount = parseFloat(amountInput) || 0;
      const isWhitelisted = trustedContacts.some(c => recipientInput.includes(c.name));

      if (isPinRequired && amount > transferLimit && !isWhitelisted) {
        setPipelineState('pin-required');
        setCustomExplanation(`This transfer of ${amount} SOL is above your limit of ${transferLimit} SOL to unverified addresses. Confirm with your PIN to proceed.`);
        return;
      }

      // Safe transfer
      approveTransaction('Verified Safe Transfer completed successfully.');
    }, 1100);
  };

  const blockTransaction = (title: string, msg: string) => {
    setPipelineState('blocked');
    setCustomExplanation(msg);

    const newLog: SimplifiedLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      title,
      destination: recipientInput,
      amount: `${amountInput} SOL`,
      status: 'Blocked by Shell',
      explanation: msg
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const approveTransaction = (msg: string) => {
    setPipelineState('approved');
    setCustomExplanation(msg);

    const cost = parseFloat(amountInput) || 0;
    setBalance(prev => Math.max(0, prev - cost));

    const newLog: SimplifiedLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      title: 'Safe Transfer Sent',
      destination: recipientInput,
      amount: `${amountInput} SOL`,
      status: 'Safe & Approved',
      explanation: msg
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Verify PIN
  const handleVerifyPin = () => {
    if (enteredPin === pinCode) {
      approveTransaction('Approved securely with your personal 4-digit PIN.');
    } else {
      setPinError('Incorrect PIN. Security lock active.');
    }
  };

  // Reset form
  const handleReset = () => {
    setRecipientInput('');
    setAmountInput('1.5');
    setTxNote('');
    setPipelineState('idle');
    setCurrentScenario(null);
  };

  // Add contact
  const handleAddContact = () => {
    if (newContactName.trim()) {
      const newC: TrustedContact = {
        id: `c-${Date.now()}`,
        name: newContactName.trim(),
        addressLabel: 'Verified Trusted Account'
      };
      setTrustedContacts(prev => [...prev, newC]);
      setNewContactName('');
    }
  };

  // Remove contact
  const handleDeleteContact = (id: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-warmdark text-[#FAF9F6] flex flex-col font-sans selection:bg-[#4289CB] selection:text-white">
      
      {/* --- REBRANDED BRAND HEADER --- */}
      <header className="border-b border-[#2A2422] bg-deepbrown/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {/* BRAND LOGO VECTOR - PRECISE SIX-SEGMENT CURVED RING AS PROVIDED */}
            <div className="relative shrink-0">
              <div className="p-1 rounded-xl bg-deepbrown border border-[#3A3230] flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-[#EEE5BC]" 
                  viewBox="0 0 500 500" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  id="shell-logo-svg"
                >
                  <g transform="translate(250, 250)">
                    {/* Segment 1 */}
                    <path 
                      d="M -20,-120 C -70,-120 -110,-90 -110,-40 C -110,-10 -90,10 -60,10 C -30,10 -15,-15 -25,-45 C -35,-75 -15,-85 10,-85 C 35,-85 45,-60 30,-30" 
                      stroke="#EEE5BC" 
                      strokeWidth="24" 
                      strokeLinecap="round" 
                      fill="none"
                      transform="rotate(0)"
                    />
                    {/* Segment 2 */}
                    <path 
                      d="M -20,-120 C -70,-120 -110,-90 -110,-40 C -110,-10 -90,10 -60,10 C -30,10 -15,-15 -25,-45 C -35,-75 -15,-85 10,-85 C 35,-85 45,-60 30,-30" 
                      stroke="#EEE5BC" 
                      strokeWidth="24" 
                      strokeLinecap="round" 
                      fill="none"
                      transform="rotate(60)"
                    />
                    {/* Segment 3 */}
                    <path 
                      d="M -20,-120 C -70,-120 -110,-90 -110,-40 C -110,-10 -90,10 -60,10 C -30,10 -15,-15 -25,-45 C -35,-75 -15,-85 10,-85 C 35,-85 45,-60 30,-30" 
                      stroke="#EEE5BC" 
                      strokeWidth="24" 
                      strokeLinecap="round" 
                      fill="none"
                      transform="rotate(120)"
                    />
                    {/* Segment 4 */}
                    <path 
                      d="M -20,-120 C -70,-120 -110,-90 -110,-40 C -110,-10 -90,10 -60,10 C -30,10 -15,-15 -25,-45 C -35,-75 -15,-85 10,-85 C 35,-85 45,-60 30,-30" 
                      stroke="#EEE5BC" 
                      strokeWidth="24" 
                      strokeLinecap="round" 
                      fill="none"
                      transform="rotate(180)"
                    />
                    {/* Segment 5 */}
                    <path 
                      d="M -20,-120 C -70,-120 -110,-90 -110,-40 C -110,-10 -90,10 -60,10 C -30,10 -15,-15 -25,-45 C -35,-75 -15,-85 10,-85 C 35,-85 45,-60 30,-30" 
                      stroke="#EEE5BC" 
                      strokeWidth="24" 
                      strokeLinecap="round" 
                      fill="none"
                      transform="rotate(240)"
                    />
                    {/* Segment 6 */}
                    <path 
                      d="M -20,-120 C -70,-120 -110,-90 -110,-40 C -110,-10 -90,10 -60,10 C -30,10 -15,-15 -25,-45 C -35,-75 -15,-85 10,-85 C 35,-85 45,-60 30,-30" 
                      stroke="#EEE5BC" 
                      strokeWidth="24" 
                      strokeLinecap="round" 
                      fill="none"
                      transform="rotate(300)"
                    />
                  </g>
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#EEE5BC] font-mono">SHELL</span>
                <span className="text-[10px] bg-[#4289CB] text-white px-2 py-0.5 rounded-full font-semibold">SAFEGUARD</span>
              </div>
              <p className="text-xs text-slate-400">Simplified Background Protector for Crypto Wallets</p>
            </div>
          </div>

          {/* Simple Clean Balance */}
          <div className="flex items-center gap-4 bg-deepbrown border border-[#3A3230] rounded-xl px-4 py-2">
            <div className="text-right">
              <span className="text-[9px] text-[#EEE5BC]/70 uppercase font-bold block">Balance</span>
              <span className="text-base font-bold text-[#EEE5BC] font-mono">{balance.toFixed(2)} SOL</span>
            </div>
            <div className="border-l border-[#3A3230] h-8 pl-3 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Shield</span>
              <span className="text-xs text-[#4289CB] font-bold">
                {isAwayModeActive ? 'Away Mode (Frozen)' : 'Active Monitoring'}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* --- SIMPLIFIED PROTECTION LEVEL CONFIGURATION --- */}
      <div className="bg-deepbrown border-b border-[#2A2422] px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[#EEE5BC]/80 font-medium">Automatic Anti-Theft Protection:</span>
              <span className={`font-bold ${isShieldActive ? 'text-[#4289CB]' : 'text-slate-500'}`}>
                {isShieldActive ? 'ON (Background Interceptor Running)' : 'OFF (Warning: Unprotected)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">PIN Code Safe Lock:</span>
              <span className="text-[#EEE5BC] bg-[#1A1615] px-2.5 py-0.5 rounded-full font-bold border border-[#3A3230]">
                {isPinRequired ? 'Enabled above 10 SOL' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* AWAY MODE SWITCH - SIMPLIFIED BLOCKING OF HACKS */}
          <div className="flex items-center gap-3">
            <span className="text-[#EEE5BC]/90 font-medium">Instant Lockout Status:</span>
            <div className="flex rounded-lg bg-slate-950 p-0.5 border border-[#3A3230]">
              <button
                onClick={() => setIsAwayModeActive(false)}
                className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 text-xs ${
                  !isAwayModeActive
                    ? 'bg-[#4289CB] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                id="mode-present-btn"
              >
                <Unlock className="w-3.5 h-3.5" /> I'm Active
              </button>
              <button
                onClick={() => setIsAwayModeActive(true)}
                className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 text-xs ${
                  isAwayModeActive
                    ? 'bg-[#EEE5BC] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                id="mode-away-btn"
              >
                <Lock className="w-3.5 h-3.5" /> Locked (Away)
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- CONTENT WORKSPACE --- */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* CONTROLS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: LIVE SCENARIO TESTS & FORM */}
          <div className="flex flex-col gap-6">
            
            {/* SIMULATED HACKS TO CHOOSE */}
            <div>
              <h3 className="text-xs text-[#EEE5BC] font-bold uppercase tracking-wider mb-3">
                Try a Security Simulation below:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SIMULATION_SCENARIOS.map((sc) => {
                  const isChosen = currentScenario?.id === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => applyScenario(sc)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between group ${
                        isChosen
                          ? 'bg-deepbrown border-[#4289CB] shadow-lg shadow-[#4289CB]/10'
                          : 'bg-[#1C1817]/40 border-[#2A2422] hover:bg-deepbrown hover:border-[#3A3230]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-xs text-[#FAF9F6] group-hover:text-[#4289CB] transition-colors">
                            {sc.title}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            sc.threatLevel === 'Safe Direct Transfer'
                              ? 'bg-[#4289CB]/20 text-[#4289CB]'
                              : 'bg-[#EEE5BC]/20 text-[#EEE5BC]'
                          }`}>
                            {sc.threatLevel === 'Safe Direct Transfer' ? 'Safe' : 'Scam Match'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {sc.description}
                        </p>
                      </div>
                      
                      <div className="text-[10px] text-slate-500 mt-4 pt-2 border-t border-[#2A2422] flex items-center justify-between w-full">
                        <span>Load transfer</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIMPLIFIED TRANSFER PANEL */}
            <div className="bg-deepbrown border border-[#3A3230] rounded-2xl p-6">
              <h3 className="font-bold text-white text-sm mb-4 flex items-center justify-between">
                <span>Simulator Sandbox</span>
                {currentScenario && (
                  <span className="text-xs text-[#4289CB] font-bold">
                    Preset Loaded: {currentScenario.title}
                  </span>
                )}
              </h3>

              <form onSubmit={handleInterceptAndCheck} className="flex flex-col gap-4">
                
                {/* Simplified address destination label */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Send To</label>
                  <input
                    type="text"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    placeholder="Enter wallet name or custom address label..."
                    className="w-full bg-slate-950 border border-[#2A2422] focus:border-[#4289CB] rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">How much to send (SOL)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-slate-950 border border-[#2A2422] focus:border-[#4289CB] rounded-xl px-3 py-2.5 text-xs text-white font-mono outline-none"
                    required
                  />
                </div>

                {/* Simulated action details (no jargon, just human description) */}
                {txNote && (
                  <div className="p-3.5 bg-slate-950 border border-[#2A2422] rounded-xl text-xs text-slate-300">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Background Activity Note:</span>
                    {txNote}
                  </div>
                )}

                {/* ACTION TRIGGER BUTTON */}
                <div className="flex gap-2.5 mt-2">
                  <button
                    type="submit"
                    disabled={pipelineState === 'checking'}
                    className="flex-1 py-3.5 rounded-xl bg-[#4289CB] hover:bg-[#4289CB]/90 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {pipelineState === 'checking' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Shell Shield Verifying Address...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-[#EEE5BC]" /> Intercept & Send Securely
                      </>
                    )}
                  </button>

                  {currentScenario && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-3.5 bg-slate-950 hover:bg-slate-900 text-slate-400 rounded-xl text-xs transition-all border border-[#2A2422]"
                    >
                      Clear
                    </button>
                  )}
                </div>

              </form>

              {/* --- PIPELINE SECURITY FEEDBACK (Jargon-free & Simple) --- */}
              {pipelineState !== 'idle' && pipelineState !== 'checking' && (
                <div className="mt-6 border-t border-[#2A2422] pt-5">
                  
                  {/* BLOCKED RESULTS */}
                  {pipelineState === 'blocked' && (
                    <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-5">
                      <div className="flex gap-3">
                        <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">Security Intercept: Transaction Stopped!</h4>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            {customExplanation}
                          </p>
                          
                          {currentScenario && (
                            <div className="mt-3.5 p-3 bg-slate-950/80 rounded-lg border border-[#2A2422] text-xs">
                              <span className="text-[#EEE5BC] font-semibold block mb-0.5">Shell Protection Advice:</span>
                              <span className="text-slate-400">{currentScenario.recommendation}</span>
                            </div>
                          )}

                          <div className="mt-4 flex items-center gap-3">
                            <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-900 font-semibold">
                              Protected Successfully
                            </span>
                            <button
                              onClick={handleReset}
                              className="text-xs text-slate-400 hover:text-white underline"
                            >
                              Dismiss Alert
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APPROVED RESULTS */}
                  {pipelineState === 'approved' && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5">
                      <div className="flex gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">Safe Transfer Completed</h4>
                          <p className="text-xs text-slate-300 mt-1">
                            Shell successfully completed background security scans. No threats detected.
                          </p>
                          <p className="text-xs text-slate-400 italic mt-2">
                            "{customExplanation}"
                          </p>
                          <button
                            onClick={handleReset}
                            className="mt-3 text-xs bg-slate-950 border border-[#2A2422] px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-all"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECURITY PIN CHALLENGE */}
                  {pipelineState === 'pin-required' && (
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-5">
                      <div className="flex gap-3">
                        <Fingerprint className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">Action PIN Code Required</h4>
                          <p className="text-xs text-slate-300 mt-1">
                            {customExplanation}
                          </p>
                          <p className="text-[10px] text-[#EEE5BC] mt-2">
                            (For this interactive demo, enter default PIN: <strong className="font-mono text-xs">{pinCode}</strong>)
                          </p>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            <input
                              type="password"
                              value={enteredPin}
                              onChange={(e) => setEnteredPin(e.target.value)}
                              placeholder="PIN Code"
                              className="bg-slate-950 border border-[#2A2422] rounded-lg px-3 py-2 text-xs font-mono tracking-widest text-center w-32 outline-none focus:border-[#4289CB]"
                            />
                            <button
                              onClick={handleVerifyPin}
                              className="bg-[#4289CB] hover:bg-[#4289CB]/95 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all"
                            >
                              Authorize Transfer
                            </button>
                            <button
                              onClick={handleReset}
                              className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg border border-[#2A2422] bg-slate-950 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                          {pinError && (
                            <p className="text-xs text-rose-400 mt-2 font-bold font-mono">{pinError}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

          {/* RIGHT: TRUSTED CONTACTS & LOG REPORT */}
          <div className="flex flex-col gap-6">
            
            {/* SAVED TRUSTED CONTACTS LIST */}
            <div className="bg-deepbrown border border-[#3A3230] rounded-2xl p-5">
              <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#EEE5BC]" />
                Saved Trusted Recipients
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Transfers to people stored here bypass high-value PIN code verification automatically.
              </p>

              <div className="space-y-2.5">
                {trustedContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-2.5 bg-slate-950 border border-[#2A2422]/60 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#4289CB]/20 text-[#4289CB] flex items-center justify-center text-[11px] font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#FAF9F6]">{contact.name}</h4>
                        <p className="text-[10px] text-slate-500">{contact.addressLabel}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-rose-400 transition-all"
                      title="Remove from safe list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add contact row */}
              <div className="mt-4 pt-4 border-t border-[#2A2422] flex gap-2">
                <input
                  type="text"
                  placeholder="New Saved Contact Name..."
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="bg-slate-950 border border-[#2A2422] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 outline-none flex-1 focus:border-[#4289CB]"
                />
                <button
                  onClick={handleAddContact}
                  className="bg-[#4289CB] hover:bg-[#4289CB]/90 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

            </div>

            {/* SIMPLIFIED LOG REPORT (JARGON FREE) */}
            <div className="bg-deepbrown border border-[#3A3230] rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#EEE5BC]" />
                  Shield Status Activity Log
                </h3>
                <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-[#2A2422]">
                  Real-time Safeguards
                </span>
              </div>

              <div className="space-y-3">
                {logs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all ${
                      log.status === 'Blocked by Shell' 
                        ? 'bg-rose-950/10 border-rose-500/20' 
                        : 'bg-slate-950/60 border-[#2A2422]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'Blocked by Shell' ? 'bg-rose-500' : 'bg-emerald-400'
                        }`} />
                        <span className="text-xs font-bold text-white">{log.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Recipient: <strong>{log.destination}</strong></span>
                      <span className="font-mono font-bold text-[#EEE5BC]">{log.amount}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 italic mt-0.5 leading-relaxed">
                      {log.explanation}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-[#2A2422] py-6 text-center text-xs text-slate-500 mt-auto bg-deepbrown">
        <p>© 2026 Shell Security. Your Offline & Online Shield.</p>
      </footer>

    </div>
  );
}
