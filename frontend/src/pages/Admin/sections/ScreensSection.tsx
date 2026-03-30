import { useNavigate } from 'react-router-dom';
import styles from './Sections.module.scss';

export default function ScreensSection() {
  const navigate = useNavigate();

  const screens = [
    { icon: '💬', title: 'Mur de messages live', desc: 'Affiche les messages en temps réel', route: '/screen/wall' },
    { icon: '📸', title: 'Diaporama photos', desc: 'Défilement automatique des photos', route: '/screen/slideshow' },
  ];

  return (
    <div>
      <p style={{fontSize:13, color:'#6B7280', marginBottom:16}}>
        Ces écrans sont conçus pour être affichés sur une TV ou un grand écran en plein écran.
      </p>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {screens.map(s => (
          <button
            key={s.route}
            onClick={() => navigate(s.route)}
            style={{
              display:'flex', alignItems:'center', gap:14,
              padding:'16px', background:'white', border:'1px solid #E5E7EB',
              borderRadius:12, cursor:'pointer', textAlign:'left', width:'100%'
            }}
          >
            <span style={{fontSize:28}}>{s.icon}</span>
            <div>
              <p style={{fontSize:15, fontWeight:600}}>{s.title}</p>
              <p style={{fontSize:13, color:'#6B7280'}}>{s.desc}</p>
            </div>
            <span style={{marginLeft:'auto', fontSize:18, color:'#9CA3AF'}}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
