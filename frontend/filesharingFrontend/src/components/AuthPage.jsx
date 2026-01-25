import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import './AuthPage.css';

// Reusable Input Field Component
// Fix: We now destruct 'Icon' directly (capitalized) to avoid aliasing errors
// eslint-disable-next-line no-unused-vars
const InputField = ({  Icon, type, placeholder, value, onChange, id, autoFocus, disabled }) => (
  <div className="input-field">
    <Icon className="field-icon" size={20} aria-hidden="true" />
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      autoFocus={autoFocus}
      disabled={disabled}
      aria-label={placeholder}
    />
  </div>
);

// Reusable Form Component
const AuthForm = ({ 
  mode, 
  onSubmit, 
  isActive, 
  className,
  formData,
  setFormData,
  isLoading,
  error 
}) => {
  const isSignUp = mode === 'signup';
  const firstInputRef = useRef(null);

  // Auto-focus first input when form becomes active
  useEffect(() => {
    if (isActive && firstInputRef.current) {
      const timeoutId = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 600);
      return () => clearTimeout(timeoutId);
    }
  }, [isActive]);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div 
      className={`form-container ${className}`} 
      aria-hidden={!isActive}
      onKeyDown={handleKeyDown}
    >
      <div className="form-content">
        <div className="brand-header">
          <div className="icon-badge" aria-hidden="true">
            {isSignUp ? <User size={24} /> : <Sparkles size={24} />}
          </div>
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignUp ? 'Join us to share files securely.' : 'Enter your details to access your files.'}</p>
        </div>
        
        <div className="input-group" role="group" aria-label={`${isSignUp ? 'Sign up' : 'Sign in'} form fields`}>
          {isSignUp && (
            <InputField
              Icon={User} /* Passed as 'Icon' to match component prop */
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange('username')}
              id={`username-${mode}`}
              autoFocus={isActive}
              disabled={isLoading}
            />
          )}
          
          <InputField
            Icon={Mail} /* Passed as 'Icon' to match component prop */
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange('email')}
            id={`email-${mode}`}
            autoFocus={!isSignUp && isActive}
            disabled={isLoading}
          />
          
          <InputField
            Icon={Lock} /* Passed as 'Icon' to match component prop */
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange('password')}
            id={`password-${mode}`}
            disabled={isLoading}
          />
        </div>
        
        {!isSignUp && (
          <a href="#" className="forgot-password" tabIndex={isActive ? 0 : -1}>
            Forgot your password?
          </a>
        )}

        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <button 
          type="button"
          onClick={onSubmit}
          className="btn-solid"
          disabled={isLoading}
          tabIndex={isActive ? 0 : -1}
        >
          {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </div>
    </div>
  );
};

// Overlay Panel Component
const OverlayPanel = ({ side, title, description, buttonText, onClick, isActive }) => (
  <div className={`overlay-panel overlay-${side}`} aria-hidden={!isActive}>
    <h1>{title}</h1>
    <p>{description}</p>
    <button 
      className="btn-transparent" 
      type="button" 
      onClick={onClick}
      tabIndex={isActive ? 0 : -1}
      aria-label={`Switch to ${buttonText} form`}
    >
      {buttonText}
    </button>
  </div>
);

// Mobile Toggle Component
const MobileToggle = ({ isSignUp, onToggle }) => (
  <button
    type="button"
    className="mobile-toggle"
    onClick={onToggle}
    aria-label={`Switch to ${isSignUp ? 'sign in' : 'sign up'}`}
  >
    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
  </button>
);

// Main Component
const AuthPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Separate form data for each mode
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });

  const toggleMode = () => {
    setIsSignUp(prev => !prev);
    setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    
    // Prevent double submission
    if (isLoading) return;
    
    // Basic validation
    const currentData = isSignUp ? signUpData : signInData;
    if (!currentData.email || !currentData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (isSignUp && !signUpData.username) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin();
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-container ${isSignUp ? 'sign-up-mode' : ''}`}>
      <div className="auth-card" role="main">
        
        {/* Forms Container */}
        <div className="forms-wrapper">
          <AuthForm
            mode="signin"
            onSubmit={handleSubmit}
            isActive={!isSignUp}
            className="sign-in-form"
            formData={signInData}
            setFormData={setSignInData}
            isLoading={isLoading}
            error={error}
          />

          <AuthForm
            mode="signup"
            onSubmit={handleSubmit}
            isActive={isSignUp}
            className="sign-up-form"
            formData={signUpData}
            setFormData={setSignUpData}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Overlay Slider */}
        <div className="overlay-container" aria-hidden="true">
          <div className="overlay">
            <OverlayPanel
              side="left"
              title="Welcome Back!"
              description="To keep connected with us please login with your personal info"
              buttonText="Sign In"
              onClick={toggleMode}
              isActive={isSignUp}
            />
            
            <OverlayPanel
              side="right"
              title="Hello, Friend!"
              description="Enter your personal details and start your journey with us"
              buttonText="Sign Up"
              onClick={toggleMode}
              isActive={!isSignUp}
            />
          </div>
        </div>

        {/* Mobile Toggle */}
        <MobileToggle isSignUp={isSignUp} onToggle={toggleMode} />

      </div>
    </div>
  );
};

export default AuthPage;