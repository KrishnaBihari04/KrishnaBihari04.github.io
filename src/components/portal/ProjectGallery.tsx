import { useEffect, useState } from 'react';

type ProjectGalleryProps = {
  readonly images: string[];
  readonly projectName: string;
};

export default function ProjectGallery({
  images,
  projectName,
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const validImages = images.filter(
    (image) =>
      typeof image === 'string' &&
      image.trim().length > 0,
  );

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [images]);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      }

      if (
        event.key === 'ArrowRight' &&
        validImages.length > 1
      ) {
        setActiveIndex(
          (current) =>
            (current + 1) % validImages.length,
        );
      }

      if (
        event.key === 'ArrowLeft' &&
        validImages.length > 1
      ) {
        setActiveIndex(
          (current) =>
            (current - 1 + validImages.length) %
            validImages.length,
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [lightboxOpen, validImages.length]);

  if (validImages.length === 0) {
    return null;
  }

  const activeImage =
    validImages[
      Math.min(activeIndex, validImages.length - 1)
    ];

  const nextImage = () => {
    setActiveIndex(
      (current) =>
        (current + 1) % validImages.length,
    );
  };

  const previousImage = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + validImages.length) %
        validImages.length,
    );
  };

  return (
    <>
      <section
        data-reveal
        style={{
          border: '1px solid var(--border-mid)',
          borderRadius: '18px',
          overflow: 'hidden',
          background: 'rgba(10, 10, 10, 0.78)',
          boxShadow:
            '0 20px 45px rgba(0, 0, 0, 0.16)',
        }}
      >
        <div
          style={{
            padding:
              '1.15rem clamp(1rem, 2.5vw, 1.4rem)',
            borderBottom:
              '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--sand)',
              marginBottom: '0.3rem',
            }}
          >
            Project media
          </div>

          <div
            style={{
              color: 'var(--soft-white)',
              fontSize: '1.05rem',
            }}
          >
            Visual progress
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.015)',
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Open ${projectName} image in fullscreen`}
            style={{
              display: 'block',
              width: '100%',
              padding: 0,
              border: 0,
              background: 'transparent',
              cursor: 'zoom-in',
            }}
          >
            <img
              src={activeImage}
              alt={`${projectName} screenshot ${activeIndex + 1}`}
              style={{
                display: 'block',
                width: '100%',
                height: 'clamp(220px, 45vw, 520px)',
                objectFit: 'cover',
              }}
            />
          </button>

          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                aria-label="Previous project image"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '1rem',
                  transform:
                    'translateY(-50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border:
                    '1px solid rgba(255,255,255,0.12)',
                  background:
                    'rgba(0,0,0,0.48)',
                  color: 'var(--soft-white)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  fontSize: '1.1rem',
                }}
              >
                ←
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Next project image"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '1rem',
                  transform:
                    'translateY(-50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border:
                    '1px solid rgba(255,255,255,0.12)',
                  background:
                    'rgba(0,0,0,0.48)',
                  color: 'var(--soft-white)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  fontSize: '1.1rem',
                }}
              >
                →
              </button>

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '1rem',
                  transform:
                    'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.7rem',
                  borderRadius: '999px',
                  background:
                    'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {validImages.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setActiveIndex(index)
                      }
                      aria-label={`Show image ${
                        index + 1
                      }`}
                      aria-current={
                        activeIndex === index
                      }
                      style={{
                        width: '7px',
                        height: '7px',
                        padding: 0,
                        border: 0,
                        borderRadius: '50%',
                        background:
                          activeIndex === index
                            ? 'var(--soft-white)'
                            : 'rgba(255,255,255,0.32)',
                        cursor: 'pointer',
                      }}
                    />
                  ),
                )}
              </div>
            </>
          )}
        </div>

        {validImages.length > 1 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(90px, 1fr))',
              gap: '0.55rem',
              padding: '0.75rem',
              borderTop:
                '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {validImages.map(
              (image, index) => (
                <button
                  key={`thumb-${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  aria-label={`Select image ${
                    index + 1
                  }`}
                  style={{
                    position: 'relative',
                    padding: 0,
                    aspectRatio: '16 / 10',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    border:
                      activeIndex === index
                        ? '1px solid var(--sand-light)'
                        : '1px solid rgba(255,255,255,0.06)',
                    background:
                      'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    opacity:
                      activeIndex === index
                        ? 1
                        : 0.6,
                    transition:
                      'opacity 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <img
                    src={image}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </button>
              ),
            )}
          </div>
        )}
      </section>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName} project gallery`}
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: '1rem',
            background:
              'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() =>
              setLightboxOpen(false)
            }
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              zIndex: 2,
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border:
                '1px solid rgba(255,255,255,0.12)',
              background:
                'rgba(255,255,255,0.06)',
              color: 'var(--soft-white)',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            ×
          </button>

          <img
            src={activeImage}
            alt={`${projectName} screenshot ${activeIndex + 1}`}
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              maxWidth: 'min(1400px, 94vw)',
              maxHeight: '88vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow:
                '0 30px 100px rgba(0,0,0,0.5)',
            }}
          />

          {validImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous fullscreen image"
                onClick={(event) => {
                  event.stopPropagation();
                  previousImage();
                }}
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '1rem',
                  transform:
                    'translateY(-50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border:
                    '1px solid rgba(255,255,255,0.12)',
                  background:
                    'rgba(255,255,255,0.06)',
                  color: 'var(--soft-white)',
                  cursor: 'pointer',
                  fontSize: '1.15rem',
                }}
              >
                ←
              </button>

              <button
                type="button"
                aria-label="Next fullscreen image"
                onClick={(event) => {
                  event.stopPropagation();
                  nextImage();
                }}
                style={{
                  position: 'fixed',
                  top: '50%',
                  right: '1rem',
                  transform:
                    'translateY(-50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border:
                    '1px solid rgba(255,255,255,0.12)',
                  background:
                    'rgba(255,255,255,0.06)',
                  color: 'var(--soft-white)',
                  cursor: 'pointer',
                  fontSize: '1.15rem',
                }}
              >
                →
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}