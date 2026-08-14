import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import AuthCard from '../../components/auth/AuthCard';
import { AuthIllustrationReset } from '../../components/auth/AuthIllustrations';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const pwd = watch('password', '');

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, { password });
      localStorage.setItem('oh2_token', data.token);
      localStorage.setItem('oh2_user', JSON.stringify(data.user));
      dispatch(setUser(data.user));
      setDone(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate(`/${data.user.role}/dashboard`), 1800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard illustration={<AuthIllustrationReset />} maxWidth="max-w-4xl">
      <div className="max-w-md">
        {!done ? (
          <>
            {/* Heading & Subtitle matching Reference Image */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-display tracking-wide">
              Reset Password
            </h1>
            <p className="text-blue-100/90 text-sm sm:text-base mb-8 font-normal leading-relaxed">
              Create a new password for your account.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className={`auth-form-input pl-12 pr-12 ${errors.password ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'New password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-none cursor-pointer text-[#64748B] hover:text-[#0F172A]"
                  >
                    {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-1 rounded-lg border border-red-500/30">
                    ⚠️ {errors.password.message}
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className={`auth-form-input pl-12 pr-12 ${errors.confirm ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                    placeholder="••••••••"
                    {...register('confirm', {
                      required: 'Please confirm your new password',
                      validate: (v) => v === pwd || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-none cursor-pointer text-[#64748B] hover:text-[#0F172A]"
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.confirm && (
                  <div className="text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-1 rounded-lg border border-red-500/30">
                    ⚠️ {errors.confirm.message}
                  </div>
                )}
              </div>

              {/* Mint Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="auth-btn-mint mt-4"
              >
                {loading ? (
                  <span>Resetting password...</span>
                ) : (
                  <><span>Reset Password</span> <FiArrowRight size={18} /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#34D399] text-[#0F172A] flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white">
              <FiCheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2 font-display">
              Password Reset!
            </h2>
            <p className="text-blue-100 text-sm mb-4">
              Redirecting you to your dashboard...
            </p>
          </div>
        )}

        {/* Back to Log in */}
        <p className="text-xs text-blue-100 text-center mt-8 font-medium">
          Back to{' '}
          <Link to="/login" className="text-[#34D399] font-extrabold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default ResetPassword;
