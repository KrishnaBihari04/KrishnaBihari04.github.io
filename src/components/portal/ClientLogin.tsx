import { useMemo, useState } from 'react';
import { fetchPortalDataByClientCode } from '../../lib/client/portal';
import { saveClientSession } from '../../lib/client/auth';
import { DEMO_CLIENT_CODE } from '../../lib/client/types';

export default function ClientLogin() {
  const [clientCode, setClientCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const helperText = useMemo(
    () => `Demo access code: ${DEMO_CLIENT_CODE}`,
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const normalized = clientCode.trim().toUpperCase();

    if (!normalized) {
      setError('Please enter your client code.');
      setIsValid(false);
      return;
    }

    setIsSubmitting(true);

    const response = await fetch('/api/client/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientCode: normalized }),
    });

    const result = await response.json().catch(() => ({ success: false, message: 'Unable to validate the client code.' }));

    if (!response.ok || !result?.success) {
      setIsSubmitting(false);
      setIsValid(false);
      setError(result?.message || 'That client code is invalid. Please try the demo code provided below.');
      return;
    }

    saveClientSession({
      clientCode: normalized,
      clientId: result.client?.id ?? 'client-id',
      company: result.company ?? 'Client',
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
    });

    setIsValid(true);
    setError('');
    setIsSubmitting(false);
    window.location.href = '/client/dashboard';
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
          // Wijziging: Schakelt automatisch over naar 1 kolom op mobiel en 2 op desktop
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          border: '1px solid var(--border-mid)',
          background: 'rgba(10, 10, 10, 0.82)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 65px rgba(0,0,0,0.25)',
        }}
      >
        {/* Linkerpaneel (Welkomstekst) */}
        <div
          style={{
            padding: 'clamp(2rem, 4vw, 4rem)',
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

        {/* Rechterpaneel (Inlogformulier) */}
        <div
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.015)',
            borderTop: '1px solid var(--border-mid)', // Subtiele scheiding op mobiel
          }}
        >
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
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
                WM
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
                type="text"
                value={clientCode}
                onChange={(e) => setClientCode(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter code..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-mid)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--soft-white)',
                  fontSize: '1rem',
                  marginBottom: '0.5rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {error && (
                <p style={{ color: '#ff6b6b', fontSize: '0.82rem', marginBottom: '1rem', marginTop: '0.25rem' }}>
                  {error}
                </p>
              )}

              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.75rem' }}>
                {helperText}
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  border: 'none',
                }}
              >
                {isSubmitting ? 'Verifying...' : 'Access Workspace'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
