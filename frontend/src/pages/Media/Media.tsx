import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { getSocket } from '../../socket/socket';
import styles from './Media.module.scss';

interface MediaItem {
  id: string;
  url: string;
  type: 'PHOTO' | 'VIDEO';
  originalName: string;
  user: { id: string; displayName: string };
}

export default function Media() {
  const navigate  = useNavigate();
  const inputRef  = useRef<HTMLInputElement>(null);
  const [items, setItems]       = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [dragOver, setDragOver]   = useState(false);

  useEffect(() => {
    api.get('/media').then(r => setItems(r.data)).catch(() => {});

    const socket = getSocket();
    socket.connect();
    socket.on('media:new', (media: MediaItem) => {
      setItems(prev => [media, ...prev]);
    });
    return () => {
      socket.off('media:new');
      socket.disconnect();
    };
  }, []);

  async function uploadFile(file: File) {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    const form = new FormData();
    form.append('file', file);
    try {
      await api.post('/media/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Photos & Vidéos 📸</h1>
      </div>

      {/* Dropzone */}
      <div
        className={`${styles.dropzone} ${dragOver ? styles['dropzone--active'] : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <span className={styles.icon}>📁</span>
        <p className={styles.label}>Appuie pour ajouter une photo ou vidéo</p>
        <p className={styles.sub}>JPG, PNG, GIF, MP4, MOV — max 1 Go</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* Barre de progression */}
      {uploading && (
        <div className={styles.progress}>
          <p className={styles.label}>Upload en cours... {progress}%</p>
          <div className={styles['bar-wrap']}>
            <div className={styles.bar} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Galerie */}
      {items.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.icon}>🖼️</span>
          Aucun média pour l'instant — sois le premier !
        </div>
      ) : (
        <>
          <p className={styles['section-title']}>{items.length} média{items.length > 1 ? 's' : ''}</p>
          <div className={styles.grid}>
            {items.map(item => (
              <div key={item.id} className={styles.item}>
                {item.type === 'PHOTO' ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000'}${item.url}`}
                    alt={item.originalName}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles['video-thumb']}>
                    <span className={styles.play}>▶️</span>
                    <span className={styles.name}>{item.originalName}</span>
                  </div>
                )}
                <span className={styles.author}>{item.user.displayName}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
