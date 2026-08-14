import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiSend, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AuthCard from '../../components/auth/AuthCard';
import { AuthIllustrationForgot } from '../../components/auth/AuthIllustrations';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSentTo(email);
      setSent(true);
      toast.success('Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard illustration={<AuthIllustrationForgot />} maxWidth="max-w-4xl">
      <div className="max-w-md">
        {!sent ? (
          <>
            {/* Heading & Subtitle matching Reference Image */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-display tracking-wide">
              Forgot Password?
            </h1>
            <p className="text-blue-100/90 text-sm sm:text-base mb-8 font-normal leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5">
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
                  <div className="text-xs text-red-200 font-bold mt-1 bg-red-900/30 px-3 py-1 rounded-lg border border-red-500/30">
                    ⚠️ {errors.email.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-btn-mint mt-4"
              >
                {loading ? (
                  <span>Sending link...</span>
                ) : (
                  <><span>Send Reset Link</span> <FiSend size={18} /></>
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
              Check your inbox!
            </h2>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              We've sent a password reset link to <strong className="text-white">{sentTo}</strong>.
            </p>
            <button
              onClick={() => setSent(false)}
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all border border-white/30 cursor-pointer"
            >
              Try a different email
            </button>
          </div>
        )}

        {/* Back to Log in */}
        <p className="text-xs text-blue-100 text-center mt-8 font-medium">
          Remember your password?{' '}
          <Link to="/login" className="text-[#34D399] font-extrabold hover:underline inline-flex items-center gap-1">
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
