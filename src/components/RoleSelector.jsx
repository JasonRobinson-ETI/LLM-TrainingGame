import React, { useState } from 'react';

const RoleSelector = ({ onSelectRole, isTeacherRoute }) => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && selectedRole) {
      onSelectRole(selectedRole, name);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
      <div className="card" style={{ 
        maxWidth: '500px', 
        width: '100%'
      }}>
        <h1 style={{ 
          marginBottom: '8px', 
          textAlign: 'center',
          color: '#764ba2',
          fontSize: '2.5rem',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}>
          🧠 LLM Builder Activity
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '32px', 
          color: 'rgba(29, 29, 31, 0.8)',
          fontSize: '1.05rem',
          fontWeight: '400',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          Train an AI through Creative Chaos!
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#1d1d1f',
              fontSize: '0.95rem',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              Your Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{ 
                width: '100%',
                padding: '12px 16px',
                fontSize: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#1d1d1f',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '600',
              color: '#1d1d1f',
              fontSize: '0.95rem',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              Select Your Role:
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isTeacherRoute && (
                <button
                  type="button"
                  onClick={() => setSelectedRole('teacher')}
                  style={{
                    background: selectedRole === 'teacher' 
                      ? 'rgba(255, 255, 255, 0.4)' 
                      : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: '#1d1d1f',
                    padding: '18px 20px',
                    textAlign: 'left',
                    border: selectedRole === 'teacher' 
                      ? '2px solid rgba(255, 255, 255, 0.6)' 
                      : '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRole === 'teacher' 
                      ? '0 8px 24px rgba(0, 0, 0, 0.15)' 
                      : 'none',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRole !== 'teacher') {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRole !== 'teacher') {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ fontSize: '1.15rem', marginBottom: '4px', fontWeight: '600' }}>
                    Teacher
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: '1.4' }}>
                    Control the game and watch the AI evolve
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                style={{
                  background: selectedRole === 'student' 
                    ? 'rgba(255, 255, 255, 0.4)' 
                    : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#1d1d1f',
                  padding: '18px 20px',
                  textAlign: 'left',
                  border: selectedRole === 'student' 
                    ? '2px solid rgba(255, 255, 255, 0.6)' 
                    : '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedRole === 'student' 
                    ? '0 8px 24px rgba(0, 0, 0, 0.15)' 
                    : 'none',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedRole !== 'student') {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRole !== 'student') {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ fontSize: '1.15rem', marginBottom: '4px', fontWeight: '600' }}>
                  Student
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: '1.4' }}>
                  Ask questions & provide answers (roles rotate!)
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name || !selectedRole}
            style={{
              width: '100%',
              background: name && selectedRole 
                ? 'rgba(255, 255, 255, 0.4)' 
                : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              color: '#1d1d1f',
              padding: '16px',
              fontSize: '1.05rem',
              fontWeight: '700',
              borderRadius: '12px',
              border: name && selectedRole 
                ? '2px solid rgba(255, 255, 255, 0.6)' 
                : '1px solid rgba(255, 255, 255, 0.7)',
              cursor: name && selectedRole ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.02em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              boxShadow: name && selectedRole 
                ? '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)' 
                : 'none',
              opacity: name && selectedRole ? 1 : 0.5
            }}
            onMouseEnter={(e) => {
              if (name && selectedRole) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.7)';
              }
            }}
            onMouseLeave={(e) => {
              if (name && selectedRole) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
              }
            }}
            onMouseDown={(e) => {
              if (name && selectedRole) {
                e.currentTarget.style.transform = 'translateY(-1px) scale(0.99)';
              }
            }}
            onMouseUp={(e) => {
              if (name && selectedRole) {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
              }
            }}
          >
            Join AI Training
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelector;
