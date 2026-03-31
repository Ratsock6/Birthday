import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { getSocket } from '../../socket/socket';
import { useAuthStore } from '../../store/auth.store';
import styles from './Wall.module.scss';

interface Message {
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  user: { id: string; displayName: string };
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

export default function Wall() {
  const navigate   = useNavigate();
  const { user }   = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText]         = useState('');
  const [sending, setSending]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/wall').then(r => setMessages(r.data)).catch(() => {});

    const socket = getSocket();
    socket.connect();

    socket.on('wall:new_message', (msg: Message) => {
      setMessages(prev => [msg, ...prev]);
    });

    socket.on('wall:delete', ({ id }: { id: string }) => {
      setMessages(prev => prev.filter(m => m.id !== id));
    });

    socket.on('wall:like', (updated: Message) => {
      setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
    });

    return () => {
      socket.off('wall:new_message');
      socket.off('wall:delete');
      socket.off('wall:like');
      socket.disconnect();
    };
  }, []);

  async function handleSend() {
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post('/wall', { content: text.trim() });
      setText('');
    } finally {
      setSending(false);
    }
  }

  async function handleLike(id: string) {
    await api.post(`/wall/${id}/like`);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Mur de messages 💬</h1>
      </div>

      {messages.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.icon}>💬</span>
          Sois le premier à écrire un message !
        </div>
      ) : (
        <div className={styles.messages}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.message} ${msg.user.id === user?.id ? styles['message--mine'] : ''}`}
            >
              <div className={styles.top}>
                <span className={styles.author}>{msg.user.displayName}</span>
                <span className={styles.time}>{timeAgo(msg.createdAt)}</span>
              </div>
              <p className={styles.content}>{msg.content}</p>
              <div className={styles.actions}>
                <button
                  className={`${styles.like}`}
                  onClick={() => handleLike(msg.id)}
                >
                  ❤️ {msg.likes > 0 ? msg.likes : ''}
                </button>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <div className={styles.composer}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Écris un message..."
          maxLength={500}
        />
        <button
          className={styles.send}
          onClick={handleSend}
          disabled={!text.trim() || sending}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
