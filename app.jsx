import React, { useState, useRef, useEffect } from "react";
import { useFireproof } from "use-fireproof";

// Colors from the design palette
const colors = {
  ana1: "oklch(67% 0.164 252)",
  ana2: "oklch(47% 0.118 222)",
  ana3: "oklch(57% 0.133 232)",
  ana4: "oklch(82% 0.125 242)",
  ana5: "oklch(92% 0.103 267)",
  ana6: "oklch(99% 0.089 282)"
};

const gradientBg = `linear-gradient(135deg in oklch, ${colors.ana6}, ${colors.ana5}, ${colors.ana4})`;

const glassCard = {
  background: "rgba(255,255,255,0.5)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)"
};

export default function App() {
  // Use tenant context for database scoping (provided by sell template)
  const { dbName, subdomain } = typeof useTenant === 'function' ? useTenant() : { dbName: "wedding-moments-db", subdomain: "demo" };

  const { database, useLiveQuery, useDocument } = useFireproof(dbName);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { doc, merge, submit, reset } = useDocument({
    type: "photo",
    contributor: "",
    imageData: "",
    caption: "",
    timestamp: Date.now()
  });

  const { docs: photos } = useLiveQuery("type", { key: "photo" });
  const sortedPhotos = [...photos].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      merge({ imageData: event.target.result, timestamp: Date.now() });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doc.imageData || !doc.contributor.trim()) return;
    await submit();
    setShowUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    setShowUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen relative" style={{ background: gradientBg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-medium"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: colors.ana2 }}
          >
            {subdomain}'s Moments
          </h1>
          <p className="text-sm font-light" style={{ color: colors.ana3 }}>
            Share your photos from the celebration
          </p>
        </div>
      </header>

      {/* Photo Grid */}
      <main className="px-4 md:px-8 pb-32 max-w-7xl mx-auto">
        {sortedPhotos.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 rounded-3xl" style={glassCard}>
              <svg className="w-16 h-16 mx-auto mb-4" style={{ color: colors.ana1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: colors.ana2 }}>
                No photos yet
              </p>
              <p className="mt-2 text-sm" style={{ color: colors.ana3 }}>
                Be the first to share a moment
              </p>
            </div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 mt-8">
            {sortedPhotos.map((photo) => (
              <div
                key={photo._id}
                onClick={() => setLightboxPhoto(photo)}
                className="mb-4 break-inside-avoid cursor-pointer group"
              >
                <div
                  className="relative rounded-2xl overflow-hidden transition-all duration-500 ease-out group-hover:scale-[1.02]"
                  style={glassCard}
                >
                  <img
                    src={photo.imageData}
                    alt={photo.caption || "Wedding moment"}
                    className="w-full object-cover"
                    style={{ minHeight: "200px" }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to top, ${colors.ana2}99, transparent 50%)` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-sm font-light" style={{ color: colors.ana6 }}>
                      by {photo.contributor}
                    </p>
                    {photo.caption && (
                      <p className="text-xs mt-1 opacity-80" style={{ color: colors.ana6 }}>
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowUpload(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ background: colors.ana1, boxShadow: `0 8px 32px ${colors.ana1}66` }}
      >
        <svg className="w-8 h-8" style={{ color: colors.ana6 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" onClick={handleClose}>
          <div className="absolute inset-0" style={{ background: `${colors.ana2}4d`, backdropFilter: "blur(8px)" }} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl p-8"
            style={{ ...glassCard, background: "rgba(255,255,255,0.9)" }}
          >
            <h2 className="text-3xl mb-6 text-center" style={{ fontFamily: "'Cormorant Garamond', serif", color: colors.ana2 }}>
              Share a Moment
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="photo-upload" />
                <label
                  htmlFor="photo-upload"
                  className="block w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 hover:border-solid overflow-hidden"
                  style={{ borderColor: doc.imageData ? "transparent" : colors.ana4, background: doc.imageData ? "transparent" : `${colors.ana6}80` }}
                >
                  {doc.imageData ? (
                    <img src={doc.imageData} alt="Preview" className="w-full h-48 object-cover" />
                  ) : (
                    <div className="py-12 text-center">
                      {uploading ? (
                        <div className="w-8 h-8 mx-auto border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.ana1, borderTopColor: "transparent" }} />
                      ) : (
                        <>
                          <svg className="w-10 h-10 mx-auto mb-2" style={{ color: colors.ana1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <p className="text-sm" style={{ color: colors.ana3 }}>Tap to select a photo</p>
                        </>
                      )}
                    </div>
                  )}
                </label>
              </div>
              <input
                type="text"
                placeholder="Your name"
                value={doc.contributor}
                onChange={(e) => merge({ contributor: e.target.value })}
                className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all focus:ring-2"
                style={{ background: `${colors.ana6}cc`, border: `1px solid ${colors.ana5}`, color: colors.ana2 }}
              />
              <input
                type="text"
                placeholder="Add a caption (optional)"
                value={doc.caption}
                onChange={(e) => merge({ caption: e.target.value })}
                className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all focus:ring-2"
                style={{ background: `${colors.ana6}cc`, border: `1px solid ${colors.ana5}`, color: colors.ana2 }}
              />
              <button
                type="submit"
                disabled={!doc.imageData || !doc.contributor.trim()}
                className="w-full py-4 rounded-xl text-base font-medium transition-all disabled:opacity-40 hover:scale-[1.02]"
                style={{ background: colors.ana1, color: colors.ana6, boxShadow: `0 4px 20px ${colors.ana1}4d` }}
              >
                Share Photo
              </button>
            </form>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: `${colors.ana5}80`, color: colors.ana2 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setLightboxPhoto(null)}>
          <div className="absolute inset-0" style={{ background: "oklch(15% 0.05 252 / 0.9)", backdropFilter: "blur(20px)" }} />
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={lightboxPhoto.imageData}
              alt={lightboxPhoto.caption || "Wedding moment"}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}
            />
            <div className="mt-6 text-center">
              <p className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: colors.ana6 }}>
                by {lightboxPhoto.contributor}
              </p>
              {lightboxPhoto.caption && (
                <p className="mt-2 text-sm opacity-70" style={{ color: colors.ana5 }}>{lightboxPhoto.caption}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", color: colors.ana6 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
