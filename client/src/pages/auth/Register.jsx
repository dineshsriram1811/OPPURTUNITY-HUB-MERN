import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { registerUser } from '../../store/slices/authSlice';
import AuthCard from '../../components/auth/AuthCard';
import { AuthIllustrationRegister } from '../../components/auth/AuthIllustrations';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'student' } });
  const pwd = watch('password', '');

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({ ...data, role: 'student' }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/student/dashboard');
    }
  };

  return (
    <AuthCard illustration={<AuthIllustrationRegister />} maxWidth="max-w-5xl">
      <div className="max-w-md">
        {/* Heading & Subtitle matching Reference Image */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-display tracking-wide">
          Create your account
        </h1>
        <p className="text-blue-100/90 text-sm sm:text-base mb-6 font-normal leading-relaxed">
          Join OpportunityHub and start exploring endless opportunities.
        </p>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                className={`auth-form-input pl-12 ${errors.name ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                placeholder="Arjun Sharma"
                {...register('name', {
                  required: 'Full Name is required',
                  minLength: { value: 2, message: 'At least 2 characters required' },
                })}
              />
            </div>
            {errors.name && (
              <div className="text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-0.5 rounded-lg border border-red-500/30">
                ⚠️ {errors.name.message}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="email"
                className={`auth-form-input pl-12 ${errors.email ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                placeholder="name@company.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address' },
                })}
              />
            </div>
            {errors.email && (
              <div className="text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-0.5 rounded-lg border border-red-500/30">
                ⚠️ {errors.email.message}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type={showPwd ? 'text' : 'password'}
                className={`auth-form-input pl-12 pr-12 ${errors.password ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
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
              <div className="text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-0.5 rounded-lg border border-red-500/30">
                ⚠️ {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type={showConfirm ? 'text' : 'password'}
                className={`auth-form-input pl-12 pr-12 ${errors.confirmPassword ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === pwd || 'Passwords do not match',
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
            {errors.confirmPassword && (
              <div className="text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-0.5 rounded-lg border border-red-500/30">
                ⚠️ {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-blue-100 font-medium select-none">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded text-[#34D399] focus:ring-[#34D399] border-white/40 bg-white/20 cursor-pointer"
              />
              <span>I agree to the <span className="text-[#34D399] font-bold underline">Terms &amp; Conditions</span></span>
            </label>
          </div>

          {/* Mint Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="auth-btn-mint mt-2"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <><span>Sign Up</span> <FiArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Already have an account */}
        <p className="text-xs text-blue-100 text-center mt-5 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#34D399] font-extrabold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default Register;
