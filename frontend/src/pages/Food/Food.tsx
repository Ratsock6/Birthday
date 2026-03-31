import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import styles from './Food.module.scss';

type DietType = 'NONE' | 'VEGETARIAN' | 'VEGAN' | 'HALAL' | 'KOSHER' | 'GLUTEN_FREE' | 'OTHER';

const DIETS: { value: DietType; icon: string; label: string }[] = [
  { value: 'NONE',        icon: '🍖', label: 'Pas de régime' },
  { value: 'VEGETARIAN',  icon: '🥗', label: 'Végétarien'   },
  { value: 'VEGAN',       icon: '🌱', label: 'Vegan'        },
  { value: 'HALAL',       icon: '☪️',  label: 'Halal'        },
  { value: 'KOSHER',      icon: '✡️',  label: 'Casher'       },
  { value: 'GLUTEN_FREE', icon: '🌾', label: 'Sans gluten'  },
  { value: 'OTHER',       icon: '🍽️', label: 'Autre'        },
];

const COMMON_ALLERGIES = [
  'Noix', 'Arachides', 'Lactose', 'Gluten', 'Oeufs',
  'Fruits de mer', 'Soja', 'Sésame',
];

export default function Food() {
  const navigate = useNavigate();
  const [diet, setDiet]           = useState<DietType>('NONE');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [details, setDetails]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    api.get('/food/me').then(r => {
      if (r.data) {
        setDiet(r.data.diet ?? 'NONE');
        setAllergies(r.data.allergies ?? []);
        setDetails(r.data.details ?? '');
      }
    }).catch(() => {});
  }, []);

  function toggleAllergy(a: string) {
    setAllergies(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  }

  async function handleSave() {
    setLoading(true);
    try {
      await api.put('/food/me', { diet, allergies, details });
      setSaved(true);
    } finally {
      setLoading(false);
    }
  }

  if (saved) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <span className={styles.emoji}>✅</span>
          <h2>Enregistré !</h2>
          <p>Tes préférences alimentaires ont bien été prises en compte.</p>
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
        <h1>Régime alimentaire</h1>
      </div>

      <p className={styles.sectionTitle}>Mon régime</p>
      <div className={styles.diets}>
        {DIETS.map(d => (
          <button
            key={d.value}
            className={`${styles.diet} ${diet === d.value ? styles['diet--selected'] : ''}`}
            onClick={() => setDiet(d.value)}
          >
            <span className={styles.icon}>{d.icon}</span>
            <span className={styles.label}>{d.label}</span>
          </button>
        ))}
      </div>

      <p className={styles.sectionTitle}>Allergies</p>
      <div className={styles.allergies}>
        {COMMON_ALLERGIES.map(a => (
          <button
            key={a}
            className={`${styles['allergy-tag']} ${allergies.includes(a) ? styles['allergy-tag--selected'] : ''}`}
            onClick={() => toggleAllergy(a)}
          >
            {allergies.includes(a) ? '✓ ' : ''}{a}
          </button>
        ))}
      </div>

      <div className={`input-group ${styles.details}`}>
        <label>Précisions supplémentaires (optionnel)</label>
        <textarea
          value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Ex: Intolérance au lactose sévère, éviter les traces..."
        />
      </div>

      <button className="btn btn--primary" onClick={handleSave} disabled={loading}>
        {loading ? 'Enregistrement...' : 'Sauvegarder'}
      </button>
    </div>
  );
}
