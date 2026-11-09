import Link from 'next/link';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { FormulaireAccord } from '@/components/consentement/FormulaireAccord';

// Le jeton est dans l'URL : pas d'indexation, pas de Referer, pas de cache (voir aussi next.config.ts).
export const metadata = { title: 'Autorisation parentale', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export const dynamic = 'force-dynamic';

export default async function PageAccord({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('lire_demande_consentement', { p_jeton: jeton });
  const demande = data?.[0];
  if (error || !demande) {
    return (
      <main className="page-auth">
        <h1>Lien expiré ou invalide</h1>
        <p>{messageErreur('lien_consentement_invalide')}</p>
      </main>
    );
  }
  const prenom = demande.prenom || 'Votre enfant';
  if (demande.deja_donne) {
    return (
      <main className="page-auth">
        <h1>Accord déjà enregistré</h1>
        <p>Votre accord est déjà enregistré. {prenom} peut utiliser App lycée.</p>
      </main>
    );
  }
  return (
    <main className="page-auth">
      <h1>Autorisation parentale</h1>
      <p>
        {prenom} souhaite utiliser App lycée, une application de cours et de quiz pour le lycée.
        Comme il ou elle a moins de 15 ans, votre accord est nécessaire.
      </p>
      <p>L’application garde :</p>
      <ul>
        <li>son prénom et son adresse e-mail ;</li>
        <li>sa filière et son niveau ;</li>
        <li>ses résultats aux quiz ;</li>
        <li>son calendrier de révision.</li>
      </ul>
      <p>Aucune publicité, aucun traceur. <Link href="/confidentialite">Politique de confidentialité</Link></p>
      <FormulaireAccord jeton={jeton} />
    </main>
  );
}
