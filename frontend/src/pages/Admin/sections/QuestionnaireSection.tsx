import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface Questionnaire { id: string; title: string; isOpen: boolean; _count: { questions: number } }
interface Result {
  questionnaire: { id: string; title: string };
  totalGuests: number;
  questions: {
    id: string; text: string; type: string;
    answeredBy: number;
    answers: { user: { displayName: string }; value: string }[];
  }[];
}

export default function QuestionnaireSection() {
  const [list, setList]       = useState<Questionnaire[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<Result | null>(null);
  const [newTitle, setNewTitle] = useState('');

  async function load() { api.get('/questionnaire').then(r => setList(r.data)).catch(() => {}); }
  useEffect(() => { load(); }, []);

  async function createQ(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await api.post('/questionnaire', { title: newTitle, isOpen: true });
    setNewTitle('');
    load();
  }

  async function viewResults(id: string) {
    setSelected(id);
    const r = await api.get(`/questionnaire/${id}/results`);
    setResults(r.data);
  }

  async function toggleOpen(id: string, isOpen: boolean) {
    await api.patch(`/questionnaire/${id}`, { isOpen: !isOpen });
    load();
  }

  if (selected && results) return (
    <div>
      <button className="btn btn--ghost" style={{marginBottom:16}} onClick={() => { setSelected(null); setResults(null); }}>
        ← Retour
      </button>
      <h2 style={{fontSize:17, fontWeight:700, marginBottom:16}}>{results.questionnaire.title}</h2>
      {results.questions.map(q => (
        <div key={q.id} className={styles.questionBlock}>
          <div className={styles.questionHeader}>
            <p className={styles.questionText}>{q.text}</p>
            <span className="badge badge--blue">{q.answeredBy}/{results.totalGuests}</span>
          </div>
          <div className={styles.answers}>
            {q.answers.map((a, i) => (
              <div key={i} className={styles.answer}>
                <span className={styles.answerUser}>{a.user.displayName}</span>
                <span className={styles.answerVal}>{a.value}</span>
              </div>
            ))}
            {q.answers.length === 0 && <p className={styles.empty}>Aucune réponse</p>}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <form onSubmit={createQ} style={{display:'flex', gap:8, marginBottom:16}}>
        <input
          style={{flex:1, padding:'10px 14px', border:'1px solid #E5E7EB', borderRadius:8, fontSize:14}}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Titre du questionnaire..."
        />
        <button className="btn btn--secondary" style={{width:'auto', padding:'10px 16px'}} type="submit">+</button>
      </form>

      <div className={styles.list}>
        {list.map(q => (
          <div key={q.id} className={styles.row}>
            <div>
              <p className={styles.rowName}>{q.title}</p>
              <p className={styles.rowSub}>{q._count.questions} questions</p>
            </div>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <button
                className={`btn ${q.isOpen ? 'btn--secondary' : 'btn--ghost'}`}
                style={{width:'auto', padding:'5px 10px', fontSize:12}}
                onClick={() => toggleOpen(q.id, q.isOpen)}
              >
                {q.isOpen ? 'Ouvert' : 'Fermé'}
              </button>
              <button
                className="btn btn--primary"
                style={{width:'auto', padding:'5px 10px', fontSize:12}}
                onClick={() => viewResults(q.id)}
              >
                Résultats
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className={styles.empty}>Aucun questionnaire</p>}
      </div>
    </div>
  );
}
