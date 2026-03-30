import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface RsvpData {
  stats: { total: number; confirmed: number; declined: number; maybe: number; pending: number };
  rsvps: { id: string; status: string; note: string | null; user: { displayName: string; username: string } }[];
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: 'Présent',    cls: 'green'  },
  DECLINED:  { label: 'Absent',     cls: 'red'    },
  MAYBE:     { label: 'Peut-être',  cls: 'yellow' },
  PENDING:   { label: 'En attente', cls: 'gray'   },
};

export default function RsvpSection() {
  const [data, setData] = useState<RsvpData | null>(null);

  useEffect(() => { api.get('/rsvp').then(r => setData(r.data)).catch(() => {}); }, []);

  if (!data) return <p className={styles.loading}>Chargement...</p>;

  return (
    <div>
      <div className={styles.statsGrid}>
        <div className={styles.stat}><span className={styles.statVal}>{data.stats.confirmed}</span><span className={styles.statLabel}>Présents</span></div>
        <div className={styles.stat}><span className={styles.statVal}>{data.stats.maybe}</span><span className={styles.statLabel}>Peut-être</span></div>
        <div className={styles.stat}><span className={styles.statVal}>{data.stats.declined}</span><span className={styles.statLabel}>Absents</span></div>
        <div className={styles.stat}><span className={styles.statVal}>{data.stats.pending}</span><span className={styles.statLabel}>En attente</span></div>
      </div>

      <div className={styles.list}>
        {data.rsvps.map(r => {
          const s = STATUS_LABEL[r.status] ?? STATUS_LABEL.PENDING;
          return (
            <div key={r.id} className={styles.row}>
              <div>
                <p className={styles.rowName}>{r.user.displayName}</p>
                {r.note && <p className={styles.rowSub}>"{r.note}"</p>}
              </div>
              <span className={`badge badge--${s.cls}`}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
