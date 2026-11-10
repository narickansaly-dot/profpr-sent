import Link from 'next/link';
import { redirect } from 'next/navigation';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lireMonAcces } from '@/lib/acces/requetes';
import { listerCoursDuProfil } from '@/lib/contenu/requetes';
import { FormulaireCoursGratuit } from '@/components/acces/FormulaireCoursGratuit';

export const metadata = { title: 'Choisir mon cours gratuit' };
const dateLongue = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });
const dateHeure = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

export default async function PageChoisirCours() {
  await exigerEleve();
  const acces = await lireMonAcces();
  if (!acces) return <p className="vide">Impossible de charger ton accès pour le moment. Réessaie dans un instant.</p>;
  if (acces.consentementRequis) redirect('/consentement');
  const cours = await listerCoursDuProfil();

  if (acces.enEssai && acces.finEssai) {
    return (
      <div>
        <h1>Choisis ton cours gratuit</h1>
        <p className="carte">Ton essai dure jusqu’au {dateLongue.format(new Date(acces.finEssai))}. Tous les cours sont ouverts d’ici là.</p>
        <p><Link href="/" className="lien-action">Retour à l’accueil</Link></p>
      </div>
    );
  }

  if (acces.coursGratuitId && !acces.changementPossibleJusquAu) {
    const choisi = cours.find((c) => c.id === acces.coursGratuitId);
    return (
      <div>
        <h1>Ton cours gratuit</h1>
        <p className="carte">Ton cours gratuit est <strong>{choisi?.titre ?? 'un cours de ta filière'}</strong>. Ce choix est définitif.</p>
        <p><Link href="/" className="lien-action">Retour à l’accueil</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h1>Choisis ton cours gratuit</h1>
      <p>
        Ce cours reste ouvert sans limite de durée.{' '}
        {acces.coursGratuitId && acces.changementPossibleJusquAu
          ? `Tu peux encore changer une fois, jusqu’au ${dateHeure.format(new Date(acces.changementPossibleJusquAu))}.`
          : 'Tu pourras changer d’avis une seule fois, dans les 48 heures.'}
      </p>
      {cours.length === 0
        ? <p className="carte">Les cours de ta filière arrivent bientôt.</p>
        : <FormulaireCoursGratuit cours={cours.map((c) => ({ id: c.id, titre: c.titre, matiere: c.matiere }))} coursActuelId={acces.coursGratuitId} />}
    </div>
  );
}
