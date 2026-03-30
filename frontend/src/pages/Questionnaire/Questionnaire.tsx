import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import styles from './Questionnaire.module.scss';

interface QuestionnaireItem {
  id: string;
  title: string;
  isOpen: boolean;
  _count: { questions: number };
}

interface Question {
  id: string;
  text: string;
  type: 'TEXT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCALE';
  options: string[];
  order: number;
}

interface QuestionnaireDetail {
  id: string;
  title: string;
  questions: Question[];
}

export default function Questionnaire() {
  const navigate = useNavigate();
  const [list, setList]             = useState<QuestionnaireItem[]>([]);
  const [active, setActive]         = useState<QuestionnaireDetail | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState<Record<string, string>>({});
  const [existing, setExisting]     = useState<Record<string, string>>({});
  const [saving, setSaving]         = useState(false);
  const [done, setDone]             = useState(false);

  useEffect(() => {
    api.get('/questionnaire').then(r => setList(r.data)).catch(() => {});
  }, []);

  async function openQuestionnaire(id: string) {
    const [detail, myAnswers] = await Promise.all([
      api.get(`/questionnaire/${id}`),
      api.get(`/questionnaire/${id}/my-answers`).catch(() => ({ data: { answers: [] } })),
    ]);
    setActive(detail.data);

    // Pré-remplit les réponses existantes
    const map: Record<string, string> = {};
    myAnswers.data.answers?.forEach((a: { questionId: string; value: string }) => {
      map[a.questionId] = a.value;
    });
    setExisting(map);
    setAnswers(map);
    setCurrentIdx(0);
    setDone(false);
  }

  function setAnswer(questionId: string, value: string) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function toggleMultiple(questionId: string, option: string) {
    const current = answers[questionId] ? JSON.parse(answers[questionId]) : [];
    const updated = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];
    setAnswer(questionId, JSON.stringify(updated));
  }

  async function handleSubmit() {
    if (!active) return;
    setSaving(true);
    try {
      const payload = active.questions.map(q => ({
        questionId: q.id,
        value: answers[q.id] ?? '',
      })).filter(a => a.value !== '');

      await api.post(`/questionnaire/${active.id}/answer`, { answers: payload });
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  const q = active?.questions[currentIdx];
  const progress = active ? ((currentIdx) / active.questions.length) * 100 : 0;
  const isLast = active ? currentIdx === active.questions.length - 1 : false;

  // ─── SUCCÈS ───────────────────────────────────────────────────────────────
  if (done) return (
    <div className={styles.page}>
      <div className={styles.success}>
        <span className={styles.icon}>🎉</span>
        <h2>Merci !</h2>
        <p>Tes réponses ont bien été enregistrées.</p>
        <button className="btn btn--primary" onClick={() => { setActive(null); setDone(false); }}>
          Retour aux questionnaires
        </button>
      </div>
    </div>
  );

  // ─── QUESTIONNAIRE EN COURS ───────────────────────────────────────────────
  if (active && q) return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => setActive(null)}>←</button>
        <h1>{active.title}</h1>
      </div>

      <p className={styles.counter}>Question {currentIdx + 1} / {active.questions.length}</p>
      <div className={styles.progress}>
        <div className={styles.bar} style={{ width: `${progress}%` }} />
      </div>

      <p className={styles.question}>{q.text}</p>

      {/* TEXT */}
      {q.type === 'TEXT' && (
        <div className={`input-group ${styles.textarea}`}>
          <textarea
            value={answers[q.id] ?? ''}
            onChange={e => setAnswer(q.id, e.target.value)}
            placeholder="Ta réponse..."
          />
        </div>
      )}

      {/* SINGLE CHOICE */}
      {q.type === 'SINGLE_CHOICE' && (
        <div className={styles.choices}>
          {q.options.map(opt => (
            <button
              key={opt}
              className={`${styles.choice} ${answers[q.id] === opt ? styles['choice--selected'] : ''}`}
              onClick={() => setAnswer(q.id, opt)}
            >
              {answers[q.id] === opt ? '✓ ' : ''}{opt}
            </button>
          ))}
        </div>
      )}

      {/* MULTIPLE CHOICE */}
      {q.type === 'MULTIPLE_CHOICE' && (
        <div className={styles.choices}>
          {q.options.map(opt => {
            const selected = answers[q.id]
              ? JSON.parse(answers[q.id]).includes(opt)
              : false;
            return (
              <button
                key={opt}
                className={`${styles.choice} ${selected ? styles['choice--selected'] : ''}`}
                onClick={() => toggleMultiple(q.id, opt)}
              >
                {selected ? '✓ ' : ''}{opt}
              </button>
            );
          })}
        </div>
      )}

      {/* SCALE */}
      {q.type === 'SCALE' && (
        <div className={styles.scale}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <button
              key={n}
              className={`${styles.scaleBtn} ${answers[q.id] === String(n) ? styles['scaleBtn--selected'] : ''}`}
              onClick={() => setAnswer(q.id, String(n))}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className={styles.nav}>
        {currentIdx > 0 && (
          <button className="btn btn--ghost" onClick={() => setCurrentIdx(i => i - 1)}>
            ← Précédent
          </button>
        )}
        {!isLast && (
          <button
            className="btn btn--primary"
            onClick={() => setCurrentIdx(i => i + 1)}
          >
            Suivant →
          </button>
        )}
        {isLast && (
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Envoi...' : '✓ Envoyer mes réponses'}
          </button>
        )}
      </div>
    </div>
  );

  // ─── LISTE DES QUESTIONNAIRES ─────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Questionnaires 📝</h1>
      </div>

      {list.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.icon}>📝</span>
          <p>Aucun questionnaire disponible pour l'instant.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {list.map(q => (
            <div key={q.id} className={styles.qcard} onClick={() => openQuestionnaire(q.id)}>
              <div className={styles.info}>
                <span className={styles.title}>{q.title}</span>
                <span className={styles.sub}>{q._count.questions} questions</span>
              </div>
              <span className={styles.arrow}>→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
