import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Input from './Input';
import Button from './Button';
import { Kanban, AlertCircle } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { login, register, authError, isAuthLoading } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Kanban size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? 'Enter your credentials to access your projects' : 'Start managing your tasks effectively'}
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            isLoading={isAuthLoading}
            className="mt-2"
          >
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;