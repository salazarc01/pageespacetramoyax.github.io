
import React, { useState, useEffect } from 'react';
import { 
  Users, LogIn, UserPlus, ShieldCheck, Wallet, ChevronRight, LogOut, 
  Clock, CheckCircle2, AlertCircle, Download, Send, Trash2, Check, 
  Bell, History, XCircle, Activity, ArrowLeft, Mail, Search, User as UserIcon,
  Eye, X, Calendar, Watch, FileText, Hash, Gift, Sparkles, TrendingUp
} from 'lucide-react';
import { User, Transaction, AppState, Notification } from './types';
import { 
  ADMIN_CREDENTIALS, INITIAL_NOVARES, SUPPORT_EMAIL, 
  OPEN_TIME, CLOSE_TIME, COUNTRIES 
} from './constants';
import { generateRegistrationPDF, generateMembershipPDF } from './services/pdfService';

const LOGO_BANK = "https://i.postimg.cc/jjKR8VQP/Photoroom_20251227_172103.png";
const BONUS_CARD_BG = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800";

const COUNTRY_TIMEZONES: Record<string, string> = {
  "Argentina": "America/Argentina/Buenos_Aires",
  "Bolivia": "America/La_Paz",
  "Brasil": "America/Sao_Paulo",
  "Chile": "America/Santiago",
  "Colombia": "America/Bogota",
  "Costa Rica": "America/Costa_Rica",
  "Cuba": "America/Havana",
  "Ecuador": "America/Guayaquil",
  "El Salvador": "America/El_Salvador",
  "España": "Europe/Madrid",
  "Estados Unidos": "America/New_York",
  "Guatemala": "America/Guatemala",
  "Honduras": "America/Tegucigalpa",
  "México": "America/Mexico_City",
  "Nicaragua": "America/Managua",
  "Panamá": "America/Panama",
  "Paraguay": "America/Asuncion",
  "Perú": "America/Lima",
  "Puerto Rico": "America/Puerto_Rico",
  "República Dominicana": "America/Santo_Domingo",
  "Uruguay": "America/Montevideo",
  "Venezuela": "America/Caracas"
};

const maskPhone = (phone: string) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length < 7) return cleaned;
  const firstFive = cleaned.substring(0, 5);
  const lastOne = cleaned.substring(cleaned.length - 1);
  const asterisks = '*'.repeat(Math.max(1, cleaned.length - 6));
  return `${firstFive}${asterisks}${lastOne}`;
};

const generateReference = () => {
  return Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
};

const Nav: React.FC<{ 
  onHome: () => void; 
  onLogin: () => void; 
  onRegister: () => void; 
  onLogout: () => void; 
  currentUser: User | null; 
  isAdmin: boolean;
}> = ({ onHome, onLogin, onRegister, onLogout, currentUser, isAdmin }) => (
  <nav className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-50">
    <div onClick={onHome} className="text-2xl md:text-3xl font-orbitron font-black tracking-tighter cursor-pointer group flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-purple-500/20">X</div>
      <span className="hidden xs:inline">SPACE<span className="text-purple-500 group-hover:text-purple-400 transition-colors">TRAMOYA</span> <span className="gradient-text">X</span></span>
    </div>
    <div className="flex gap-4 items-center">
      {!currentUser && !isAdmin ? (
        <>
          <button onClick={onLogin} className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">Entrar</button>
          <button onClick={onRegister} className="px-5 py-2 glass rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">Unirse</button>
        </>
      ) : (
        <button onClick={onLogout} className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-widest hover:text-red-300 transition-all bg-red-400/5 px-4 py-2 rounded-lg border border-red-500/10">
          <LogOut size={16} /> <span>Salir</span>
        </button>
      )}
    </div>
  </nav>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-all mb-6 group"
  >
    <div className="p-2 glass rounded-lg group-hover:bg-purple-500/10 transition-colors">
      <ArrowLeft size={18} />
    </div>
    <span className="text-xs font-black uppercase tracking-widest">Volver</span>
  </button>
);

const HomeComponent: React.FC<{ onRegister: () => void; onLogin: () => void; onAdmin: () => void }> = ({ onRegister, onLogin, onAdmin }) => (
  <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 relative">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>
    <div className="mb-8 relative group">
      <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full animate-pulse"></div>
      <Users size={100} className="text-purple-400 relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
    </div>
    <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 tracking-tighter leading-none">
      SpaceTramoya <span className="gradient-text">X</span>
    </h1>
    <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mb-12 font-light leading-relaxed tracking-wide">
      Únete a la familia más exclusiva del entertainment y la <span className="text-purple-400 font-semibold">tramoya digital</span>. Regístrate y forma parte de SpaceTramoya X.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <button 
        onClick={onRegister} 
        className="group px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-orbitron font-bold text-lg transition-all transform hover:scale-105 neon-glow flex items-center gap-3 shadow-xl"
      >
        <UserPlus size={24} className="group-hover:rotate-12 transition-transform" /> Inscribirme
      </button>
      <button 
        onClick={onLogin} 
        className="px-10 py-4 glass hover:bg-white/10 rounded-2xl font-orbitron font-bold text-lg transition-all flex items-center gap-3 border border-white/10"
      >
        <LogIn size={24} /> Entrar
      </button>
    </div>
    <button 
      onClick={onAdmin} 
      className="mt-12 text-slate-500 hover:text-purple-400 flex items-center gap-2 transition-all hover:tracking-widest uppercase text-[10px] font-black"
    >
      <ShieldCheck size={14} /> Acceso VIP / Admin
    </button>
  </div>
);

const RegisterView: React.FC<{ isTimeValid: boolean; onHome: () => void; onRegister: (newUser: User) => void }> = ({ isTimeValid, onHome, onRegister }) => {
  const [formData, setFormData] = useState({ name: '', lastName: '', country: '', phone: '', email: '', password: '' });
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (isTimeValid) setShowTerms(true); };

  const confirmRegistration = () => {
    const newUser: User = {
      id: 'STX-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      ...formData,
      status: 'pending',
      balance: INITIAL_NOVARES,
      registeredAt: Date.now(),
      notifications: []
    };
    const pdfData = generateRegistrationPDF(newUser);
    onRegister(newUser);
    const body = encodeURIComponent(`Hola equipo de SpaceTramoya X,\n\nAdjunto mi solicitud formal de inscripción.\n\nDatos: ${newUser.name} ${newUser.lastName}\nID: ${newUser.id}\nContraseña elegida: ${newUser.password}\n\n(POR FAVOR ADJUNTE EL PDF)`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=Inscripcion%20SpaceTramoya%20X&body=${body}`, '_blank');
    const link = document.createElement('a'); link.href = pdfData; link.download = `STX_${newUser.id}.pdf`; link.click();
  };

  if (!isTimeValid) return (
    <div className="max-w-md mx-auto mt-20 p-8 glass rounded-3xl text-center border border-yellow-500/20 shadow-2xl">
      <Clock size={64} className="text-yellow-500 mx-auto mb-6 animate-pulse" />
      <h2 className="text-2xl font-orbitron font-bold mb-4">Plataforma Cerrada</h2>
      <p className="text-slate-400 mb-8 leading-relaxed">Las inscripciones están habilitadas diariamente de <span className="text-yellow-500 font-bold">06:00 AM a 11:30 PM</span>. Por favor, regresa dentro del horario establecido.</p>
      <button onClick={onHome} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all font-bold flex items-center justify-center gap-2">
        <ArrowLeft size={18} /> Volver al Inicio
      </button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-10">
      <BackButton onClick={onHome} />
      <div className="glass rounded-[2rem] p-8 md:p-10 neon-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full"></div>
        <h2 className="text-3xl font-orbitron font-bold mb-8 text-center tracking-tight">Registro Oficial</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required placeholder="Nombre" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="Apellido" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <select required className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}>
            <option value="">Seleccione su país</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input required type="tel" placeholder="WhatsApp (Con código de área)" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input required type="email" placeholder="Correo Electrónico" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input required type="password" placeholder="Define tu Contraseña" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <button type="submit" className="w-full py-5 bg-purple-600 hover:bg-purple-700 rounded-xl font-orbitron font-black text-lg shadow-xl uppercase tracking-widest transition-all">Enviar Solicitud</button>
        </form>
      </div>
      {showTerms && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="glass max-w-md w-full p-8 md:p-10 rounded-[2rem] text-center border border-purple-500/30">
            <AlertCircle size={48} className="text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-orbitron font-bold mb-4">Aviso Importante</h3>
            <p className="text-slate-300 mb-8 leading-relaxed">Al continuar, aceptas los términos de SpaceTramoya X. Serás redirigido a Gmail para completar el registro enviando el PDF generado.</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmRegistration} className="py-4 bg-purple-600 rounded-xl font-bold text-lg hover:bg-purple-700">Acepto y Continuar</button>
              <button onClick={() => setShowTerms(false)} className="py-4 bg-white/5 rounded-xl font-bold text-slate-400">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoginView: React.FC<{ users: User[]; onLoginSuccess: (user: User) => void; onHome: () => void }> = ({ users, onLoginSuccess, onHome }) => {
  const [userVal, setUserVal] = useState('');
  const [passVal, setPassVal] = useState('');
  const [error, setError] = useState('');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => (u.username === userVal || u.id === userVal || u.email === userVal) && u.password === passVal);
    if (user) {
      if (user.status !== 'active') return setError('Esta cuenta aún no ha sido activada por administración.');
      onLoginSuccess(user);
    } else setError('Credenciales inválidas o cuenta inexistente.');
  };
  return (
    <div className="max-w-md mx-auto p-4 sm:p-10 mt-10">
      <BackButton onClick={onHome} />
      <div className="glass rounded-[2.5rem] p-8 md:p-10 neon-border shadow-2xl">
        <div className="text-center mb-10">
          <LogIn size={48} className="text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-orbitron font-bold">Bienvenido</h2>
          <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase mt-2">SpaceTramoya Network</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-400 text-xs bg-red-400/10 p-4 rounded-xl border border-red-400/20 flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
          <div className="space-y-4">
            <input required placeholder="ID, Correo o Usuario" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={userVal} onChange={e => setUserVal(e.target.value)} />
            <input required type="password" placeholder="Contraseña" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={passVal} onChange={e => setPassVal(e.target.value)} />
          </div>
          <button className="w-full py-5 bg-purple-600 hover:bg-purple-700 rounded-xl font-orbitron font-black text-lg shadow-xl transition-all">Acceder</button>
        </form>
      </div>
    </div>
  );
};

const DashboardView: React.FC<{ user: User; users: User[]; transactions: Transaction[]; onNewTransaction: (tx: Transaction) => void }> = ({ user, users, transactions, onNewTransaction }) => {
  const [transferModal, setTransferModal] = useState(false);
  const [showRedirectionNotice, setShowRedirectionNotice] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [receiverCode, setReceiverCode] = useState('');
  const [recipient, setRecipient] = useState<User | null>(null);
  const [now, setNow] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeString = () => {
    const tz = COUNTRY_TIMEZONES[user.country] || undefined;
    try {
      return now.toLocaleTimeString('es-ES', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return now.toLocaleTimeString();
    }
  };

  const getDateString = () => {
    const tz = COUNTRY_TIMEZONES[user.country] || undefined;
    try {
      return now.toLocaleDateString('es-ES', { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return now.toLocaleDateString();
    }
  };

  useEffect(() => {
    const found = users.find(u => u.id === receiverCode.toUpperCase() && u.status === 'active' && u.id !== user.id);
    setRecipient(found || null);
  }, [receiverCode, users, user.id]);

  const initiateTransferRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > user.balance || !recipient || !reason) return;
    setShowRedirectionNotice(true);
  };

  const finalConfirmRedirection = () => {
    if (!recipient) return;
    const ref = generateReference();
    const newTx: Transaction = {
      id: 'TX-' + Math.random().toString(36).substr(2, 7).toUpperCase(),
      reference: ref,
      reason: reason,
      fromId: user.id, fromName: `${user.name} ${user.lastName}`,
      toId: recipient.id, toName: `${recipient.name} ${recipient.lastName}`, toCode: recipient.id,
      amount, status: 'pending', timestamp: Date.now()
    };
    onNewTransaction(newTx);
    const body = encodeURIComponent(`Solicitud Transferencia:\nReferencia: ${ref}\nMotivo: ${reason}\nEmisor: ${user.id}\nReceptor: ${recipient.id} (${recipient.name} ${recipient.lastName})\nMonto: ${amount} Nóvares\nSaldo disponible previo: ${user.balance}\nSaldo tras transferencia: ${user.balance - amount}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=Transferencia%20Novares%20${user.id}&body=${body}`, '_blank');
    setShowRedirectionNotice(false);
    setTransferModal(false);
    setAmount(0);
    setReason('');
    setReceiverCode('');
  };

  const filteredTransactions = transactions.filter(tx => {
    const isRelated = tx.fromId === user.id || tx.toId === user.id;
    if (!isRelated) return false;
    if (searchQuery.length > 0) {
      const suffix = tx.reference.slice(-4);
      return suffix.includes(searchQuery);
    }
    return true;
  });

  const remaining = user.balance - amount;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-10 space-y-8 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-3xl font-orbitron font-bold shadow-2xl">
            {user.name[0]}{user.lastName[0]}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white leading-none">{user.name} {user.lastName}</h2>
            <p className="text-slate-500 font-mono tracking-widest text-xs mt-2">{user.id} • MIEMBRO OFICIAL</p>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass rounded-[2rem] p-8 border border-white/10 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
          <h3 className="text-xl font-orbitron font-bold mb-6 flex items-center gap-3 text-purple-400"><ShieldCheck /> Credencial</h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase text-slate-500 font-black mb-1">País</p>
              <p className="font-bold text-white">{user.country}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase text-slate-500 font-black mb-1">Correo Electrónico</p>
              <p className="font-bold text-white text-xs break-all">{user.email}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-1">
               <div className="p-4 bg-purple-600/5 rounded-xl border border-purple-500/10 flex items-center gap-4">
                  <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400"><Calendar size={18} /></div>
                  <div>
                    <p className="text-[9px] uppercase text-slate-500 font-black">Fecha Local</p>
                    <p className="text-xs font-bold text-white capitalize">{getDateString()}</p>
                  </div>
               </div>
               <div className="p-4 bg-blue-600/5 rounded-xl border border-blue-500/10 flex items-center gap-4">
                  <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400"><Watch size={18} /></div>
                  <div>
                    <p className="text-[9px] uppercase text-slate-500 font-black">Hora Local</p>
                    <p className="text-xl font-black font-orbitron text-white tracking-tighter">{getTimeString()}</p>
                  </div>
               </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-1">
              <p className="text-[10px] uppercase text-slate-500 font-black mb-1">WhatsApp</p>
              <p className="font-bold text-white text-sm">{maskPhone(user.phone)}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] border border-white/20 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl"></div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-orbitron font-black text-white italic">SpaceTXBank</h3>
              <p className="text-purple-400 text-[9px] tracking-[0.2em] uppercase font-bold">Banca Digital Exclusiva</p>
            </div>
            <img src={LOGO_BANK} alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <div className="text-center mb-8">
            <span className="text-5xl font-orbitron font-black text-white tracking-tighter">{user.balance.toLocaleString()}</span>
            <span className="text-lg font-bold text-purple-400 ml-2">NÓV</span>
          </div>
          <button onClick={() => setTransferModal(true)} className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg">
            <Send size={20} /> TRANSFERIR NÓVARES
          </button>
        </div>

        <div className="glass rounded-[2rem] p-8 border border-white/10 flex flex-col h-[400px]">
          <h3 className="text-xl font-orbitron font-bold mb-6 flex items-center gap-3 text-blue-400"><Bell /> Notificaciones</h3>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {user.notifications.length === 0 ? <p className="text-slate-500 text-center mt-10 text-sm italic">Sin mensajes nuevos.</p> : 
              user.notifications.map(n => (
                <div key={n.id} className="relative">
                  {n.type === 'bonus' ? (
                    <div className="p-6 rounded-[1.5rem] border border-purple-500/30 overflow-hidden relative shadow-lg shadow-purple-500/10 group animate-in slide-in-from-right duration-500">
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <img src={BONUS_CARD_BG} alt="Bonus" className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#020617]/80 to-purple-600/20"></div>
                      </div>
                      <div className="relative z-10 space-y-3">
                         <div className="flex justify-between items-start">
                            <div className="p-2 bg-purple-600/20 rounded-xl text-purple-400"><Gift size={24} className="animate-bounce" /></div>
                            <Sparkles className="text-yellow-400" size={16} />
                         </div>
                         <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-purple-400 mb-1">¡HAS RECIBIDO UN BONO!</p>
                            <h4 className="text-lg font-orbitron font-black text-white">{n.bonusName}</h4>
                         </div>
                         <div className="flex items-end gap-2">
                            <span className="text-3xl font-orbitron font-black text-white">{n.amount?.toLocaleString()}</span>
                            <span className="text-xs font-bold text-purple-400 mb-1">NÓVARES</span>
                         </div>
                         <p className="text-[9px] text-slate-500 font-mono mt-2">{new Date(n.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                      <p className="text-[9px] text-slate-500 mt-2 font-mono">{new Date(n.timestamp).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-8 md:p-10 border border-white/10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className="text-2xl font-orbitron font-black flex items-center gap-3 text-yellow-400"><History /> Historial de Referencias</h3>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              placeholder="Buscar por últimos 4 dígitos de referencia..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-mono"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              maxLength={4}
            />
          </div>
        </div>
        <div className="grid gap-4">
          {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
            <div key={tx.id} className="glass rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-all group">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${tx.fromId === user.id ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {tx.fromId === user.id ? <LogOut size={16} /> : <LogIn size={16} />}
                   </div>
                   <p className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">REF: <span className="text-white font-bold">{tx.reference}</span></p>
                </div>
                <p className="text-xs text-slate-400">
                  {tx.fromId === user.id ? `A: ${tx.toName} (${tx.toCode})` : `DE: ${tx.fromName} (${tx.fromId})`}
                </p>
                <div className="flex items-center gap-2 text-[10px] bg-white/5 px-2 py-1 rounded w-fit">
                   <FileText size={12} className="text-purple-400" />
                   <span className="text-slate-300 italic">Motivo: {tx.reason}</span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className={`text-xl font-orbitron font-black ${tx.fromId === user.id ? 'text-red-400' : 'text-green-400'}`}>
                  {tx.fromId === user.id ? '-' : '+'}{tx.amount.toLocaleString()} NÓV
                </p>
                <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border mt-2 ${tx.status === 'approved' ? 'border-green-500/30 text-green-500' : tx.status === 'pending' ? 'border-yellow-500/30 text-yellow-500' : 'border-red-500/30 text-red-500'}`}>
                  {tx.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-slate-600 italic border-2 border-dashed border-white/5 rounded-3xl">
              No se encontraron transacciones{searchQuery ? ` con referencia terminada en "${searchQuery}"` : ''}.
            </div>
          )}
        </div>
      </div>

      {transferModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 z-[60]">
          {!showRedirectionNotice ? (
            <div className="glass max-w-md w-full p-8 md:p-10 rounded-[2.5rem] border border-white/10 relative">
              <h3 className="text-2xl font-orbitron font-bold mb-8 text-center text-yellow-400">Transferencia</h3>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] uppercase text-slate-500 font-black mb-1">Disponible</p>
                  <p className="text-sm font-bold text-white">{user.balance.toLocaleString()} NÓV</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] uppercase text-slate-500 font-black mb-1">Quedará</p>
                  <p className={`text-sm font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {remaining.toLocaleString()} NÓV
                  </p>
                </div>
              </div>
              <form onSubmit={initiateTransferRequest} className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-black mb-2 block ml-2">Monto a enviar</label>
                  <div className="relative">
                    <input type="number" required min="1" max={user.balance} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-2xl font-bold focus:ring-yellow-400 outline-none text-yellow-400" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">NÓV</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-black mb-2 block ml-2">ID Receptor</label>
                  <div className="relative">
                    <input required placeholder="STX-XXXXX" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 font-mono focus:ring-purple-500 outline-none uppercase pr-12" value={receiverCode} onChange={e => setReceiverCode(e.target.value.toUpperCase())} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {recipient ? <CheckCircle2 size={20} className="text-green-500" /> : <Search size={20} className="text-slate-600" />}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-black mb-2 block ml-2">Motivo de transferencia</label>
                  <textarea required rows={2} placeholder="Escribe el motivo..." className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-xs focus:ring-blue-500 outline-none transition-all resize-none" value={reason} onChange={e => setReason(e.target.value)} />
                </div>
                {receiverCode && !recipient && (
                  <p className="text-[10px] text-red-400 mt-2 ml-2 flex items-center gap-1 font-bold italic uppercase"><AlertCircle size={12} /> ID no registrado en el sistema</p>
                )}
                {recipient && (
                  <div className="mt-2 p-3 bg-green-500/5 border border-green-500/10 rounded-lg flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"><UserIcon size={14} className="text-green-500" /></div>
                    <p className="text-[11px] text-green-500 font-black uppercase tracking-wider">Destinatario: {recipient.name} {recipient.lastName}</p>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={amount <= 0 || amount > user.balance || !recipient || !reason} className="flex-1 py-4 bg-purple-600 rounded-xl font-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">Solicitar Envío</button>
                  <button type="button" onClick={() => { setTransferModal(false); setAmount(0); setReceiverCode(''); setReason(''); }} className="px-6 py-4 bg-white/5 rounded-xl text-slate-400 font-bold">Cerrar</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass max-w-md w-full p-8 md:p-10 rounded-[2.5rem] text-center border border-purple-500/30">
              <Mail size={56} className="text-purple-400 mx-auto mb-6 animate-pulse" />
              <h3 className="text-2xl font-orbitron font-bold mb-4">Aviso de Redirección</h3>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Estás siendo redirigido a <strong>Gmail</strong> para solicitar formalmente el permiso de esta transferencia por un monto de <span className="text-purple-400 font-bold">{amount.toLocaleString()} NÓV</span>. 
                <br/><br/>
                Para que el sistema procese tu solicitud, <strong>debes enviar el correo pre-llenado</strong> que se abrirá a continuación.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={finalConfirmRedirection} className="py-4 bg-purple-600 rounded-xl font-black text-lg hover:bg-purple-700 shadow-xl flex items-center justify-center gap-2">
                  <Send size={20} /> Entendido y Continuar
                </button>
                <button onClick={() => setShowRedirectionNotice(false)} className="py-4 bg-white/5 rounded-xl font-bold text-slate-400">Volver</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminView: React.FC<{ 
  state: AppState; 
  onUpdateState: (newState: AppState) => void;
  onLogout: () => void;
  onHome: () => void;
  onAddNotification: (uid: string, msg: string, options?: Partial<Notification>) => void;
}> = ({ state, onUpdateState, onLogout, onHome, onAddNotification }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [login, setLogin] = useState({ u: '', p: '', c: '' });
  const [tab, setTab] = useState<'users' | 'transfers' | 'bonuses'>('users');
  const [bonusForm, setBonusForm] = useState({ userId: '', name: '', amount: 0 });

  const handleIssueBonus = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = state.users.find(u => u.id === bonusForm.userId.toUpperCase());
    if (!targetUser) return alert('Usuario no encontrado.');
    if (bonusForm.amount <= 0) return alert('Monto inválido.');
    onAddNotification(targetUser.id, `Felicidades, has recibido el bono: ${bonusForm.name}`, {
      type: 'bonus',
      bonusName: bonusForm.name,
      amount: bonusForm.amount
    });
    onUpdateState({
      ...state,
      users: state.users.map(u => u.id === targetUser.id ? { ...u, balance: u.balance + bonusForm.amount } : u)
    });
    alert('Bono emitido y acreditado correctamente.');
    setBonusForm({ userId: '', name: '', amount: 0 });
  };

  if (!isAuth) return (
    <div className="max-w-md mx-auto p-10 mt-10">
      <BackButton onClick={onHome} />
      <div className="glass rounded-[2.5rem] p-10 border border-red-500/30 shadow-2xl">
        <div className="text-center mb-8">
          <ShieldCheck size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-orbitron font-black text-red-500 uppercase">Admin Terminal</h2>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          if (login.u === ADMIN_CREDENTIALS.username && login.p === ADMIN_CREDENTIALS.password && login.c === ADMIN_CREDENTIALS.securityCode) setIsAuth(true);
          else alert('Acceso de seguridad denegado.');
        }} className="space-y-6">
          <input required placeholder="Username" className="w-full bg-black/60 border border-white/10 rounded-xl p-4 outline-none transition-all focus:ring-2 focus:ring-red-600" value={login.u} onChange={e => setLogin({...login, u: e.target.value})} />
          <input required type="password" placeholder="Password" className="w-full bg-black/60 border border-white/10 rounded-xl p-4 outline-none transition-all focus:ring-2 focus:ring-red-600" value={login.p} onChange={e => setLogin({...login, p: e.target.value})} />
          <input required type="password" maxLength={6} placeholder="000000" className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-center text-3xl tracking-[0.5em] font-orbitron transition-all focus:ring-2 focus:ring-red-600" value={login.c} onChange={e => setLogin({...login, c: e.target.value})} />
          <button className="w-full py-5 bg-red-600 hover:bg-red-700 rounded-xl font-black shadow-xl uppercase">Acceder al Sistema</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
      <header className="flex flex-col lg:flex-row justify-between items-center bg-red-900/10 p-8 rounded-[2rem] border border-red-500/20 gap-6">
        <div>
          <h2 className="text-3xl font-orbitron font-black text-red-500 leading-none">MODO ADMINISTRADOR</h2>
          <p className="text-slate-500 text-xs font-bold uppercase mt-2 tracking-widest">Panel de Control L Alejandro</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={() => setTab('users')} className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tab === 'users' ? 'bg-red-600' : 'bg-white/5'}`}>Miembros</button>
          <button onClick={() => setTab('transfers')} className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tab === 'transfers' ? 'bg-red-600' : 'bg-white/5'}`}>Transferencias</button>
          <button onClick={() => setTab('bonuses')} className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tab === 'bonuses' ? 'bg-purple-600' : 'bg-white/5'}`}>Emitir Bonos</button>
          <button onClick={onLogout} className="px-5 py-2 bg-white/5 rounded-lg text-xs font-black uppercase tracking-widest border border-red-500/20">Salir</button>
        </div>
      </header>
      {tab === 'users' && (
        <div className="glass rounded-[2rem] p-8 md:p-10 border border-white/5 overflow-x-auto shadow-2xl">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-black">
                <th className="pb-6">Miembro</th>
                <th className="pb-6">Estado</th>
                <th className="pb-6">Accesos</th>
                <th className="pb-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {state.users.map(u => (
                <tr key={u.id} className="text-sm">
                  <td className="py-6">
                    <div className="font-bold text-white text-base">{u.name} {u.lastName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{u.id} • {u.country} • {maskPhone(u.phone)}</div>
                  </td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black border ${u.status === 'active' ? 'text-green-500 border-green-500/20' : 'text-yellow-500 border-yellow-500/20'}`}>{u.status}</span>
                  </td>
                  <td className="py-6">
                    {u.status === 'active' ? (
                      <div className="text-[10px] font-mono text-slate-300">
                        <span className="text-purple-400">U:</span> {u.username || u.id} <br/> 
                        <span className="text-purple-400">P:</span> {u.password}
                      </div>
                    ) : (
                      <div className="text-[10px] font-mono text-yellow-500/70">
                        <span className="text-purple-400">Clave sugerida:</span> {u.password}
                      </div>
                    )}
                  </td>
                  <td className="py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {u.status === 'pending' && (
                        <button onClick={() => {
                          onUpdateState({
                            ...state,
                            users: state.users.map(curr => curr.id === u.id ? { ...curr, status: 'active', username: curr.id } : curr)
                          });
                          onAddNotification(u.id, `¡Activado! Tu cuenta ha sido validada. Usa tu ID y la clave que elegiste para entrar.`);
                          alert('Miembro Activado correctamente.');
                        }} className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"><Check size={16} /></button>
                      )}
                      <button onClick={() => {
                        if (confirm("¿Eliminar miembro definitivamente?")) {
                          onUpdateState({ ...state, users: state.users.filter(curr => curr.id !== u.id) });
                        }
                      }} className="p-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'transfers' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass rounded-[2rem] p-8 md:p-10 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-orbitron font-bold mb-8 text-yellow-400">Solicitudes Pendientes</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {state.transactions.filter(t => t.status === 'pending').map(tx => (
                <div key={tx.id} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-500 font-black">REF: {tx.reference}</span>
                    <span className="text-xl font-black text-yellow-500 font-orbitron">{tx.amount.toLocaleString()} NÓV</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-xs space-y-1">
                      <p className="text-slate-500 uppercase font-black text-[9px]">Emisor</p>
                      <p className="text-white font-bold">{tx.fromName} ({tx.fromId})</p>
                    </div>
                    <div className="text-xs space-y-1 text-right">
                      <p className="text-slate-500 uppercase font-black text-[9px]">Receptor</p>
                      <p className="text-white font-bold">{tx.toCode}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-slate-500 uppercase font-black text-[9px] mb-1">Motivo</p>
                    <p className="text-xs italic text-slate-200">{tx.reason}</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => {
                      const from = state.users.find(u => u.id === tx.fromId);
                      const to = state.users.find(u => u.id === tx.toCode);
                      if (from && to && from.balance >= tx.amount) {
                        const newUsers = state.users.map(u => {
                          if (u.id === from.id) return { ...u, balance: u.balance - tx.amount };
                          if (u.id === to.id) return { ...u, balance: u.balance + tx.amount };
                          return u;
                        });
                        const newTransactions = state.transactions.map((t): Transaction => t.id === tx.id ? { ...t, status: 'approved', toName: `${to.name} ${to.lastName}` } : t);
                        onUpdateState({ ...state, users: newUsers, transactions: newTransactions });
                        onAddNotification(from.id, `Transferencia aprobada [REF:${tx.reference.slice(-4)}]: Enviaste ${tx.amount} a ${to.name}. Motivo: ${tx.reason}`);
                        onAddNotification(to.id, `Transferencia recibida [REF:${tx.reference.slice(-4)}]: ${from.name} te envió ${tx.amount}. Motivo: ${tx.reason}`);
                        alert('Transacción Procesada.');
                      } else alert('Error en IDs o Saldo Insuficiente.');
                    }} className="flex-1 py-3 bg-green-600 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg">Aprobar</button>
                    <button onClick={() => {
                      onUpdateState({
                        ...state,
                        transactions: state.transactions.map((t): Transaction => t.id === tx.id ? { ...t, status: 'rejected' } : t)
                      });
                    }} className="p-3 bg-red-600/20 text-red-500 rounded-xl border border-red-500/20"><XCircle size={20} /></button>
                  </div>
                </div>
              ))}
              {state.transactions.filter(t => t.status === 'pending').length === 0 && (
                <p className="text-center text-slate-600 italic py-10">Sin solicitudes de transferencia.</p>
              )}
            </div>
          </div>
          <div className="glass rounded-[2rem] p-8 md:p-10 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-orbitron font-bold mb-8 text-blue-400">Ajuste de Saldo Manual</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-black mb-2 block ml-2">ID Miembro</label>
                <input id="ov_id" placeholder="STX-XXXXX" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none uppercase font-mono transition-all focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-black mb-2 block ml-2">Nuevo Saldo</label>
                <input id="ov_amt" type="number" placeholder="0" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none font-orbitron transition-all focus:ring-2 focus:ring-blue-600" />
              </div>
              <button onClick={() => {
                const id = (document.getElementById('ov_id') as HTMLInputElement).value.toUpperCase();
                const amt = Number((document.getElementById('ov_amt') as HTMLInputElement).value);
                const member = state.users.find(u => u.id === id);
                if (!member) return alert('Miembro no encontrado.');
                onUpdateState({
                  ...state,
                  users: state.users.map(u => u.id === id ? { ...u, balance: amt } : u)
                });
                onAddNotification(id, `Tu saldo ha sido actualizado manualmente por el sistema central a ${amt} Nóvares.`);
                alert('Saldo sincronizado con éxito.');
              }} className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-xl font-black uppercase tracking-widest shadow-xl transition-all">Sincronizar Datos</button>
            </div>
          </div>
        </div>
      )}
      {tab === 'bonuses' && (
        <div className="max-w-2xl mx-auto glass rounded-[2.5rem] p-8 md:p-10 border border-purple-500/30 shadow-2xl shadow-purple-500/10">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-purple-600/20 rounded-2xl text-purple-400"><Gift size={32} /></div>
              <div>
                <h3 className="text-2xl font-orbitron font-black text-purple-400">Sistema de Bonos</h3>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Emisión de tarjetas especiales</p>
              </div>
           </div>
           <form onSubmit={handleIssueBonus} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-black mb-2 block ml-2">ID del Miembro</label>
                <input required placeholder="STX-XXXXX" className="w-full bg-black/60 border border-white/10 rounded-xl p-4 outline-none uppercase font-mono transition-all focus:ring-2 focus:ring-purple-600" value={bonusForm.userId} onChange={e => setBonusForm({...bonusForm, userId: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-black mb-2 block ml-2">Nombre del Bono</label>
                <input required placeholder="Nombre atractivo para el bono" className="w-full bg-black/60 border border-white/10 rounded-xl p-4 outline-none transition-all focus:ring-2 focus:ring-purple-600" value={bonusForm.name} onChange={e => setBonusForm({...bonusForm, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-black mb-2 block ml-2">Monto en Nóvares</label>
                <input required type="number" placeholder="0" className="w-full bg-black/60 border border-white/10 rounded-xl p-4 outline-none font-orbitron transition-all focus:ring-2 focus:ring-purple-600" value={bonusForm.amount || ''} onChange={e => setBonusForm({...bonusForm, amount: Number(e.target.value)})} />
              </div>
              <div className="pt-4">
                 <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3">
                    <Sparkles size={20} /> Emitir y Acreditar Bono
                 </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('STX_SYSTEM_V12');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading saved state", e);
    }
    
    const luisAlejandro: User = {
      id: '0001',
      name: 'Luis',
      lastName: 'Alejandro',
      country: 'Venezuela',
      phone: '584121351217',
      email: 'mgsvof@gmail.com',
      password: 'v9451679',
      status: 'active',
      balance: 10000,
      registeredAt: Date.now(),
      notifications: [
        { id: 'welcome', message: '¡Bienvenido Luis Alejandro! Eres el miembro fundador #0001 de SpaceTramoya X.', timestamp: Date.now(), read: false }
      ]
    };

    const missSlam: User = {
      id: '0002',
      name: 'Miss',
      lastName: 'Slam',
      country: 'El Salvador',
      phone: '50375431210',
      email: 'missslam@tramoyax.com',
      password: 'missslam0121',
      status: 'active',
      balance: 2500,
      registeredAt: Date.now(),
      notifications: [
        { id: 'welcome-ms', message: '¡Bienvenida Miss Slam a la familia SpaceTramoya X!', timestamp: Date.now(), read: false }
      ]
    };

    const alexAleman: User = {
      id: '0003',
      name: 'Alex',
      lastName: 'Alemán',
      country: 'Honduras',
      phone: '504 89887690',
      email: 'alex0003@tramoyax.com',
      password: 'Copito.504',
      status: 'active',
      balance: 1200,
      registeredAt: Date.now(),
      notifications: [
        { id: 'welcome-alex', message: '¡Bienvenido Alex Alemán a la familia SpaceTramoya X!', timestamp: Date.now(), read: false }
      ]
    };

    return { 
      users: [luisAlejandro, missSlam, alexAleman], 
      transactions: [], 
      currentUser: null, 
      isAdmin: false 
    };
  });

  const [view, setView] = useState<'home' | 'register' | 'login' | 'dashboard' | 'admin' | 'registration-pending'>('home');
  const [isTimeValid, setIsTimeValid] = useState(true);

  useEffect(() => {
    localStorage.setItem('STX_SYSTEM_V12', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = OPEN_TIME.hour * 60 + OPEN_TIME.minute;
      const endMinutes = CLOSE_TIME.hour * 60 + CLOSE_TIME.minute;
      setIsTimeValid(currentMinutes >= startMinutes && currentMinutes <= endMinutes);
    };
    checkTime();
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null, isAdmin: false }));
    setView('home');
  };

  const addNotification = (userId: string, message: string, options?: Partial<Notification>) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message: message,
      timestamp: Date.now(),
      read: false,
      ...options
    };
    setState(prev => {
      const updatedUsers = prev.users.map(u => u.id === userId ? { ...u, notifications: [newNotif, ...u.notifications] } : u);
      const updatedCurrentUser = prev.currentUser?.id === userId ? { ...prev.currentUser, notifications: [newNotif, ...prev.currentUser.notifications] } : prev.currentUser;
      return { ...prev, users: updatedUsers, currentUser: updatedCurrentUser };
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden font-rajdhani">
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[180px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[180px] rounded-full pointer-events-none"></div>
      
      <Nav 
        onHome={() => setView('home')} 
        onLogin={() => setView('login')} 
        onRegister={() => setView('register')} 
        onLogout={handleLogout}
        currentUser={state.currentUser}
        isAdmin={state.isAdmin}
      />

      <main className="relative z-10 custom-scrollbar overflow-y-auto pb-10">
        {view === 'home' && (
          <HomeComponent onRegister={() => setView('register')} onLogin={() => setView('login')} onAdmin={() => setView('admin')} />
        )}
        {view === 'register' && (
          <RegisterView isTimeValid={isTimeValid} onHome={() => setView('home')} onRegister={(newUser) => {
            setState(prev => ({ ...prev, users: [...prev.users, newUser] }));
            setView('registration-pending');
          }} />
        )}
        {view === 'registration-pending' && (
          <div className="max-w-2xl mx-auto mt-20 p-10 md:p-12 glass rounded-[2.5rem] text-center border border-green-500/20 shadow-2xl">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-8 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">Solicitud Enviada</h2>
            <div className="space-y-4 text-slate-300 text-lg">
              <p>Tu proceso de inscripción está en curso.</p>
              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                <p className="text-sm font-medium">Nuestro equipo procesará tu activación manual pronto.</p>
              </div>
            </div>
            <button onClick={() => setView('home')} className="mt-10 px-10 py-4 bg-purple-600 rounded-xl font-bold shadow-xl hover:scale-105 transition-all">Regresar</button>
          </div>
        )}
        {view === 'login' && (
          <LoginView users={state.users} onLoginSuccess={(user) => {
            setState(prev => ({ ...prev, currentUser: user }));
            setView('dashboard');
          }} onHome={() => setView('home')} />
        )}
        {view === 'dashboard' && state.currentUser && (
          <DashboardView user={state.currentUser} users={state.users} transactions={state.transactions} onNewTransaction={(tx) => setState(prev => ({ ...prev, transactions: [tx, ...prev.transactions] }))} />
        )}
        {view === 'admin' && (
          <AdminView state={state} onUpdateState={(newState) => setState(newState)} onLogout={handleLogout} onHome={() => setView('home')} onAddNotification={addNotification} />
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
