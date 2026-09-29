import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Mail, Lock, User, Building, FileText, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { registerUser } from '../api/auth';

export default function RegisterPage() {
  const [role, setRole] = useState('doctor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Doctor profile fields
  const [specialization, setSpecialization] = useState('Cardiology');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  // Patient profile fields
  const [mrn, setMrn] = useState('');
  const [dob, setDob] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      email: email.trim().toLowerCase(),
      password,
      full_name: fullName.trim(),
      role,
      doctor_profile: role === 'doctor' ? {
        specialization: specialization.trim(),
        hospital_affiliation: hospitalAffiliation.trim(),
        license_number: licenseNumber.trim(),
      } : null,
      patient_profile: role === 'patient' ? {
        mrn: mrn.trim(),
        dob,
      } : null,
    };

    try {
      await registerUser(payload);
      navigate('/verify-otp', { state: { email: payload.email } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(', '));
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Registration failed. Please check your credentials or network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clinical-darkest flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-clinical-base border border-clinical-panel rounded-xl shadow-2xl p-8 my-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-clinical-panel border border-clinical-accent/30 rounded-xl mb-3">
            <Activity className="w-8 h-8 text-clinical-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-clinical-light">
            Create Clinical Account
          </h1>
          <p className="text-sm text-clinical-muted mt-1">
            Join the ECG-XAI diagnostic & monitoring network
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-clinical-danger/15 border border-clinical-danger/30 rounded-lg flex items-center gap-2.5 text-clinical-danger text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex bg-clinical-darkest p-1 rounded-lg border border-clinical-panel mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange('doctor')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              role === 'doctor'
                ? 'bg-clinical-accent text-clinical-darkest shadow-md'
                : 'text-clinical-muted hover:text-clinical-light'
            }`}
          >
            Physician / Cardiologist
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('patient')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              role === 'patient'
                ? 'bg-clinical-accent text-clinical-darkest shadow-md'
                : 'text-clinical-muted hover:text-clinical-light'
            }`}
          >
            Patient Portal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-clinical-muted pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Eleanor Vance / Jane Doe"
                className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 pl-10 pr-4 text-clinical-light placeholder-clinical-muted/50 focus:outline-none focus:border-clinical-accent text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
                Work / Personal Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-clinical-muted pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.org"
                  className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 pl-10 pr-4 text-clinical-light placeholder-clinical-muted/50 focus:outline-none focus:border-clinical-accent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-clinical-muted pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 pl-10 pr-4 text-clinical-light placeholder-clinical-muted/50 focus:outline-none focus:border-clinical-accent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Role-Specific Form Fields */}
          {role === 'doctor' ? (
            <div className="space-y-4 pt-2 border-t border-clinical-panel">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
                    Specialization
                  </label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Cardiology / Electrophysiology"
                    className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 px-4 text-clinical-light text-sm focus:outline-none focus:border-clinical-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
                    License / NPI Number
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="MED-123456"
                    className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 px-4 text-clinical-light text-sm focus:outline-none focus:border-clinical-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
                  Hospital Affiliation
                </label>
                <div className="relative">
                  <Building className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-clinical-muted pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={hospitalAffiliation}
                    onChange={(e) => setHospitalAffiliation(e.target.value)}
                    placeholder="City Heart Institute"
                    className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 pl-10 pr-4 text-clinical-light text-sm focus:outline-none focus:border-clinical-accent"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-clinical-panel">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
                    Medical Record # (MRN)
                  </label>
                  <div className="relative">
                    <FileText className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-clinical-muted pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={mrn}
                      onChange={(e) => setMrn(e.target.value)}
                      placeholder="MRN-88492"
                      className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 pl-10 pr-4 text-clinical-light text-sm focus:outline-none focus:border-clinical-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2.5 px-4 text-clinical-light text-sm focus:outline-none focus:border-clinical-accent"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 px-4 bg-clinical-accent hover:bg-clinical-accent/90 disabled:opacity-60 text-clinical-darkest font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register & Request OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-clinical-panel text-center">
          <p className="text-sm text-clinical-muted">
            Already registered?{' '}
            <Link to="/login" className="text-clinical-accent hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}