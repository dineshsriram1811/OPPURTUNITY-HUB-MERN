import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AuthCard from '../../components/auth/AuthCard';
import { AuthIllustrationVerify } from '../../components/auth/AuthIllustrations';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        setMessage(data.message);
        setStatus('success');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <AuthCard illustration={<AuthIllustrationVerify />} maxWidth="max-w-4xl">
      <div className="max-w-md text-left">
        {/* Heading & Subtitle matching Reference Image */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-display tracking-wide">
          Verify Your Email
        </h1>
        <p className="text-blue-100/90 text-sm sm:text-base mb-6 font-normal leading-relaxed">
          We've sent a verification link to your email address.
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 my-4 text-center">
          {status === 'loading' && (
            <div className="py-6 flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" text="" color="#34D399" />
              <span className="text-sm font-semibold text-white">Verifying your email...</span>
            </div>
          )}

          {status === 'success' && (
            <div className="py-2">
              <div className="w-16 h-16 rounded-full bg-[#34D399] text-[#0F172A] flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white">
                <FiCheckCircle size={32} />
              </div>
              <h2 className="text-xl font-extrabold text-white mb-2 font-display">
                Email Verified Successfully!
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mb-6 leading-relaxed">
                {message || 'Your account is active. Please check your inbox and click the link to verify your account.'}
              </p>
              <Link
                to="/login"
                className="auth-btn-mint inline-flex"
              >
                <span>Sign In to Your Account</span> <FiArrowRight size={18} />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-2">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center mx-auto mb-4 border border-red-400/40">
                <FiXCircle size={32} />
              </div>
              <h2 className="text-xl font-extrabold text-white mb-2 font-display">
                Verification Failed
              </h2>
              <p className="text-red-200 text-xs sm:text-sm mb-6 leading-relaxed bg-red-900/30 p-3 rounded-xl border border-red-500/30">
                {message}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/register"
                  className="auth-btn-mint inline-flex"
                >
                  <FiRefreshCw size={16} /> <span>Register Again</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Resend Email & Change Email Links matching Reference Image */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-center">
          <Link to="/login" className="text-[#34D399] hover:text-[#6EE7B7] transition-colors">
            Resend Email
          </Link>
          <Link to="/register" className="text-blue-200 hover:text-white transition-colors">
            Change Email Address
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};

export default VerifyEmail;
