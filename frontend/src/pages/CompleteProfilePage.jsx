import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Building, FileText, ArrowRight, AlertCircle, Loader2, Stethoscope, User } from 'lucide-react';
import { completeProfile } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export default function CompleteProfilePage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [role, setRole] = useState('doctor');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [mrn, setMrn] = useState('');
  const [dob, setDob] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      role,
      doctor_profile: role === 'doctor' ? {
        specialization,
        hospital_affiliation: hospitalAffiliation,
        license_number: licenseNumber
      } : null,
      patient_profile: role === 'patient' ? {
        mrn,
        dob
      } : null,
    };

    try {
      const updatedUser = await completeProfile(payload);
      updateUser(updatedUser);
      navigate(updatedUser.role === 'doctor' ? '/doctor' : '/patient');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE8F5] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-[#ADBBDA] rounded-3xl shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-[#EDE8F5] border border-[#7091E6]/40 rounded-2xl mb-3 shadow-xs">
            <Activity className="w-8 h-8 text-[#3D52A0]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#3D52A0]">
            Complete Your Profile
          </h1>
          <p className="text-xs text-[#8697C4] mt-1 font-medium">
            Welcome, {user?.full_name || 'Cardiology User'}. Choose your portal access.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-[#E04858]/10 border border-[#E04858]/30 rounded-2xl flex items-center gap-2.5 text-[#E04858] text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-[#EDE8F5]/60 rounded-2xl border border-[#ADBBDA]/60">
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'doctor'
                ? 'bg-[#7091E6] text-white shadow-xs'
                : 'text-[#8697C4] hover:text-[#3D52A0]'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Physician / Doctor</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'patient'
                ? 'bg-[#7091E6] text-white shadow-xs'
                : 'text-[#8697C4] hover:text-[#3D52A0]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patient Portal</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'doctor' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                    Specialization
                  </label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 px-3.5 text-[#3D52A0] text-xs focus:outline-none focus:border-[#7091E6] shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                    License / NPI Number
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="MED-123456"
                    className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 px-3.5 text-[#3D52A0] text-xs focus:outline-none focus:border-[#7091E6] shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                  Hospital Affiliation
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8697C4]" />
                  <input
                    type="text"
                    required
                    value={hospitalAffiliation}
                    onChange={(e) => setHospitalAffiliation(e.target.value)}
                    placeholder="e.g. TIMSCDR Heart Institute"
                    className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 pl-10 pr-3.5 text-[#3D52A0] text-xs focus:outline-none focus:border-[#7091E6] shadow-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                    Medical Record # (MRN)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8697C4]" />
                    <input
                      type="text"
                      required
                      value={mrn}
                      onChange={(e) => setMrn(e.target.value)}
                      placeholder="MRN-88492"
                      className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 pl-10 pr-3.5 text-[#3D52A0] text-xs focus:outline-none focus:border-[#7091E6] shadow-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 px-3.5 text-[#3D52A0] text-xs focus:outline-none focus:border-[#7091E6] shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 px-4 bg-[#7091E6] hover:bg-[#5e82dc] disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <span>Save Profile & Enter Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}