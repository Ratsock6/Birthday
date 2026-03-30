import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import styles from './Rsvp.module.scss';

type Status = 'CONFIRMED' | 'DECLINED' | 'MAYBE';

const OPTIONS = [
  { value: 'CONFIRMED' as Status, icon: '🎉', label: 'Présent(e)',  desc: "J'y serai avec plaisir !" },
  { value: 'MAYBE'     as Status, icon: '🤔', label: 'Peut-être',   desc: "Je ne suis pas encore sûr(e)" },
  { value: 'DECLINED'  as Status, icon: '😢', label: 'Absent(e)',   desc: "Je ne pourrai pas venir" },
];

export default function Rsvp() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Status | null>(null);
  const [note, setNote]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    api.get('/rsvp/me').then(r => {
      if (r.data) {
        setSelected(r.data.status);
        setNote(r.data.note ?? '');
      }
    }).catch(() => {});
  }, []);

  async function handleSave() {
    if (!selected) return;
    setLoading(true);
    try {
      await api.put('/rsvp/me', { status: selected, note });
      setSaved(true);
    } finally {
      setLoading(false);
    }
  }

  if (saved) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <span className={styles.emoji}>
            {selected === 'CONFIRMED' ? '🎉' : selected === 'MAYBE' ? '🤔' : '😢'}
          </span>
          <h2>
            {selected === 'CONFIRMED' ? 'À très bientôt !' : selected === 'MAYBE' ? 'On attend ta réponse !' : 'Dommage...'}
          </h2>
          <p>
            {selected === 'CONFIRMED'
              ? 'Ta présence a bien été enregistrée.'
              : selected === 'MAYBE'
              ? 'N\'oublie pas de confirmer dès que tu sais !'
              : 'Ta réponse a bien été enregistrée.'}
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/dashboard')}>
            Retour au menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Confirmer ma présence</h1>
      </div>

      <div className={styles.options}>
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`${styles.option} ${selected === opt.value ? styles[`option--selected-${opt.value.toLowerCase()}`] : ''}`}
            onClick={() => setSelected(opt.value)}
          >
            <span className={styles.icon}>{opt.icon}</span>
            <span className={styles.text}>
              <span className={styles.label}>{opt.label}</span>
              <span className={styles.desc}>{opt.desc}</span>
            </span>
            {selected === opt.value && <span style={{ marginLeft: 'auto', fontSize: 18 }}>✓</span>}
          </button>
        ))}
      </div>

      <div className={`input-group ${styles.note}`}>
        <label>Un mot pour Antoine ? (optionnel)</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Ex: J'amène le dessert ! 🍰"
        />
      </div>

      <button
        className="btn btn--primary"
        onClick={handleSave}
        disabled={!selected || loading}
      >
        {loading ? 'Enregistrement...' : 'Confirmer ma réponse'}
      </button>
    </div>
  );
}
