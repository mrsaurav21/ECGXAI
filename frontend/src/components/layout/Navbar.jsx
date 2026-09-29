import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Activity, LogOut, ShieldCheck, Heart, Stethoscope, UploadCloud, FileText, Home, User, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#ADBBDA]/60 sticky top-0 z-40 px-4 sm:px-6 py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2.5 bg-[#EDE8F5] border border-[#7091E6]/40 rounded-xl group-hover:border-[#7091E6] transition-colors shadow-xs">
            <Activity className="w-5 h-5 text-[#3D52A0]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#3D52A0]">
              ECG<span className="text-[#7091E6]">-XAI</span>
            </span>
            <span className="text-[11px] block font-semibold text-[#8697C4] uppercase font-mono tracking-wider">
              Clinical Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation Based on Role */}
        <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE8F5]/60 border border-[#ADBBDA]/50 text-xs font-bold text-[#8697C4]">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              isActive('/') ? 'bg-[#7091E6] text-white shadow-xs' : 'hover:text-[#3D52A0]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            to="/about"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              isActive('/about') ? 'bg-[#7091E6] text-white shadow-xs' : 'hover:text-[#3D52A0]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>About</span>
          </Link>

          {user ? (
            <>
              {/* Doctor Console (Doctors Only) */}
              {(user.role === 'doctor' || user.role === 'admin') && (
                <Link
                  to="/doctor"
                  className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    isActive('/doctor') ? 'bg-[#3D52A0] text-white shadow-xs' : 'hover:text-[#3D52A0]'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor Console</span>
                </Link>
              )}

              {/* Patient Portal & Prediction (Patients Only) */}
              {(user.role === 'patient' || user.role === 'admin') && (
                <>
                  <Link
                    to="/patient"
                    className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                      isActive('/patient') ? 'bg-[#3D52A0] text-white shadow-xs' : 'hover:text-[#3D52A0]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Patient Portal</span>
                  </Link>

                  <Link
                    to="/predict"
                    className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                      isActive('/predict') ? 'bg-[#7091E6] text-white shadow-xs' : 'hover:text-[#3D52A0]'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Prediction</span>
                  </Link>
                </>
              )}

              <Link
                to="/history"
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive('/history') ? 'bg-[#3D52A0] text-white shadow-xs' : 'hover:text-[#3D52A0]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>History</span>
              </Link>

              <Link
                to="/profile"
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive('/profile') ? 'bg-[#3D52A0] text-white shadow-xs' : 'hover:text-[#3D52A0]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <Link
              to="/predict"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              className="px-3.5 py-1.5 rounded-full hover:text-[#3D52A0] transition-colors flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Prediction (Login Required)</span>
            </Link>
          )}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-[#3D52A0] flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7091E6]" />
                  {user.full_name}
                </span>
                <span className="text-[10px] text-[#8697C4] font-medium capitalize font-mono">
                  {user.role}
                </span>
              </div>

              <div className="h-6 w-[1px] bg-[#ADBBDA]/60 hidden sm:block" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 text-[#3D52A0] border border-[#ADBBDA]/60 text-xs font-bold shadow-xs transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 text-[#8697C4]" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 text-[#3D52A0] text-xs font-bold border border-[#ADBBDA]/60 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-[#7091E6] hover:bg-[#5a7ddb] text-white text-xs font-bold shadow-xs transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}