import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../api/client';
import styles from './Dashboard.module.scss';

interface RsvpData { status: string | null }
interface FoodData  { diet: string | null }

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export default function Dashboard() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [rsvp, setRsvp] = useState<RsvpData | null>(null);
  const [food, setFood] = useState<FoodData | null>(null);
  const time = useCountdown(new Date('2026-04-25T18:00:00'));

  useEffect(() => {
    api.get('/rsvp/me').then(r  => setRsvp(r.data)).catch(() => {});
    api.get('/food/me').then(r  => setFood(r.data)).catch(() => {});
  }, []);

  function logout() {
    clearAuth();
    navigate('/login');
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  const rsvpStatus = () => {
    if (!rsvp) return { label: 'À compléter', variant: 'pending' };
    if (rsvp.status === 'CONFIRMED') return { label: 'Présent ✓',   variant: 'done' };
    if (rsvp.status === 'DECLINED')  return { label: 'Absent',      variant: 'pending' };
    if (rsvp.status === 'MAYBE')     return { label: 'Peut-être',   variant: 'pending' };
    return { label: 'À compléter', variant: 'pending' };
  };

  const tiles = [
    { id: 'rsvp',   icon: '✅', name: 'Présence',      route: '/rsvp',          status: rsvpStatus() },
    { id: 'food',   icon: '🍽️', name: 'Régime',        route: '/food',          status: { label: food ? 'Renseigné ✓' : 'À compléter', variant: food ? 'done' : 'pending' } },
    { id: 'wall',   icon: '💬', name: 'Mur',           route: '/wall',          status: { label: 'Écrire un message', variant: '' } },
    { id: 'media',  icon: '📸', name: 'Photos',        route: '/media',         status: { label: 'Uploader des souvenirs', variant: '' } },
    { id: 'killer', icon: '🎯', name: 'Killer',        route: '/killer',        status: { label: 'Voir ta cible', variant: '' } },
    { id: 'quiz',   icon: '📝', name: 'Questionnaire', route: '/questionnaire', status: { label: 'Répondre', variant: '' } },
    { id: 'anecdotes', icon: '🎭', name: 'Anecdotes', route: '/anecdotes', status: { label: 'Vrai ou faux ?', variant: '' } },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.greeting}>
          <h1>Bonjour {user?.displayName} 👋</h1>
          <p>Anniversaire d'Antoine — 25 avril</p>
        </div>
        <button className={styles.logout} onClick={logout}>Déco</button>
      </div>

      {/* Compte à rebours */}
      <div className={styles.countdown}>
        <p className={styles.label}>La fête commence dans</p>
        <div className={styles.units}>
          <div className={styles.unit}>
            <span className={styles.value}>{time.days}</span>
            <span className={styles.name}>jours</span>
          </div>
          <span className={styles.separator}>:</span>
          <div className={styles.unit}>
            <span className={styles.value}>{pad(time.hours)}</span>
            <span className={styles.name}>heures</span>
          </div>
          <span className={styles.separator}>:</span>
          <div className={styles.unit}>
            <span className={styles.value}>{pad(time.minutes)}</span>
            <span className={styles.name}>min</span>
          </div>
          <span className={styles.separator}>:</span>
          <div className={styles.unit}>
            <span className={styles.value}>{pad(time.seconds)}</span>
            <span className={styles.name}>sec</span>
          </div>
        </div>
        {time.days === 0 && time.hours === 0 && <p className={styles.party}>🎉 C'est aujourd'hui !</p>}
      </div>

      <p className={styles.sectionTitle}>Mes actions</p>

      <div className={styles.grid}>
        {tiles.map(tile => (
          <div
            key={tile.id}
            className={`${styles.tile} ${tile.status.variant === 'done' ? styles['tile--done'] : tile.status.variant === 'pending' ? styles['tile--pending'] : ''}`}
            onClick={() => navigate(tile.route)}
          >
            <span className={styles.icon}>{tile.icon}</span>
            <span className={styles.name}>{tile.name}</span>
            <span className={styles.status}>{tile.status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
