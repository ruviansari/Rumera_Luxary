import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ArrowRight, Crown, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { api, setAuthTokens } from '../../services/api';

export default function LoginPage({ onLoginSuccess, onNavigate }) {
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'otp'
  const [otpPhone, setOtpPhone] = useState('+91 9305988767');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpPreview, setOtpPreview] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!otpPhone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.sendOTP(otpPhone.trim());
      setOtpSent(true);
      setOtpPreview(res.otp_preview || '');
      setSuccessMessage(`Royal OTP dispatched to ${otpPhone}. (Demo code: ${res.otp_preview})`);
    } catch (err) {
      setError(err.message || 'Failed to dispatch OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api.verifyOTP(otpPhone.trim(), otpCode.trim());
      setAuthTokens(data.access, data.refresh, data.user);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = (toRegister) => {
    setIsRegister(toRegister);
    setError('');
    setSuccessMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isRegister) {
        if (!formData.first_name?.trim() || !formData.last_name?.trim()) {
          setError('First name and last name are required.');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.password_confirm) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long.');
          setLoading(false);
          return;
        }

        // 1. Call Backend Registration API
        await api.register({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || '',
          password: formData.password,
          password_confirm: formData.password_confirm,
        });

        // 2. Open Login Page as requested ("after register open login page")
        setIsRegister(false);
        setSuccessMessage('Registration successful! Please sign in with your password to open your dashboard.');
        setFormData(prev => ({
          ...prev,
          password: '',
          password_confirm: ''
        }));
        setLoading(false);
        return;
      }

      // 3. Authenticate & Open Dashboard ("after that open dashboard")
      const data = await api.login(formData.email.trim(), formData.password);
      setAuthTokens(data.access, data.refresh, data.user);
      onLoginSuccess(data.user);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
        setError('Cannot connect to Django Backend (Port 8000/8001). Please make sure the backend dev server is running.');
      } else {
        setError(err.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-auth-wrapper">
      <div className="luxury-auth-card">
        {/* Top Rumera Seal & Insignia Badge */}
        <div className="auth-emblem-badge" title="Rumera Royal Crest">
          <img src="/images/rumera_crest_emblem.png" alt="Rumera Royal Crest" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', backgroundColor: 'rgba(183, 139, 69, 0.1)', border: '1px solid rgba(183, 139, 69, 0.35)', borderRadius: '9999px', marginBottom: '12px' }}>
            <Crown size={12} color="#B78B45" />
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9E7434', fontWeight: 700 }}>
              MAISON RUMERA • CLIENT PORTAL
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.3rem', color: '#14231F', lineHeight: 1.15, fontWeight: 500, letterSpacing: '-0.01em' }}>
            {isRegister ? 'Join The Royal Atelier' : 'Client Authentication'}
          </h2>
          <p style={{ color: '#5C6B63', fontSize: '0.88rem', marginTop: '6px', lineHeight: 1.5 }}>
            {isRegister
              ? 'Create your private profile for royal reserves, orders, and bespoke access.'
              : 'Sign in to access your orders, saved formulations, and private dashboard.'}
          </p>
        </div>

        {/* Success Alert Banner (shown after registration) */}
        {successMessage && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 18px', backgroundColor: 'rgba(42, 104, 76, 0.12)', border: '1px solid rgba(42, 104, 76, 0.35)', color: '#1B4D36', borderRadius: '14px', fontSize: '0.86rem', marginBottom: '22px', lineHeight: 1.5 }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#2A684C' }} />
            <div>{successMessage}</div>
          </div>
        )}

        {/* Error Alert Notice */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 18px', backgroundColor: 'rgba(150, 56, 50, 0.08)', border: '1px solid rgba(150, 56, 50, 0.25)', color: '#963832', borderRadius: '14px', fontSize: '0.84rem', marginBottom: '22px', lineHeight: 1.5 }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#963832' }} />
            <div>{error}</div>
          </div>
        )}

        {/* Auth Method Switcher Tabs (Login Mode) */}
        {!isRegister && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '4px', backgroundColor: 'rgba(20, 35, 31, 0.05)', borderRadius: '12px', marginBottom: '22px' }}>
            <button
              type="button"
              onClick={() => { setAuthMethod('password'); setError(''); }}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: authMethod === 'password' ? '#14231F' : 'transparent',
                color: authMethod === 'password' ? '#FAF7F0' : '#5C6B63',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('otp'); setError(''); }}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: authMethod === 'otp' ? '#14231F' : 'transparent',
                color: authMethod === 'otp' ? '#FAF7F0' : '#5C6B63',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>⚡ Mobile OTP Login</span>
            </button>
          </div>
        )}

        {/* Mobile OTP Login Form */}
        {!isRegister && authMethod === 'otp' ? (
          <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Mobile Number *
              </label>
              <div className="luxury-auth-input-group">
                <span className="luxury-auth-input-icon"><Phone size={17} /></span>
                <input
                  type="text"
                  value={otpPhone}
                  onChange={(e) => setOtpPhone(e.target.value)}
                  disabled={otpSent}
                  required
                  placeholder="+91 9305988767"
                  className="luxury-auth-input"
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Enter 6-Digit Royal OTP *
                </label>
                <div className="luxury-auth-input-group">
                  <span className="luxury-auth-input-icon"><Lock size={17} /></span>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    autoFocus
                    placeholder="e.g. 123456"
                    className="luxury-auth-input"
                    style={{ letterSpacing: '0.3em', fontSize: '1.2rem', fontWeight: 700 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.76rem' }}>
                  <span style={{ color: '#5C6B63' }}>Code valid for 10 minutes</span>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    style={{ background: 'none', border: 'none', color: '#B78B45', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Change Phone Number
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="luxury-auth-submit-btn"
              style={{ marginTop: '6px' }}
            >
              <span>{loading ? 'Authenticating...' : otpSent ? 'Verify OTP & Enter Atelier' : 'Send 6-Digit Royal OTP'}</span>
              <ArrowRight size={17} />
            </button>
          </form>
        ) : (
        /* Standard Auth Form */
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {isRegister && (
            <div className="luxury-auth-names-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  First Name *
                </label>
                <div className="luxury-auth-input-group">
                  <span className="luxury-auth-input-icon"><User size={17} /></span>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                    className="luxury-auth-input"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Last Name *
                </label>
                <div className="luxury-auth-input-group">
                  <span className="luxury-auth-input-icon"><User size={17} /></span>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                    className="luxury-auth-input"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Email Address *
            </label>
            <div className="luxury-auth-input-group">
              <span className="luxury-auth-input-icon"><Mail size={17} /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="luxury-auth-input"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Phone Number
              </label>
              <div className="luxury-auth-input-group">
                <span className="luxury-auth-input-icon"><Phone size={17} /></span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="luxury-auth-input"
                />
              </div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Password *
              </label>
              {!isRegister && (
                <span style={{ fontSize: '0.76rem', color: '#B78B45', fontWeight: 500, cursor: 'pointer' }}>
                  Forgot?
                </span>
              )}
            </div>
            <div className="luxury-auth-input-group" style={{ position: 'relative' }}>
              <span className="luxury-auth-input-icon"><Lock size={17} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="luxury-auth-input"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  color: '#8E9B94',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Confirm Password *
              </label>
              <div className="luxury-auth-input-group">
                <span className="luxury-auth-input-icon"><Lock size={17} /></span>
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="luxury-auth-input"
                />
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="luxury-submit-btn"
            style={{ marginTop: '10px' }}
          >
            <span>{loading ? 'Processing...' : (isRegister ? 'Register Account' : 'Sign In')}</span>
            <ArrowRight size={17} className="submit-arrow" />
          </button>
        </form>
        )}

        {/* Toggle Register / Sign In */}
        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.88rem', color: '#5C6B63' }}>
          {isRegister ? (
            <span>Already an atelier member? <button onClick={() => toggleMode(false)} style={{ color: '#B78B45', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px', background: 'none', border: 'none', cursor: 'pointer' }}>Sign In</button></span>
          ) : (
            <span>Don't have an account? <button onClick={() => toggleMode(true)} style={{ color: '#B78B45', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px', background: 'none', border: 'none', cursor: 'pointer' }}>Create One</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
