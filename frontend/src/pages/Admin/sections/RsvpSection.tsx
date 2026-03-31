import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface RsvpEntry {
  id: string;
  status: string;
  note: string | null;
  updatedAt: string;
  user: { displayName: string; username: string };
}

interface User {
  id: string;
  displayName: string;
  username: string;
  rsvp: { status: string } | null;
}

interface RsvpData {
  stats: { total: number; confirmed: number; declined: number; maybe: number; pending: number };
  rsvps: RsvpEntry[];
}

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: string }> = {
  CONFIRMED: { label: 'Présent',    badge: 'badge--green',  icon: '✅' },
  DECLINED:  { label: 'Absent',     badge: 'badge--red',    icon: '❌' },
  MAYBE:     { label: 'Peut-être',  badge: 'badge--yellow', icon: '🤔' },
  PENDING:   { label: 'En attente', badge: 'badge--gray',   icon: '⏳' },
};

const FILTERS = ['TOUS', 'CONFIRMED', 'DECLINED', 'MAYBE', 'PENDING'] as const;
type Filter = typeof FILTERS[number];

export default function RsvpSection() {
  const [data, setData]     = useState<RsvpData | null>(null);
  const [users, setUsers]   = useState<User[]>([]);
  const [filter, setFilter] = useState<Filter>('TOUS');

  useEffect(() => {
    Promise.all([
      api.get('/rsvp'),
      api.get('/users'),
    ]).then(([rsvpRes, usersRes]) => {
      setData(rsvpRes.data);
      setUsers(usersRes.data.filter((u: any) => u.role === 'GUEST'));
    }).catch(() => {});
  }, []);

  if (!data) return <p className={styles.loading}>Chargement...</p>;

  // Construit la liste complète : invités avec réponse + invités sans réponse
  const rsvpMap = new Map(data.rsvps.map(r => [r.user.username, r]));

  const allEntries = users.map(u => {
    const rsvp = rsvpMap.get(u.username);
    return {
      displayName: u.displayName,
      username: u.username,
      status: rsvp?.status ?? 'PENDING',
      note: rsvp?.note ?? null,
      updatedAt: rsvp?.updatedAt ?? null,
    };
  }).sort((a, b) => {
    // Trie : confirmés en premier, puis peut-être, puis en attente, puis absents
    const order = { CONFIRMED: 0, MAYBE: 1, PENDING: 2, DECLINED: 3 };
    return (order[a.status as keyof typeof order] ?? 2) - (order[b.status as keyof typeof order] ?? 2);
  });

  const filtered = filter === 'TOUS'
    ? allEntries
    : allEntries.filter(e => e.status === filter);

  return (
    <div>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statVal} style={{color:'#16A34A'}}>{data.stats.confirmed}</span>
          <span className={styles.statLabel}>✅ Présents</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal} style={{color:'#CA8A04'}}>{data.stats.maybe}</span>
          <span className={styles.statLabel}>🤔 Peut-être</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal} style={{color:'#DC2626'}}>{data.stats.declined}</span>
          <span className={styles.statLabel}>❌ Absents</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal} style={{color:'#9CA3AF'}}>{data.stats.pending}</span>
          <span className={styles.statLabel}>⏳ Attente</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div style={{marginBottom:20}}>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'#6B7280', marginBottom:6}}>
          <span>{data.stats.confirmed} confirmés sur {data.stats.total} invités</span>
          <span>{Math.round((data.stats.confirmed / (data.stats.total || 1)) * 100)}%</span>
        </div>
        <div style={{height:8, background:'#E5E7EB', borderRadius:999, overflow:'hidden'}}>
          <div style={{
            height:'100%', background:'#16A34A', borderRadius:999,
            width: `${(data.stats.confirmed / (data.stats.total || 1)) * 100}%`,
            transition:'width 0.3s'
          }}/>
        </div>
      </div>

      {/* Filtres */}
      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:16}}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding:'5px 12px', borderRadius:999, fontSize:12, fontWeight:500,
              border: filter === f ? '1px solid #3B82F6' : '1px solid #E5E7EB',
              background: filter === f ? '#EFF6FF' : 'white',
              color: filter === f ? '#3B82F6' : '#6B7280',
              cursor:'pointer'
            }}
          >
            {f === 'TOUS' ? `Tous (${users.length})` :
             f === 'CONFIRMED' ? `✅ Présents (${data.stats.confirmed})` :
             f === 'MAYBE' ? `🤔 Peut-être (${data.stats.maybe})` :
             f === 'DECLINED' ? `❌ Absents (${data.stats.declined})` :
             `⏳ Attente (${data.stats.pending})`}
          </button>
        ))}
      </div>

      {/* Liste complète */}
      <div className={styles.list}>
        {filtered.map(entry => {
          const cfg = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.PENDING;
          return (
            <div key={entry.username} className={styles.row}>
              <div style={{flex:1}}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <span style={{fontSize:14, fontWeight:600}}>{entry.displayName}</span>
                  <span style={{fontSize:12, color:'#9CA3AF'}}>@{entry.username}</span>
                </div>
                {entry.note && (
                  <p style={{fontSize:12, color:'#6B7280', marginTop:4, fontStyle:'italic'}}>
                    💬 "{entry.note}"
                  </p>
                )}
              </div>
              <span className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className={styles.empty}>Aucun invité dans cette catégorie</p>
        )}
      </div>
    </div>
  );
}
