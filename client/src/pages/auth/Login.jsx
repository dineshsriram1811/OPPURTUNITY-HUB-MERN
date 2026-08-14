import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { loginUser } from '../../store/slices/authSlice';
import AuthCard from '../../components/auth/AuthCard';
import { AuthIllustrationLogin } from '../../components/auth/AuthIllustrations';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate(`/${result.payload.user.role}/dashboard`, { replace: true });
    }
  };

  return (
    <AuthCard illustration={<AuthIllustrationLogin />} maxWidth="max-w-5xl">
      <div className="max-w-md">
        {/* Heading & Subtitle matching Reference Image */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-display tracking-wide">
          Welcome back!
        </h1>
        <p className="text-blue-100/90 text-sm sm:text-base mb-8 font-normal leading-relaxed">
          Log in to continue your journey and discover the best opportunities.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email / Username Input */}
          <div>
            <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className={`auth-form-input pl-12 ${errors.email ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                placeholder="name@company.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address' },
                })}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-1 rounded-lg border border-red-500/30">
                ⚠️ {errors.email.message}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                className={`auth-form-input pl-12 pr-12 ${errors.password ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                onClick={() => setShowPwd((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-none cursor-pointer text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-1 rounded-lg border border-red-500/30">
                ⚠️ {errors.password.message}
              </div>
            )}
          </div>

          {/* Remember me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1 pb-2">
            <label className="flex items-center gap-2 cursor-pointer text-blue-100 font-medium select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-[#34D399] focus:ring-[#34D399] border-white/40 bg-white/20 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="text-[#34D399] hover:text-[#6EE7B7] font-bold transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Mint Action Button */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="auth-btn-mint"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <><span>Log In</span> <FiArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-xs text-blue-100 text-center mt-6 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#34D399] font-extrabold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default Login;
