import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import styles from './Sections.module.scss';

interface FoodItem {
  id: string;
  diet: string;
  allergies: string[];
  details: string | null;
  user: { displayName: string };
}

const DIET_LABEL: Record<string, string> = {
  NONE: 'Aucun', VEGETARIAN: 'Végétarien', GLUTEN_FREE: 'Sans gluten', OTHER: 'Autre',
};

export default function FoodSection() {
  const [items, setItems] = useState<FoodItem[]>([]);
  useEffect(() => { api.get('/food').then(r => setItems(r.data)).catch(() => {}); }, []);

  return (
    <div className={styles.list}>
      {items.length === 0 && <p className={styles.empty}>Aucune restriction renseignée</p>}
      {items.map(item => (
        <div key={item.id} className={styles.row}>
          <div>
            <p className={styles.rowName}>{item.user.displayName}</p>
            <p className={styles.rowSub}>{DIET_LABEL[item.diet] ?? item.diet}</p>
            {item.allergies.length > 0 && (
              <p className={styles.rowSub}>Allergies : {item.allergies.join(', ')}</p>
            )}
            {item.details && <p className={styles.rowSub}>"{item.details}"</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
