import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { getSocket } from '../../socket/socket';
import { useAuthStore } from '../../store/auth.store';
import styles from './Killer.module.scss';

interface Assignment {
  id: string;
  isEliminated: boolean;
  target: { id: string; displayName: string };
  mission: { description: string } | null;
  game: { id: string; showLeaderboard: boolean };
}

interface PendingRequest {
  id: string;
  killerId: string;
}

interface LeaderboardPlayer {
  player: { id: string; displayName: string };
  isAlive: boolean;
  eliminatedAt: string | null;
}

export default function Killer() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [assignment, setAssignment]           = useState<Assignment | null>(null);
  const [pending, setPending]                 = useState<PendingRequest | null>(null);
  const [leaderboard, setLeaderboard]         = useState<LeaderboardPlayer[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameStatus, setGameStatus]           = useState<string>('IDLE');
  const [gameId, setGameId]                   = useState<string | null>(null);
  const [loading, setLoading]                 = useState(true);
  const [eliminating, setEliminating]         = useState(false);
  const [eliminationSent, setEliminationSent] = useState(false);
  const [winner, setWinner]                   = useState<string | null>(null);

  async function fetchData() {
    try {
      const r = await api.get('/killer/assignment/me');
      if (r.data) {
        setAssignment(r.data.assignment);
        setPending(r.data.pendingRequest);

        const gId = r.data.assignment?.game?.id;
        if (gId) {
          setGameId(gId);
          const lb = await api.get(`/killer/game/${gId}/leaderboard`);
          setLeaderboard(lb.data.players);
          setShowLeaderboard(lb.data.showLeaderboard);
          setGameStatus(lb.data.status);

          if (lb.data.status === 'FINISHED') {
            const w = lb.data.players.find((p: LeaderboardPlayer) => p.isAlive);
            if (w) setWinner(w.player.displayName);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const socket = getSocket();
    socket.connect();
    socket.on('killer:update', (data: { type: string; targetId?: string }) => {
      if (data.type === 'elimination_request' && data.targetId === user?.id) {
        fetchData();
      } else {
        fetchData();
      }
    });
    return () => { socket.off('killer:update'); socket.disconnect(); };
  }, []);

  async function handleEliminate() {
    setEliminating(true);
    try {
      await api.post('/killer/eliminate');
      setEliminationSent(true);
    } catch (e: any) {
      alert(e.response?.data?.message ?? 'Erreur');
    } finally {
      setEliminating(false);
    }
  }

  async function resolveRequest(confirm: boolean) {
    if (!pending) return;
    await api.post('/killer/eliminate/resolve', { requestId: pending.id, confirm });
    setPending(null);
    setEliminationSent(false);
    fetchData();
  }

  if (loading) return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Killer 🎯</h1>
      </div>
      <div className={styles.waiting}>
        <span className={styles.icon}>⏳</span>
        <h2>Chargement...</h2>
      </div>
    </div>
  );

  if (!assignment) return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Killer 🎯</h1>
      </div>
      <div className={styles.waiting}>
        <span className={styles.icon}>🎯</span>
        <h2>La partie n'a pas encore commencé</h2>
        <p>L'admin lancera la partie pendant la soirée.<br />Reste à l'affût !</p>
      </div>
    </div>
  );

  // ─── PARTIE TERMINÉE ──────────────────────────────────────────────────────
  if (gameStatus === 'FINISHED') return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Killer 🎯</h1>
      </div>
      <div className={styles.winner}>
        <span className={styles.icon}>🏆</span>
        <h2>Partie terminée !</h2>
        {winner && <p className={styles.name}>Gagnant : {winner} 🎉</p>}
      </div>

      {leaderboard.length > 0 && (
        <div className={styles.leaderboard}>
          <p className={styles.sectionTitle}>Classement final</p>
          {[...leaderboard]
            .sort((a, b) => {
              if (a.isAlive) return -1;
              if (b.isAlive) return 1;
              return new Date(b.eliminatedAt ?? 0).getTime() - new Date(a.eliminatedAt ?? 0).getTime();
            })
            .map((p, i) => (
              <div key={p.player.id} className={styles.player}>
                <span className={styles.rank}>#{i + 1}</span>
                <span className={styles.name}>{p.player.displayName}</span>
                {p.isAlive
                  ? <span className={styles.alive}>🏆 Gagnant</span>
                  : <span className={styles.dead}>💀 Éliminé</span>
                }
              </div>
            ))}
        </div>
      )}
    </div>
  );

  // ─── JOUEUR ÉLIMINÉ ───────────────────────────────────────────────────────
  if (assignment.isEliminated) return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Killer 🎯</h1>
      </div>
      <div className={styles.eliminated}>
        <span className={styles.icon}>💀</span>
        <h2>Tu as été éliminé !</h2>
        <p>Mieux vaut être plus discret la prochaine fois...</p>
      </div>
      {showLeaderboard && leaderboard.length > 0 && (
        <div className={styles.leaderboard}>
          <p className={styles.sectionTitle}>Survivants restants</p>
          {leaderboard.map(p => (
            <div key={p.player.id} className={styles.player}>
              <span className={styles.name}>{p.player.displayName}</span>
              {p.isAlive
                ? <span className={styles.alive}>✅ En vie</span>
                : <span className={styles.dead}>💀 Éliminé</span>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── EN ATTENTE DE CONFIRMATION ───────────────────────────────────────────
  if (eliminationSent) return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Killer 🎯</h1>
      </div>
      <div className={styles.waiting}>
        <span className={styles.icon}>⏳</span>
        <h2>En attente de confirmation</h2>
        <p>
          <strong>{assignment.target.displayName}</strong> doit confirmer
          l'élimination sur son téléphone.
        </p>
      </div>
      <div style={{ marginTop: 24 }}>
        <button
          className="btn btn--ghost"
          onClick={() => { setEliminationSent(false); fetchData(); }}
        >
          Annuler la demande
        </button>
      </div>
    </div>
  );

  // ─── JEU EN COURS ─────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Killer 🎯</h1>
      </div>

      {/* Demande d'élimination reçue */}
      {pending && (
        <div className={styles['pending-request']}>
          <span className={styles.icon}>⚠️</span>
          <h3>Quelqu'un prétend t'avoir éliminé !</h3>
          <p>Confirmes-tu avoir été éliminé ?</p>
          <div className={styles.actions}>
            <button className="btn btn--danger" onClick={() => resolveRequest(true)}>
              Oui, j'ai perdu 💀
            </button>
            <button className="btn btn--ghost" onClick={() => resolveRequest(false)}>
              Non, c'est faux !
            </button>
          </div>
        </div>
      )}

      {/* Ta cible */}
      <div className={styles['target-card']}>
        <p className={styles.label}>Ta cible</p>
        <p className={styles['target-name']}>{assignment.target.displayName}</p>
        <span className={styles['alive-badge']}>✅ En vie</span>
      </div>

      {/* Mission */}
      {assignment.mission && (
        <div className={styles['mission-card']}>
          <p className={styles['mission-label']}>🎯 Ta mission</p>
          <p className={styles['mission-text']}>{assignment.mission.description}</p>
        </div>
      )}

      {/* Bouton éliminer */}
      <button
        className="btn btn--primary"
        onClick={handleEliminate}
        disabled={eliminating}
      >
        {eliminating ? '⏳ Envoi...' : '🎯 J\'ai éliminé ma cible !'}
      </button>

      <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 10 }}>
        Ta cible devra confirmer sur son téléphone
      </p>

      {/* Leaderboard si activé */}
      {showLeaderboard && leaderboard.length > 0 && (
        <div className={styles.leaderboard}>
          <p className={styles.sectionTitle}>Survivants</p>
          {leaderboard.map(p => (
            <div key={p.player.id} className={styles.player}>
              <span className={styles.name}>{p.player.displayName}</span>
              {p.isAlive
                ? <span className={styles.alive}>✅ En vie</span>
                : <span className={styles.dead}>💀 Éliminé</span>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
