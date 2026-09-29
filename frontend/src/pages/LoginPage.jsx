import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, loginWithGoogle } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setAuth(data.user, data.access_token);

      if (data.user.is_onboarded === false) {
        navigate('/complete-profile');
      } else if (data.user.role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clinical-darkest flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-clinical-base border border-clinical-panel rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-clinical-panel border border-clinical-accent/30 rounded-xl mb-3">
            <Activity className="w-8 h-8 text-clinical-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-clinical-light">
            ECG<span className="text-clinical-accent">-XAI</span> Portal
          </h1>
          <p className="text-sm text-clinical-muted mt-1">
            Clinical Cardiology & Explainable AI Workstation
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-clinical-danger/15 border border-clinical-danger/30 rounded-lg flex items-center gap-2.5 text-clinical-danger text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-clinical-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.org"
                className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 pl-10 pr-4 text-clinical-light placeholder-clinical-muted/50 focus:outline-none focus:border-clinical-accent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-clinical-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 pl-10 pr-4 text-clinical-light placeholder-clinical-muted/50 focus:outline-none focus:border-clinical-accent text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-clinical-accent hover:bg-clinical-accent/90 disabled:opacity-60 text-clinical-darkest font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <div className="w-full border-t border-clinical-panel" />
          <span className="px-3 text-xs text-clinical-muted uppercase">Or</span>
          <div className="w-full border-t border-clinical-panel" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            theme="filled_black"
            shape="rectangular"
            onSuccess={async (credentialResponse) => {
              try {
                const data = await loginWithGoogle(credentialResponse.credential);
                setAuth(data.user, data.access_token);
                if (data.user.is_onboarded === false) {
                  navigate('/complete-profile');
                } else {
                  navigate(data.user.role === 'doctor' ? '/doctor' : '/patient');
                }
              } catch (err) {
                setError('Google sign-in failed on server.');
              }
            }}
            onError={() => setError('Google sign-in failed.')}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-clinical-panel text-center">
          <p className="text-sm text-clinical-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-clinical-accent hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}