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

interface UploadJob {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  name: string;
}

export default function Media() {
  const navigate  = useNavigate();
  const inputRef  = useRef<HTMLInputElement>(null);
  const [items, setItems]   = useState<MediaItem[]>([]);
  const [jobs, setJobs]     = useState<UploadJob[]>([]);
  const [dragOver, setDragOver] = useState(false);

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

  async function uploadFile(file: File, index: number) {
    setJobs(prev => prev.map((j, i) =>
      i === index ? { ...j, status: 'uploading' } : j
    ));

    const form = new FormData();
    form.append('file', file);

    try {
      await api.post('/media/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => {
          if (e.total) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setJobs(prev => prev.map((j, i) =>
              i === index ? { ...j, progress } : j
            ));
          }
        },
      });
      setJobs(prev => prev.map((j, i) =>
        i === index ? { ...j, status: 'done', progress: 100 } : j
      ));
    } catch {
      setJobs(prev => prev.map((j, i) =>
        i === index ? { ...j, status: 'error' } : j
      ));
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const newJobs: UploadJob[] = Array.from(files).map(f => ({
      file: f,
      progress: 0,
      status: 'pending',
      name: f.name,
    }));

    const startIndex = jobs.length;
    setJobs(prev => [...prev, ...newJobs]);

    // Upload séquentiel pour ne pas saturer la connexion mobile
    for (let i = 0; i < newJobs.length; i++) {
      await uploadFile(newJobs[i].file, startIndex + i);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function clearDoneJobs() {
    setJobs(prev => prev.filter(j => j.status !== 'done'));
  }

  const activeJobs = jobs.filter(j => j.status !== 'done');
  const doneJobs   = jobs.filter(j => j.status === 'done');
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

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
        <p className={styles.label}>Appuie pour ajouter des photos ou vidéos</p>
        <p className={styles.sub}>Plusieurs fichiers possibles · JPG, PNG, MP4, MOV · max 1 Go</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          capture={undefined}
          onChange={e => handleFiles(e.target.files)}
          style={{display:'none'}}
        />
      </div>

      {/* File d'upload */}
      {jobs.length > 0 && (
        <div style={{marginBottom:20}}>
          {activeJobs.map((job, i) => (
            <div key={i} style={{marginBottom:8}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'#6B7280', marginBottom:4}}>
                <span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'70%'}}>
                  {job.status === 'uploading' ? '⬆️' : job.status === 'error' ? '❌' : '⏳'} {job.name}
                </span>
                <span>{job.status === 'error' ? 'Erreur' : `${job.progress}%`}</span>
              </div>
              <div style={{height:4, background:'#E5E7EB', borderRadius:999, overflow:'hidden'}}>
                <div style={{
                  height:'100%',
                  background: job.status === 'error' ? '#DC2626' : '#3B82F6',
                  borderRadius:999,
                  width:`${job.progress}%`,
                  transition:'width 0.3s'
                }}/>
              </div>
            </div>
          ))}

          {doneJobs.length > 0 && (
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8}}>
              <p style={{fontSize:13, color:'#16A34A'}}>
                ✅ {doneJobs.length} fichier{doneJobs.length > 1 ? 's' : ''} uploadé{doneJobs.length > 1 ? 's' : ''}
              </p>
              <button
                onClick={clearDoneJobs}
                style={{fontSize:12, color:'#9CA3AF', background:'none', border:'none', cursor:'pointer'}}
              >
                Effacer
              </button>
            </div>
          )}
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
                    src={`${base}${item.url}`}
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
