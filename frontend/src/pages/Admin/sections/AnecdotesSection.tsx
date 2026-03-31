import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface Anecdote {
  id: string;
  content: string;
  isTrue: boolean;
  user: { id: string; displayName: string };
}

export default function AnecdotesSection() {
  const [anecdotes, setAnecdotes] = useState<Anecdote[]>([]);

  async function load() {
    api.get('/anecdotes').then(r => setAnecdotes(r.data)).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette anecdote ?')) return;
    await api.delete(`/anecdotes/${id}`);
    load();
  }

  return (
    <div>
      <div style={{marginBottom: 16}}>
        <button
          className="btn btn--primary"
          onClick={() => window.open('/screen/anecdotes', '_blank')}
        >
          📺 Lancer le jeu anecdotes (plein écran)
        </button>
      </div>

      <p className={styles.sectionLabel}>{anecdotes.length} anecdote{anecdotes.length > 1 ? 's' : ''} soumises</p>

      <div className={styles.list}>
        {anecdotes.map(a => (
          <div key={a.id} className={styles.row} style={{alignItems:'flex-start', gap:10}}>
            <div style={{flex:1}}>
              <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
                <span className={`badge badge--${a.isTrue ? 'green' : 'red'}`}>
                  {a.isTrue ? '✅ Vrai' : '❌ Faux'}
                </span>
                <span style={{fontSize:12, color:'#6B7280'}}>par {a.user.displayName}</span>
              </div>
              <p className={styles.rowName} style={{fontSize:13, fontWeight:400}}>{a.content}</p>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              style={{color:'#DC2626', background:'none', border:'none', cursor:'pointer', fontSize:16, flexShrink:0}}
            >
              🗑️
            </button>
          </div>
        ))}
        {anecdotes.length === 0 && <p className={styles.empty}>Aucune anecdote soumise pour l'instant</p>}
      </div>
    </div>
  );
}
