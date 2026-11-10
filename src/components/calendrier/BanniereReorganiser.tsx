import Link from 'next/link';
import { BoutonPlusTard } from './BoutonPlusTard';
import { ignorerReorganisation } from '@/app/(app)/calendrier/actions';

export function BanniereReorganiser({ planId, examenId, examenTitre }: { planId: string; examenId: string; examenTitre: string }) {
  return (
    <section className="banniere-reorganiser carte" aria-label={`Réorganiser le planning de « ${examenTitre} »`}>
      <p>Bravo, tu as validé un chapitre prévu plus tard dans ton planning pour «&nbsp;{examenTitre}&nbsp;». Veux-tu le réorganiser&nbsp;?</p>
      <div className="actions-banniere">
        <Link className="bouton bouton-principal" href={`/calendrier/${examenId}/planning`}>Réorganiser</Link>
        <form action={ignorerReorganisation}>
          <input type="hidden" name="plan" value={planId} />
          <BoutonPlusTard />
        </form>
      </div>
    </section>
  );
}
