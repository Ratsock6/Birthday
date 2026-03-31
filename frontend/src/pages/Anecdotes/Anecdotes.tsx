import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import styles from './Anecdotes.module.scss';

interface Anecdote { id: string; content: string; isTrue: boolean; createdAt: string }

export default function Anecdotes() {
  const navigate = useNavigate();
  const [content, setContent]   = useState('');
  const [isTrue, setIsTrue]     = useState<boolean | null>(null);
  const [mine, setMine]         = useState<Anecdote[]>([]);
  const [saving, setSaving]     = useState(false);
  const [flash, setFlash]       = useState('');

  async function load() {
    api.get('/anecdotes/me').then(r => setMine(r.data)).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isTrue === null) return;
    setSaving(true);
    try {
      await api.post('/anecdotes', { content, isTrue });
      setContent('');
      setIsTrue(null);
      setFlash('Anecdote ajoutée !');
      setTimeout(() => setFlash(''), 3000);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Anecdotes 🎭</h1>
      </div>

      {flash && <div className={styles.success}>✅ {flash}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Ton anecdote avec Antoine</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Ex: Un jour, Antoine et moi avons manqué notre train et..."
            style={{ resize: 'none', height: 120 }}
            maxLength={500}
            required
          />
        </div>

        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 10 }}>
            C'est vrai ou faux ?
          </p>
          <div className={styles.toggle}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${isTrue === true ? styles['toggleBtn--true'] : ''}`}
              onClick={() => setIsTrue(true)}
            >
              <span className={styles.icon}>✅</span>
              <span className={styles.label}>C'est vrai !</span>
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${isTrue === false ? styles['toggleBtn--false'] : ''}`}
              onClick={() => setIsTrue(false)}
            >
              <span className={styles.icon}>❌</span>
              <span className={styles.label}>C'est faux !</span>
            </button>
          </div>
        </div>

        <p className={styles.hint}>
          👀 Seul l'admin verra si c'est vrai ou faux — révélation pendant la journée !
        </p>

        <button
          className="btn btn--primary"
          type="submit"
          disabled={saving || isTrue === null || !content.trim()}
        >
          {saving ? 'Envoi...' : '🎭 Soumettre l\'anecdote'}
        </button>
      </form>

      {mine.length > 0 && (
        <>
          <p className={styles.sectionTitle}>Mes anecdotes ({mine.length})</p>
          <div className={styles.list}>
            {mine.map(a => (
              <div key={a.id} className={styles.card}>
                <span className={`badge ${a.isTrue ? 'badge--green' : 'badge--red'}`}>
                  {a.isTrue ? 'Vrai' : 'Faux'}
                </span>
                <p className={styles.content}>{a.content}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {mine.length === 0 && !flash && (
        <div className={styles.empty}>
          <span className={styles.icon}>🎭</span>
          <p>Aucune anecdote pour l'instant.<br />Sois le premier à en soumettre une !</p>
        </div>
      )}
    </div>
  );
}
