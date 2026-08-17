import { useMemo, useState } from 'react';
import { DEMO_CLIENT_CODE, mockClient } from './mockPortalData';

export default function ClientLogin() {
  const [clientCode, setClientCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const helperText = useMemo(
    () => `Demo access code: ${DEMO_CLIENT_CODE}`,
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const normalized = clientCode.trim().toUpperCase();

    if (!normalized) {
      setError('Please enter your client code.');
      setIsValid(false);
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 650));

    if (normalized === DEMO_CLIENT_CODE) {
      setIsValid(true);
      setError('');
      window.location.href = '/client/dashboard';
    } else {
      setIsValid(false);
      setError('That client code is invalid. Please try the demo code provided below.');
    }

    setIsSubmitting(false);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem 1.25rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '980px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          border: '1px solid var(--border-mid)',
          background: 'rgba(10, 10, 10, 0.82)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 65px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            padding: 'clamp(2rem, 4vw, 4rem)',
            borderRight: '1px solid var(--border-mid)',
            background:
              'radial-gradient(110% 100% at 0% 0%, rgba(200,184,154,0.08), transparent 56%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                border: '1px solid var(--border-mid)',
                background: 'rgba(255,255,255,0.03)',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-name)',
                fontSize: '1.4rem',
                color: 'var(--sand-light)',
              }}
            >
              K
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.64rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--sand)',
                }}
              >
                Krishna Bihari
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--muted)',
                }}
              >
                Client Portal
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <p
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--sand)',
                marginBottom: '0.8rem',
              }}
            >
              Private access
            </p>
            <h1
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--soft-white)',
              }}
            >
              Welcome to your project workspace.
            </h1>
          </div>

          <p
            style={{
              maxWidth: '44ch',
              color: 'var(--muted)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '2.25rem',
            }}
          >
            Access your live project update, timeline, milestones, and hour tracking in one dedicated client space.
          </p>

          <div
            style={{
              display: 'grid',
              gap: '0.85rem',
              maxWidth: '420px',
            }}
          >
            {[
              'Project progress and delivery milestones',
              'Current phase, timeline, and next steps',
              'Usage overview for hours and remaining capacity',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--off-white)',
                  fontSize: '0.96rem',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--forest-bright)',
                    boxShadow: '0 0 12px rgba(74, 124, 106, 0.7)',
                  }}
                />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.015)',
          }}
        >
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--sand)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Client access
                </div>
                <h2
                  style={{
                    fontSize: '1.65rem',
                    color: 'var(--soft-white)',
                  }}
                >
                  Sign in
                </h2>
              </div>

              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(200,184,154,0.08)',
                  border: '1px solid var(--border-mid)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--sand-light)',
                }}
              >
                {mockClient.initials}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="client-code"
                style={{
                  display: 'block',
                  marginBottom: '0.55rem',
                  color: 'var(--off-white)',
                  fontSize: '0.82rem',
                }}
              >
                Client code
              </label>

              <input
                id="client-code"
                name="client-code"
                type="text"
                value={clientCode}
                onChange={(event) => {
                  setClientCode(event.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your code"
                autoComplete="off"
                aria-invalid={Boolean(error)}
                aria-describedby="client-code-helper"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: error ? '1px solid rgba(220, 96, 96, 0.9)' : '1px solid var(--border-mid)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'var(--soft-white)',
                  padding: '0.92rem 1rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: error ? '0 0 0 3px rgba(220,96,96,0.12)' : 'none',
                }}
              />

              <div
                id="client-code-helper"
                style={{
                  minHeight: '1.5rem',
                  marginTop: '0.6rem',
                  fontSize: '0.78rem',
                  color: error ? '#d7a0a0' : 'var(--muted-light)',
                }}
              >
                {error || helperText}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  marginTop: '1.15rem',
                  border: 'none',
                  borderRadius: '12px',
                  background: isSubmitting ? 'var(--forest-mid)' : 'var(--forest-bright)',
                  color: 'var(--soft-white)',
                  padding: '0.95rem 1rem',
                  fontSize: '0.96rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                  opacity: isSubmitting ? 0.8 : 1,
                }}
              >
                {isSubmitting ? 'Validating access...' : isValid ? 'Access granted' : 'Open dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
