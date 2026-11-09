import Link from 'next/link';
import { formaterDateSuppression } from '@/lib/donnees/suppression';

export function BanniereSuppression({ demandeeLe }: { demandeeLe: string }) {
  return (
    <p className="banniere banniere-fin" role="status">
      Ton compte sera supprimé à partir du {formaterDateSuppression(demandeeLe)}. <Link href="/mes-donnees">Annuler la suppression</Link>
    </p>
  );
}
