import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface MediaItem { id: string; url: string; type: string; originalName: string; user: { displayName: string } }

export default function MediaSection() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [slideshow, setSlideshow] = useState(false);
  const [current, setCurrent]     = useState(0);

  useEffect(() => { api.get('/media').then(r => setItems(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    if (!slideshow) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [slideshow, items.length]);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce média ?')) return;
    await api.delete(`/media/${id}`);
    setItems(prev => prev.filter(m => m.id !== id));
  }

  const base = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

  if (slideshow && items.length > 0) return (
    <div style={{position:'fixed',inset:0,background:'#000',zIndex:999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <button onClick={() => setSlideshow(false)} style={{position:'absolute',top:16,right:16,color:'white',fontSize:24,background:'none',border:'none',cursor:'pointer'}}>✕</button>
      {items[current].type === 'PHOTO'
        ? <img src={`${base}${items[current].url}`} style={{maxWidth:'100%',maxHeight:'90vh',objectFit:'contain'}} />
        : <video src={`${base}${items[current].url}`} autoPlay muted style={{maxWidth:'100%',maxHeight:'90vh'}} />
      }
      <p style={{color:'white',marginTop:12,fontSize:13}}>{items[current].user.displayName} — {current+1}/{items.length}</p>
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <button onClick={() => setCurrent(c => (c - 1 + items.length) % items.length)} style={{color:'white',fontSize:24,background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer'}}>←</button>
        <button onClick={() => setCurrent(c => (c + 1) % items.length)} style={{color:'white',fontSize:24,background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer'}}>→</button>
      </div>
    </div>
  );

  return (
    <div>
      {items.length > 0 && (
        <button className="btn btn--primary" style={{marginBottom:16}} onClick={() => { setCurrent(0); setSlideshow(true); }}>
          ▶ Lancer le diaporama ({items.length} médias)
        </button>
      )}
      <div className={styles.mediaGrid}>
        {items.map(item => (
          <div key={item.id} className={styles.mediaItem}>
            {item.type === 'PHOTO'
              ? <img src={`${base}${item.url}`} alt={item.originalName} />
              : <div className={styles.videoThumb}><span>▶️</span><span>{item.originalName}</span></div>
            }
            <div className={styles.mediaOverlay}>
              <span>{item.user.displayName}</span>
              <button onClick={() => handleDelete(item.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className={styles.empty}>Aucun média uploadé</p>}
    </div>
  );
}
