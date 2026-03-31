import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import styles from './AnecdotesScreen.module.scss';

interface Anecdote {
  id: string;
  content: string;
  isTrue: boolean;
  user: { displayName: string };
}

export default function AnecdotesScreen() {
  const [anecdotes, setAnecdotes] = useState<Anecdote[]>([]);
  const [idx, setIdx]             = useState(0);
  const [revealed, setRevealed]   = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/anecdotes').then(r => {
      // Mélange aléatoire
      const shuffled = [...r.data].sort(() => Math.random() - 0.5);
      setAnecdotes(shuffled);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function next() {
    setRevealed(false);
    setIdx(i => i + 1);
  }

  if (loading) return (
    <div className={styles.screen}>
      <p className={styles.empty}>Chargement...</p>
    </div>
  );

  if (anecdotes.length === 0) return (
    <div className={styles.screen}>
      <p className={styles.empty}>🎭 Aucune anecdote soumise</p>
    </div>
  );

  if (idx >= anecdotes.length) return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <p style={{fontSize:56, marginBottom:16}}>🎉</p>
        <p style={{fontSize:28, fontWeight:700, color:'white', marginBottom:12}}>
          Fin du jeu !
        </p>
        <p style={{color:'rgba(255,255,255,0.5)', fontSize:16}}>
          {anecdotes.length} anecdotes révélées
        </p>
      </div>
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles['btn--reveal']}`} onClick={() => { setIdx(0); setRevealed(false); }}>
          🔄 Recommencer
        </button>
      </div>
    </div>
  );

  const current = anecdotes[idx];
  const progress = ((idx) / anecdotes.length) * 100;

  return (
    <div className={styles.screen}>
      <p className={styles.counter}>{idx + 1} / {anecdotes.length}</p>

      <div className={styles.card}>
        <p className={styles.question}>🎭 Vrai ou Faux ?</p>
        <p className={styles.content}>"{current.content}"</p>

        {revealed && (
          <div className={styles.reveal}>
            <p className={styles.author}>
              Soumis par <span>{current.user.displayName}</span>
            </p>
            <div className={`${styles.verdict} ${current.isTrue ? styles['verdict--true'] : styles['verdict--false']}`}>
              {current.isTrue ? '✅ C\'est VRAI !' : '❌ C\'est FAUX !'}
            </div>
            {current.isTrue && (
              <p className={styles.hint}>
                🎤 {current.user.displayName}, raconte-nous la suite !
              </p>
            )}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {!revealed ? (
          <>
            <button className={`${styles.btn} ${styles['btn--reveal']}`} onClick={() => setRevealed(true)}>
              👁️ Révéler
            </button>
            <button className={`${styles.btn} ${styles['btn--skip']}`} onClick={next}>
              Passer →
            </button>
          </>
        ) : (
          <button className={`${styles.btn} ${styles['btn--next']}`} onClick={next}>
            Suivante →
          </button>
        )}
      </div>

      <div className={styles.progress}>
        <div className={styles.bar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
