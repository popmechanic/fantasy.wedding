import React, { useState, useRef } from "react";
import { useFireproof } from "use-fireproof";

export default function App() {
  const { useLiveQuery, useDocument, database } = useFireproof("fantasy-wedding-db");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Form for new photo upload
  const { doc, merge, submit, reset } = useDocument({
    name: "",
    caption: "",
    imageData: "",
    type: "photo",
    uploadedAt: ""
  });

  // Get all photos, newest first
  const { docs: photos } = useLiveQuery("type", { key: "photo" });
  const sortedPhotos = [...photos].sort((a, b) =>
    new Date(b.uploadedAt) - new Date(a.uploadedAt)
  );

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = async (e) => {
        await database.put({
          type: "photo",
          name: doc.name || "A Guest",
          caption: "",
          imageData: e.target.result,
          uploadedAt: new Date().toISOString()
        });
      };
      reader.readAsDataURL(file);
    }

    setTimeout(() => {
      setUploading(false);
      reset();
    }, 500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const deletePhoto = async (id) => {
    await database.del(id);
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.02_90)]">
      {/* Header */}
      <header className="text-center py-8 px-4 border-b-4 border-[oklch(0.9_0.03_30)]">
        <h1 className="text-4xl md:text-5xl font-serif text-[oklch(0.25_0.05_350)] mb-2">
          Fantasy Wedding
        </h1>
        <p className="text-[oklch(0.5_0.05_350)] text-lg">
          Share your photos from our special day
        </p>
      </header>

      {/* Upload Section */}
      <div className="max-w-2xl mx-auto p-4 mt-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            p-8 border-4 border-dashed cursor-pointer transition-all duration-200
            ${dragOver
              ? 'border-[oklch(0.6_0.2_30)] bg-[oklch(0.95_0.05_30)]'
              : 'border-[oklch(0.8_0.05_30)] bg-white hover:border-[oklch(0.7_0.1_30)]'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          <div className="text-center">
            <div className="text-5xl mb-4">📸</div>
            {uploading ? (
              <p className="text-[oklch(0.5_0.1_30)] font-medium animate-pulse">
                Uploading...
              </p>
            ) : (
              <>
                <p className="text-[oklch(0.4_0.05_350)] font-medium text-lg mb-2">
                  Tap to add photos
                </p>
                <p className="text-[oklch(0.6_0.03_350)] text-sm">
                  or drag and drop images here
                </p>
              </>
            )}
          </div>
        </div>

        {/* Optional: Your name */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={doc.name}
            onChange={(e) => merge({ name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[oklch(0.85_0.03_30)] bg-white text-[oklch(0.3_0.05_350)] placeholder-[oklch(0.7_0.02_350)] focus:outline-none focus:border-[oklch(0.7_0.15_30)]"
          />
        </div>
      </div>

      {/* Photo Count */}
      <div className="text-center py-6">
        <span className="inline-block px-6 py-2 bg-[oklch(0.7_0.15_30)] text-white font-medium">
          {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'} Shared
        </span>
      </div>

      {/* Gallery Grid */}
      <div className="px-4 pb-8">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-6xl mx-auto">
          {sortedPhotos.map((photo) => (
            <div
              key={photo._id}
              onClick={() => setSelectedPhoto(photo)}
              className="mb-4 break-inside-avoid cursor-pointer group"
            >
              <div className="relative overflow-hidden bg-white border-4 border-[oklch(0.9_0.03_30)] shadow-[4px_4px_0px_oklch(0.85_0.05_30)] hover:shadow-[2px_2px_0px_oklch(0.85_0.05_30)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150">
                <img
                  src={photo.imageData}
                  alt={`Photo by ${photo.name}`}
                  className="w-full block"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium truncate">
                    {photo.name || "A Guest"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-16 text-[oklch(0.6_0.03_350)]">
            <p className="text-xl mb-2">No photos yet!</p>
            <p>Be the first to share a moment from the wedding.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.imageData}
              alt={`Photo by ${selectedPhoto.name}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="p-4 bg-white border-t-4 border-[oklch(0.9_0.03_30)]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-[oklch(0.3_0.05_350)]">
                    {selectedPhoto.name || "A Guest"}
                  </p>
                  <p className="text-sm text-[oklch(0.6_0.03_350)]">
                    {new Date(selectedPhoto.uploadedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => deletePhoto(selectedPhoto._id)}
                  className="px-4 py-2 text-[oklch(0.5_0.15_30)] hover:text-[oklch(0.4_0.2_30)] font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white text-4xl font-light hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
