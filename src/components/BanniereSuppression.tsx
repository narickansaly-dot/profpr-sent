import Link from 'next/link';
import { formaterDateSuppression } from '@/lib/donnees/suppression';

export function BanniereSuppression({ demandeeLe, imposee = false, parent = false }: { demandeeLe: string; imposee?: boolean; parent?: boolean }) {
  return (
    <p className="banniere banniere-fin" role="status">
      {parent ? 'Votre' : 'Ton'} compte sera supprimé à partir du {formaterDateSuppression(demandeeLe)}.{' '}
      {imposee ? 'La suppression a été demandée par ton parent.' : <Link href="/mes-donnees">Annuler la suppression</Link>}
    </p>
  );
}
