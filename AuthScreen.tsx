import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User as UserIcon, Phone, MapPin, Image as ImageIcon, Scale } from 'lucide-react';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState('');
  
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email.includes('@') && password.length >= 6) {
        onLogin({
          email,
          name: name || email.split('@')[0],
          phone_number: phone,
          address: address,
          profile_picture_url: profilePic
        });
      } else {
        setError('Please enter a valid email and a password of at least 6 characters.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Brand & Aesthetic */}
      <div className="hidden lg:flex lg:w-1/2 bg-lense-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-lense-300 via-lense-900 to-black"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 border border-lense-gold/50 flex items-center justify-center rounded-none transform rotate-45">
                 <div className="w-8 h-8 bg-lense-gold/20 transform -rotate-45 flex items-center justify-center">
                    <Scale size={18} className="text-lense-gold" />
                 </div>
             </div>
             <span className="text-2xl font-serif font-bold tracking-wider">Legal Lense</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
           <h1 className="text-5xl font-serif font-medium leading-tight mb-6">
             See the law <br/>
             <span className="text-lense-gold italic">clearly.</span>
           </h1>
           <p className="text-lense-300 text-lg font-light leading-relaxed border-l border-lense-gold/30 pl-6">
             An intelligent workspace designed to analyze complex scenarios, retrieve verified IPC codes, and provide grounded legal insights instantly.
           </p>
        </div>

        <div className="relative z-10 text-xs text-lense-500 font-mono">
           © 2024 LEGAL LENSE AI SYSTEMS. ESTABLISHED FOR JUSTICE.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-lense-50 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           {/* Mobile Header */}
           <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
              <Scale size={24} className="text-lense-900" />
              <span className="text-xl font-serif font-bold text-lense-900">Legal Lense</span>
           </div>

           <div className="mb-8">
             <h2 className="text-3xl font-serif text-lense-900 mb-2">
               {isLogin ? 'Access your workspace' : 'Begin your journey'}
             </h2>
             <p className="text-sm text-gray-500">
               {isLogin ? 'Securely log in to continue your research.' : 'Create an account to access the IPC database.'}
             </p>
           </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-4 animate-fadeIn">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border-b-2 border-gray-200 focus:border-lense-900 px-3 py-2.5 outline-none transition-colors"
                            placeholder="Aditi Sharma"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white border-b-2 border-gray-200 focus:border-lense-900 px-3 py-2.5 outline-none transition-colors"
                            placeholder="+91..."
                        />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-lense-900 px-3 py-2.5 outline-none transition-colors"
                        placeholder="City, State"
                    />
                </div>
                 <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Profile URL (Opt)</label>
                    <input
                        type="url"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-lense-900 px-3 py-2.5 outline-none transition-colors"
                    />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-none pl-10 pr-4 py-3 focus:ring-1 focus:ring-lense-900 focus:border-lense-900 outline-none"
                        placeholder="attorney@law.com"
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-none pl-10 pr-4 py-3 focus:ring-1 focus:ring-lense-900 focus:border-lense-900 outline-none"
                        placeholder="••••••••"
                    />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-xs font-mono p-3 bg-red-50 border-l-2 border-red-500">
                ERROR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 border border-transparent text-sm font-bold text-white bg-lense-900 hover:bg-black transition-all uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                {loading ? 'Authenticating...' : (isLogin ? 'Enter System' : 'Create ID')}
                {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-500 hover:text-lense-900 font-medium underline underline-offset-4 decoration-lense-gold/50"
            >
              {isLogin ? "Need a new account? Register" : "Already have credentials? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};