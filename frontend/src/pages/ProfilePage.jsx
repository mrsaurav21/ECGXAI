import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Mail, Award, Stethoscope, CheckCircle2, Loader2, Edit3, X, Save } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getAvailableDoctors, assignDoctorToPatient } from '../api/ecg';
import { completeProfile } from '../api/auth';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const isDoctor = user?.role === 'doctor';

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [isUpdatingDoctor, setIsUpdatingDoctor] = useState(false);
  const [doctorSuccess, setDoctorSuccess] = useState('');

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [specialization, setSpecialization] = useState(user?.doctor_profile?.specialization || 'Cardiology');
  const [licenseNumber, setLicenseNumber] = useState(user?.doctor_profile?.license_number || '');
  const [hospitalAffiliation, setHospitalAffiliation] = useState(user?.doctor_profile?.hospital_affiliation || '');
  const [mrn, setMrn] = useState(user?.patient_profile?.mrn || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    async function loadDoctors() {
      if (!isDoctor) {
        try {
          const docs = await getAvailableDoctors();
          setDoctors(docs || []);
        } catch (err) {
          console.error('Failed to fetch available doctors:', err);
        }
      }
    }
    loadDoctors();
  }, [isDoctor]);

  const handleAssignDoctor = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) return;

    setIsUpdatingDoctor(true);
    setDoctorSuccess('');

    try {
      const updated = await assignDoctorToPatient(selectedDoctorId);
      updateUser(updated);
      setDoctorSuccess('Attending physician successfully updated!');
    } catch (err) {
      console.error('Failed to assign doctor:', err);
    } finally {
      setIsUpdatingDoctor(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setIsSavingProfile(true);

    const payload = {
      full_name: fullName,
      role: user?.role,
      doctor_profile: isDoctor ? {
        specialization,
        license_number: licenseNumber,
        hospital_affiliation: hospitalAffiliation
      } : null,
      patient_profile: !isDoctor ? {
        mrn,
        dob: user?.patient_profile?.dob || '2000-01-01'
      } : null,
    };

    try {
      const updated = await completeProfile(payload);
      updateUser(updated);
      setIsEditing(false);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setProfileError(typeof detail === 'string' ? detail : 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      
      {/* Banner */}
      <div className="bg-white border border-[#ADBBDA] rounded-3xl p-8 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#EDE8F5] to-transparent opacity-60 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#3D52A0] to-[#7091E6] flex items-center justify-center text-white text-2xl font-black shadow-md">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE8F5] text-[#3D52A0] text-xs font-bold border border-[#ADBBDA]/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7091E6]" />
                <span className="capitalize">{user?.role || 'User'} Profile</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#3D52A0] tracking-tight">
                {user?.full_name || 'Account Profile'}
              </h1>

              <p className="text-xs text-[#8697C4] font-mono flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || 'user@ecgxai.clinical'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 text-[#3D52A0] border border-[#ADBBDA]/60 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Form or View Grid */}
      {isEditing ? (
        <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#7091E6]" />
            <span>Edit Account Details</span>
          </h2>

          {profileError && (
            <div className="p-3 bg-[#E04858]/10 border border-[#E04858]/30 rounded-xl text-xs text-[#E04858]">
              {profileError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#3D52A0] uppercase mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 px-3 text-[#3D52A0]"
              />
            </div>

            {isDoctor ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3D52A0] uppercase mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 px-3 text-[#3D52A0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#3D52A0] uppercase mb-1">License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 px-3 text-[#3D52A0]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#3D52A0] uppercase mb-1">Hospital Affiliation</label>
                  <input
                    type="text"
                    required
                    value={hospitalAffiliation}
                    onChange={(e) => setHospitalAffiliation(e.target.value)}
                    className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 px-3 text-[#3D52A0]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-[#3D52A0] uppercase mb-1">Medical Record Number (MRN)</label>
                <input
                  type="text"
                  required
                  value={mrn}
                  onChange={(e) => setMrn(e.target.value)}
                  className="w-full bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-xl py-2.5 px-3 text-[#3D52A0]"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2.5 rounded-xl bg-[#7091E6] hover:bg-[#5a7ddb] text-white font-bold flex items-center gap-2"
              >
                {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#7091E6]" />
                <span>Account Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/50 space-y-1">
                  <span className="text-[#8697C4] uppercase font-semibold text-[10px]">Full Legal Name</span>
                  <div className="font-bold text-[#3D52A0] text-sm">{user?.full_name || 'Not Provided'}</div>
                </div>

                <div className="p-4 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/50 space-y-1">
                  <span className="text-[#8697C4] uppercase font-semibold text-[10px]">Access Role</span>
                  <div className="font-bold text-[#3D52A0] text-sm capitalize">{user?.role || 'Standard'}</div>
                </div>

                {isDoctor ? (
                  <>
                    <div className="p-4 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/50 space-y-1">
                      <span className="text-[#8697C4] uppercase font-semibold text-[10px]">Specialization</span>
                      <div className="font-bold text-[#3D52A0] text-sm">
                        {user?.doctor_profile?.specialization || 'Clinical Cardiology'}
                      </div>
                    </div>

                    <div className="p-4 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/50 space-y-1">
                      <span className="text-[#8697C4] uppercase font-semibold text-[10px]">License Number</span>
                      <div className="font-bold text-[#3D52A0] text-sm font-mono">
                        {user?.doctor_profile?.license_number || 'MED-Pending'}
                      </div>
                    </div>

                    <div className="sm:col-span-2 p-4 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/50 space-y-1">
                      <span className="text-[#8697C4] uppercase font-semibold text-[10px]">Hospital Affiliation</span>
                      <div className="font-bold text-[#3D52A0] text-sm">
                        {user?.doctor_profile?.hospital_affiliation || 'Not Provided'}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/50 space-y-1">
                      <span className="text-[#8697C4] uppercase font-semibold text-[10px]">Medical Record Number (MRN)</span>
                      <div className="font-bold text-[#3D52A0] text-sm font-mono">
                        {user?.patient_profile?.mrn || 'MRN-884920'}
                      </div>
                    </div>

                    <div className="p-4 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/50 space-y-1">
                      <span className="text-[#8697C4] uppercase font-semibold text-[10px]">Assigned Physician</span>
                      <div className="font-bold text-[#3D52A0] text-sm">
                        {user?.patient_profile?.assigned_doctor_name || 'None Selected (Private)'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Patient Doctor Selection Section */}
            {!isDoctor && (
              <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#7091E6]" />
                  <span>Select Attending Physician (Optional)</span>
                </h2>
                <p className="text-xs text-[#8697C4]">
                  Choose a registered cardiologist to grant them access to inspect your ECG telemetry reports and audit history.
                </p>

                {doctorSuccess && (
                  <div className="p-3 bg-[#2E9F6E]/10 border border-[#2E9F6E]/30 rounded-xl text-xs text-[#2E9F6E] flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{doctorSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleAssignDoctor} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="flex-1 bg-[#EDE8F5]/40 border border-[#ADBBDA] rounded-xl py-2.5 px-3 text-xs text-[#3D52A0] focus:outline-none"
                  >
                    <option value="">-- Choose a Doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id || doc._id} value={doc.id || doc._id}>
                        Dr. {doc.full_name} ({doc.doctor_profile?.specialization || 'Cardiology'})
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={!selectedDoctorId || isUpdatingDoctor}
                    className="px-5 py-2.5 bg-[#7091E6] hover:bg-[#5a7ddb] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUpdatingDoctor ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Doctor</span>}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Security Box */}
          <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 shadow-xs space-y-5">
            <h2 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#2E9F6E]" />
              <span>Security & Compliance</span>
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#2E9F6E]/10 border border-[#2E9F6E]/30 rounded-2xl text-[11px] text-[#2E9F6E] font-medium flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>HIPAA & GDPR Encrypted Session</span>
              </div>

              <div className="p-3.5 bg-[#EDE8F5]/50 border border-[#ADBBDA]/60 rounded-2xl text-xs space-y-1">
                <div className="text-[10px] text-[#8697C4] uppercase font-bold">Authentication</div>
                <div className="font-bold text-[#3D52A0]">Secure JWT Token</div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}