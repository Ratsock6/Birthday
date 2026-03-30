import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/auth.store';
import styles from './Login.module.scss';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const setAuth  = useAuthStore(s => s.setAuth);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch {
      setError('Identifiant ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.emoji}>🎂</span>
        <h1>Anniversaire d'Antoine</h1>
        <p>25 avril — Connecte-toi avec tes identifiants</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Ton prénom</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="ex: marie" autoCapitalize="none" autoCorrect="off" required />
        </div>
        <div className="input-group">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter 🎉'}
        </button>
      </form>
      <p className={styles.footer}>Tu n'as pas tes identifiants ? Contacte Antoine.</p>
    </div>
  );
}
