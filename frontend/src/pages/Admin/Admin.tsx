import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import RsvpSection from './sections/RsvpSection';
import UsersSection from './sections/UsersSection';
import FoodSection from './sections/FoodSection';
import MediaSection from './sections/MediaSection';
import KillerSection from './sections/KillerSection';
import QuestionnaireSection from './sections/QuestionnaireSection';
import ScreensSection from './sections/ScreensSection';
import AnecdotesSection from './sections/AnecdotesSection';
import styles from './Admin.module.scss';

const TABS = [
  { id: 'rsvp',       label: '✅ RSVP'      },
  { id: 'users',      label: '👥 Invités'   },
  { id: 'food',       label: '🍽️ Régimes'  },
  { id: 'media',      label: '📸 Médias'    },
  { id: 'killer',     label: '🎯 Killer'    },
  { id: 'quiz',       label: '📝 Quiz'      },
  { id: 'anecdotes',  label: '🎭 Anecdotes' },
  { id: 'screens',    label: '📺 Écrans'    },
];

export default function Admin() {
  const [tab, setTab] = useState('rsvp');
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  function logout() { clearAuth(); navigate('/login'); }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Panel Admin 🎂</h1>
        <button className={styles.logout} onClick={logout}>Déco</button>
      </div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles['tab--active'] : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'rsvp'      && <RsvpSection />}
        {tab === 'users'     && <UsersSection />}
        {tab === 'food'      && <FoodSection />}
        {tab === 'media'     && <MediaSection />}
        {tab === 'killer'    && <KillerSection />}
        {tab === 'quiz'      && <QuestionnaireSection />}
        {tab === 'anecdotes' && <AnecdotesSection />}
        {tab === 'screens'   && <ScreensSection />}
      </div>
    </div>
  );
}
