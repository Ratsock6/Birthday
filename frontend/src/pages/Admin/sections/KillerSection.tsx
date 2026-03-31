import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface Game { id: string; status: string; showLeaderboard: boolean; participants: { userId: string; user: { displayName: string } }[] }
interface Mission { id: string; description: string; isActive: boolean }
interface User { id: string; displayName: string; username: string }

export default function KillerSection() {
  const [game, setGame]         = useState<Game | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [users, setUsers]       = useState<User[]>([]);
  const [newMission, setNewMission] = useState('');
  const [loading, setLoading]   = useState(false);

  async function load() {
    const [g, m, u] = await Promise.all([
      api.get('/killer/game'),
      api.get('/killer/missions'),
      api.get('/users'),
    ]);
    setGame(g.data);
    setMissions(m.data);
    setUsers(u.data.filter((u: any) => u.role === 'GUEST'));
  }

  useEffect(() => { load(); }, []);

  async function addMission(e: React.FormEvent) {
    e.preventDefault();
    if (!newMission.trim()) return;
    await api.post('/killer/missions', { description: newMission });
    setNewMission('');
    load();
  }

  async function deleteMission(id: string) {
    await api.delete(`/killer/missions/${id}`);
    load();
  }

  async function toggleParticipant(userId: string) {
    if (!game) return;
    await api.post(`/killer/game/${game.id}/participants`, { userId });
    load();
  }

  async function startGame() {
    if (!game) return;
    setLoading(true);
    try {
      await api.post(`/killer/game/${game.id}/start`);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message ?? 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function resetGame() {
    if (!game || !confirm('Réinitialiser la partie ?')) return;
    await api.post(`/killer/game/${game.id}/reset`);
    load();
  }

  async function toggleLeaderboard() {
    if (!game) return;
    await api.patch(`/killer/game/${game.id}/settings`, { showLeaderboard: !game.showLeaderboard });
    load();
  }

  const participantIds = game?.participants?.map(p => p.userId) ?? [];

  return (
    <div>
      {/* Statut */}
      <div className={styles.statusBar}>
        <span>Statut : </span>
        <span className={`badge badge--${game?.status === 'RUNNING' ? 'green' : game?.status === 'FINISHED' ? 'gray' : 'yellow'}`}>
          {game?.status === 'RUNNING' ? '▶ En cours' : game?.status === 'FINISHED' ? '✓ Terminée' : '⏸ En attente'}
        </span>
      </div>

      {/* Paramètres */}
      {game && (
        <div className={styles.row} style={{marginBottom:16}}>
          <span className={styles.rowName}>Afficher le classement</span>
          <button
            className={`btn ${game.showLeaderboard ? 'btn--primary' : 'btn--ghost'}`}
            style={{width:'auto', padding:'6px 14px'}}
            onClick={toggleLeaderboard}
          >
            {game.showLeaderboard ? 'Activé' : 'Désactivé'}
          </button>
        </div>
      )}

      {/* Participants */}
      {game?.status === 'IDLE' && (
        <>
          <p className={styles.sectionLabel}>Participants ({participantIds.length})</p>
          <div className={styles.list}>
            {users.map(u => {
              const isIn = participantIds.includes(u.id);
              return (
                <div key={u.id} className={styles.row}>
                  <span className={styles.rowName}>{u.displayName}</span>
                  <button
                    className={`btn ${isIn ? 'btn--primary' : 'btn--ghost'}`}
                    style={{width:'auto', padding:'6px 14px', fontSize:13}}
                    onClick={() => toggleParticipant(u.id)}
                  >
                    {isIn ? '✓ Dedans' : '+ Ajouter'}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{display:'flex', gap:10, marginTop:16}}>
            <button className="btn btn--primary" onClick={startGame} disabled={loading}>
              {loading ? 'Lancement...' : '🎯 Lancer la partie'}
            </button>
          </div>
        </>
      )}

      {game?.status === 'RUNNING' && (
        <button className="btn btn--danger" style={{marginBottom:16}} onClick={resetGame}>
          🔄 Réinitialiser la partie
        </button>
      )}

      {/* Missions */}
      <p className={styles.sectionLabel} style={{marginTop:24}}>Missions ({missions.length})</p>
      <form onSubmit={addMission} style={{display:'flex', gap:8, marginBottom:12}}>
        <input
          className="input-group input"
          style={{flex:1, padding:'10px 14px', border:'1px solid #E5E7EB', borderRadius:8, fontSize:14}}
          value={newMission}
          onChange={e => setNewMission(e.target.value)}
          placeholder="Nouvelle mission..."
        />
        <button className="btn btn--secondary" style={{width:'auto', padding:'10px 16px'}} type="submit">+</button>
      </form>
      <div className={styles.list}>
        {missions.map(m => (
          <div key={m.id} className={styles.row}>
            <span className={styles.rowName} style={{fontSize:13}}>{m.description}</span>
            <button onClick={() => deleteMission(m.id)} style={{color:'#DC2626', background:'none', border:'none', cursor:'pointer', fontSize:16}}>🗑️</button>
          </div>
        ))}
        {missions.length === 0 && <p className={styles.empty}>Aucune mission créée</p>}
      </div>
    </div>
  );
}
