import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface User { id: string; username: string; displayName: string; role: string; rsvp: { status: string } | null }

export default function UsersSection() {
  const [users, setUsers]     = useState<User[]>([]);
  const [form, setForm]       = useState({ username: '', password: '', displayName: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError]     = useState('');

  async function load() { api.get('/users').then(r => setUsers(r.data)).catch(() => {}); }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await api.post('/users', form);
      setForm({ username: '', password: '', displayName: '' });
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Erreur');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer ${name} ?`)) return;
    await api.delete(`/users/${id}`);
    load();
  }

  return (
    <div>
      <form onSubmit={handleCreate} className={styles.form}>
        <p className={styles.formTitle}>Nouvel invité</p>
        <div className="input-group">
          <label>Prénom affiché</label>
          <input value={form.displayName} onChange={e => setForm(f => ({...f, displayName: e.target.value}))} placeholder="Marie" required />
        </div>
        <div className="input-group">
          <label>Username (connexion)</label>
          <input value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value}))} placeholder="marie" required />
        </div>
        <div className="input-group">
          <label>Mot de passe</label>
          <input value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="••••••••" required />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button className="btn btn--primary" type="submit" disabled={creating}>
          {creating ? 'Création...' : '+ Créer le compte'}
        </button>
      </form>

      <div className={styles.list} style={{marginTop: 20}}>
        {users.filter(u => u.role === 'GUEST').map(u => (
          <div key={u.id} className={styles.row}>
            <div>
              <p className={styles.rowName}>{u.displayName}</p>
              <p className={styles.rowSub}>@{u.username}</p>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              {u.rsvp && <span className={`badge badge--${u.rsvp.status === 'CONFIRMED' ? 'green' : u.rsvp.status === 'DECLINED' ? 'red' : 'yellow'}`}>{u.rsvp.status === 'CONFIRMED' ? '✓' : u.rsvp.status === 'DECLINED' ? '✗' : '?'}</span>}
              <button className="btn btn--danger" style={{width:'auto', padding:'6px 10px', fontSize:12}} onClick={() => handleDelete(u.id, u.displayName)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
