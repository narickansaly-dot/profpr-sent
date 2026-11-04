import { notFound, redirect } from 'next/navigation';
import { lireStatutTentative, lireTentative } from '@/lib/quiz/requetes';
import { LecteurTentative } from '@/components/LecteurTentative';

/** Horloge du serveur, lue au rendu de la requête. */
const maintenant = () => Date.now();

export const metadata = { title: 'Quiz en cours' };

export default async function PageTentative({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erreur?: string }> }) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const t = await lireTentative(id);
  if (!t) {
    // lireTentative renvoie null sur toute erreur, y compris « tentative terminée » (quiz fini ou temps écoulé).
    const statut = await lireStatutTentative(id);
    if (statut && statut.statut !== 'en_cours') redirect(`/tentative/${id}/resultat`);
    notFound();
  }
  if (t.statut !== 'en_cours') redirect(`/tentative/${id}/resultat`);
  const titre = t.type === 'evaluation_cours' ? `Évaluation · ${t.cours?.titre}` : `Quiz · ${t.chapitre?.titre}`;
  return (
    <div style={{ '--couleur-cours': t.cours?.couleur } as React.CSSProperties}>
      <h1 className="titre-tentative">{titre}</h1>
      {erreur === 'fin' && <p role="alert" className="message-erreur">La correction n’a pas pu se lancer. Réessaie de terminer le quiz.</p>}
      <LecteurTentative tentativeId={t.id} questions={t.questions} dateLimite={t.date_limite} serveurMaintenant={maintenant()} />
    </div>
  );
}
