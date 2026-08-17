import { useForm, ValidationError } from '@formspree/react';

const contactLinks = [
  {
    label: 'GitHub',
    value: 'github.com/kasbihari',
    href: 'https://github.com/kasbihari',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/krishna-bihari',
    href: 'https://www.linkedin.com/in/krishna-bihari/',
  },
  {
    label: 'Email',
    value: 'kas.bihari@gmail.com',
    href: 'mailto:kas.bihari@gmail.com',
  },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  background: 'var(--charcoal-2)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '4px',
  color: 'var(--soft-white)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.3s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: '0.5rem',
};

export default function Contact() {
  const [state, handleSubmit] = useForm('mbdwvkgq');

  return (
    <section id="contact" className="section-padding">
      <div className="container-main">

        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <p data-reveal className="section-label">Contact</p>
          <h2
            data-reveal
            data-delay="100"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: 'var(--soft-white)',
              lineHeight: 1.05,
              maxWidth: '560px',
            }}
          >
            Let's build something{' '}
            <span
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--sand-light)',
              }}
            >
              worth shipping.
            </span>
          </h2>
          <p
            data-reveal
            data-delay="200"
            style={{
              marginTop: '1.5rem',
              fontSize: '0.95rem',
              color: 'var(--muted)',
              lineHeight: 1.75,
              maxWidth: '460px',
            }}
          >
            Open to freelance projects, AI automation work, SaaS collaborations, and
            interesting engineering challenges. Whether you need a web application built,
            a business process automated, or an AI system integrated — let's talk.
            Response within 24 hours.
          </p>
        </div>

        {/* Two column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'start',
          }}
        >
          {/* Left — contact links */}
          <div data-reveal data-delay="0">
            <p
              style={{
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '2rem',
              }}
            >
              Find me at
            </p>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {contactLinks.map((link) => (
                <div key={link.label}>
                  <div className="divider" />
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.25rem 0',
                      color: 'var(--muted-light)',
                      transition: 'color 0.3s cubic-bezier(0.16,1,0.3,1)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--soft-white)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-light)'; }}
                  >
                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.72rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--muted)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {link.label}
                      </span>
                      <span style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                        {link.value}
                      </span>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ opacity: 0.4, flexShrink: 0, marginLeft: '1rem' }}
                    >
                      <path
                        d="M3 13L13 3M13 3H6M13 3v7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              ))}
              <div className="divider" />
            </div>

            {/* Availability badge */}
            <div
              style={{
                marginTop: '2.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 1.1rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--forest-bright)',
                  boxShadow: '0 0 6px var(--forest-bright)',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--muted-light)',
                  letterSpacing: '0.04em',
                }}
              >
                Available for new projects
              </span>
            </div>
          </div>

          {/* Right — contact form */}
          <div data-reveal data-delay="150">
            {state.succeeded ? (
              /* ✅ Success state */
              <div
                style={{
                  padding: '3rem 2rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(var(--forest-bright-rgb, 100, 180, 120), 0.12)',
                    border: '1px solid var(--forest-bright)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10l4 4 8-8"
                      stroke="var(--forest-bright)"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: 'var(--soft-white)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Message received.
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                  I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              /* 📬 Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                {/* Name */}
                <div>
                  <label htmlFor="name" style={labelStyle}>Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-mid)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    aria-required="true"
                  />
                  <ValidationError
                    field="name"
                    prefix="Name"
                    errors={state.errors}
                    style={{ fontSize: '0.78rem', color: '#e07070', marginTop: '0.35rem', display: 'block' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" style={labelStyle}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-mid)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    aria-required="true"
                  />
                  <ValidationError
                    field="email"
                    prefix="Email"
                    errors={state.errors}
                    style={{ fontSize: '0.78rem', color: '#e07070', marginTop: '0.35rem', display: 'block' }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" style={labelStyle}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project, what you're trying to automate, or what you need built..."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-mid)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    aria-required="true"
                  />
                  <ValidationError
                    field="message"
                    prefix="Message"
                    errors={state.errors}
                    style={{ fontSize: '0.78rem', color: '#e07070', marginTop: '0.35rem', display: 'block' }}
                  />
                </div>

                {/* Global form error */}
                <ValidationError
                  errors={state.errors}
                  style={{ fontSize: '0.82rem', color: '#e07070' }}
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    opacity: state.submitting ? 0.6 : 1,
                    cursor: state.submitting ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.3s',
                  }}
                >
                  {state.submitting ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ animation: 'spin 0.8s linear infinite' }}
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeOpacity="0.25"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2 7h10M7 2l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center' }}>
                  No spam. Your details are only used to respond to your message.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Spinning loader keyframe — injected inline to avoid extra CSS file */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
