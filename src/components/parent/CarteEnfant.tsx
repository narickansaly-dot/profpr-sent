import Link from 'next/link';
import type { Enfant } from '@/lib/parent/requetes';
import { etatConsentement, formaterDate } from '@/lib/parent/format';

type Props = { enfant: Enfant; valides: number; total: number };

export function CarteEnfant({ enfant, valides, total }: Props) {
  const ab = enfant.abonnement;
  return (
    <li className="carte carte-enfant">
      <h2>{enfant.nom}</h2>
      <p className="niveau-enfant">Niveau {enfant.niveau}</p>
      <p>{etatConsentement({ moins15: enfant.moins15, donneLe: enfant.donneLe, retireLe: enfant.retireLe, suppressionPrevueLe: enfant.suppressionPrevueLe })}</p>
      <p>{ab?.actif ? `Abonnement ${ab.formule === 'annuelle' ? 'annuel' : 'mensuel'} jusqu’au ${formaterDate(ab.finPeriode)}` : 'Aucun abonnement'}</p>
      <p>{valides} {valides > 1 ? 'chapitres validés' : 'chapitre validé'} sur {total}</p>
      <Link href={`/parent/enfant/${enfant.eleveId}`} className="bouton bouton-secondaire">
        Voir le détail<span className="sr-only"> de {enfant.nom}</span>
      </Link>
    </li>
  );
}
