import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface Questionnaire { id: string; title: string; isOpen: boolean; _count: { questions: number } }
interface Question { id: string; text: string; type: string; options: string[] }
interface Result {
  questionnaire: { id: string; title: string };
  totalGuests: number;
  questions: {
    id: string; text: string; type: string;
    answeredBy: number;
    answers: { user: { displayName: string }; value: string }[];
  }[];
}

const QUESTION_TYPES = [
  { value: 'TEXT',            label: 'Texte libre'      },
  { value: 'SINGLE_CHOICE',   label: 'Choix unique'     },
  { value: 'MULTIPLE_CHOICE', label: 'Choix multiple'   },
  { value: 'SCALE',           label: 'Échelle 1-10'     },
];

export default function QuestionnaireSection() {
  const [list, setList]             = useState<Questionnaire[]>([]);
  const [selected, setSelected]     = useState<string | null>(null);
  const [view, setView]             = useState<'questions' | 'results'>('questions');
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [results, setResults]       = useState<Result | null>(null);
  const [newTitle, setNewTitle]     = useState('');

  // Nouveau form question
  const [qText, setQText]           = useState('');
  const [qType, setQType]           = useState('TEXT');
  const [qOptions, setQOptions]     = useState('');
  const [addingQ, setAddingQ]       = useState(false);

  async function load() {
    api.get('/questionnaire').then(r => setList(r.data)).catch(() => {});
  }

  async function loadQuestions(id: string) {
    const r = await api.get(`/questionnaire/${id}`);
    setQuestions(r.data.questions);
  }

  async function loadResults(id: string) {
    const r = await api.get(`/questionnaire/${id}/results`);
    setResults(r.data);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!selected) return;
    if (view === 'questions') loadQuestions(selected);
    else loadResults(selected);
  }, [selected, view]);

  async function createQ(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await api.post('/questionnaire', { title: newTitle, isOpen: true });
    setNewTitle('');
    load();
  }

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !qText.trim()) return;
    setAddingQ(true);
    try {
      const options = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(qType)
        ? qOptions.split('\n').map(o => o.trim()).filter(Boolean)
        : [];
      await api.post(`/questionnaire/${selected}/questions`, {
        text: qText,
        type: qType,
        options,
      });
      setQText('');
      setQOptions('');
      setQType('TEXT');
      loadQuestions(selected);
    } finally {
      setAddingQ(false);
    }
  }

  async function deleteQuestion(questionId: string) {
    if (!confirm('Supprimer cette question ?')) return;
    await api.delete(`/questionnaire/questions/${questionId}`);
    loadQuestions(selected!);
  }

  async function toggleOpen(id: string, isOpen: boolean) {
    await api.patch(`/questionnaire/${id}`, { isOpen: !isOpen });
    load();
  }

  async function deleteQuestionnaire(id: string) {
    if (!confirm('Supprimer ce questionnaire ?')) return;
    await api.delete(`/questionnaire/${id}`);
    setSelected(null);
    load();
  }

  // ─── VUE DÉTAIL ───────────────────────────────────────────────────────────
  if (selected) {
    const q = list.find(q => q.id === selected);
    return (
      <div>
        <button className="btn btn--ghost" style={{marginBottom:16}} onClick={() => setSelected(null)}>
          ← Retour
        </button>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
          <h2 style={{fontSize:17, fontWeight:700}}>{q?.title}</h2>
          <div style={{display:'flex', gap:8}}>
            <button
              className={`btn ${q?.isOpen ? 'btn--secondary' : 'btn--ghost'}`}
              style={{width:'auto', padding:'6px 12px', fontSize:12}}
              onClick={() => toggleOpen(selected, q?.isOpen ?? true)}
            >
              {q?.isOpen ? 'Ouvert' : 'Fermé'}
            </button>
            <button
              className="btn btn--danger"
              style={{width:'auto', padding:'6px 12px', fontSize:12}}
              onClick={() => deleteQuestionnaire(selected)}
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Onglets questions / résultats */}
        <div style={{display:'flex', gap:0, borderBottom:'1px solid #E5E7EB', marginBottom:20}}>
          {(['questions', 'results'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding:'8px 16px', fontSize:13, fontWeight:500,
                borderBottom: view === v ? '2px solid #3B82F6' : '2px solid transparent',
                color: view === v ? '#3B82F6' : '#6B7280',
                background:'none', border:'none', borderBottom: view === v ? '2px solid #3B82F6' : '2px solid transparent',
                cursor:'pointer'
              }}
            >
              {v === 'questions' ? '📝 Questions' : '📊 Résultats'}
            </button>
          ))}
        </div>

        {/* ─── QUESTIONS ─── */}
        {view === 'questions' && (
          <>
            {/* Formulaire ajout question */}
            <form onSubmit={addQuestion} className={styles.form} style={{marginBottom:20}}>
              <p className={styles.formTitle}>Ajouter une question</p>

              <div className="input-group">
                <label>Question</label>
                <input value={qText} onChange={e => setQText(e.target.value)} placeholder="Ex: Quel est ton plat préféré ?" required />
              </div>

              <div className="input-group">
                <label>Type</label>
                <select value={qType} onChange={e => setQType(e.target.value)}>
                  {QUESTION_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(qType) && (
                <div className="input-group">
                  <label>Options (une par ligne)</label>
                  <textarea
                    value={qOptions}
                    onChange={e => setQOptions(e.target.value)}
                    placeholder={"Option A\nOption B\nOption C"}
                    style={{resize:'none', height:90}}
                  />
                </div>
              )}

              <button className="btn btn--primary" type="submit" disabled={addingQ}>
                {addingQ ? 'Ajout...' : '+ Ajouter la question'}
              </button>
            </form>

            {/* Liste des questions */}
            <div className={styles.list}>
              {questions.map((q, i) => (
                <div key={q.id} className={styles.row}>
                  <div style={{flex:1}}>
                    <p className={styles.rowName}>Q{i+1}. {q.text}</p>
                    <p className={styles.rowSub}>{QUESTION_TYPES.find(t => t.value === q.type)?.label}</p>
                    {q.options.length > 0 && (
                      <p className={styles.rowSub}>{q.options.join(' · ')}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    style={{color:'#DC2626', background:'none', border:'none', cursor:'pointer', fontSize:16, flexShrink:0}}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {questions.length === 0 && <p className={styles.empty}>Aucune question — ajoutes-en une !</p>}
            </div>
          </>
        )}

        {/* ─── RÉSULTATS ─── */}
        {view === 'results' && results && (
          <div>
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
                      <span className={styles.answerVal}>
                        {(() => {
                          try { const p = JSON.parse(a.value); return Array.isArray(p) ? p.join(', ') : a.value; }
                          catch { return a.value; }
                        })()}
                      </span>
                    </div>
                  ))}
                  {q.answers.length === 0 && <p className={styles.empty}>Aucune réponse</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── LISTE ────────────────────────────────────────────────────────────────
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
          <div key={q.id} className={styles.row} style={{cursor:'pointer'}} onClick={() => setSelected(q.id)}>
            <div>
              <p className={styles.rowName}>{q.title}</p>
              <p className={styles.rowSub}>{q._count.questions} questions</p>
            </div>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <span className={`badge badge--${q.isOpen ? 'green' : 'gray'}`}>
                {q.isOpen ? 'Ouvert' : 'Fermé'}
              </span>
              <span style={{color:'#9CA3AF'}}>→</span>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className={styles.empty}>Aucun questionnaire — crées-en un !</p>}
      </div>
    </div>
  );
}
