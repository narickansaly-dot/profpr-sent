import Link from 'next/link';
import { lireMonAcces } from '@/lib/acces/requetes';
import { doitChoisirCours } from '@/lib/acces/etat';
import { listerCoursDuProfil } from '@/lib/contenu/requetes';

export async function CoursVerrouille({ titre }: { titre: string }) {
  const acces = await lireMonAcces();
  let explication: React.ReactNode;
  if (acces?.consentementRequis) {
    explication = <>Ton parent doit d’abord donner son accord. <Link href="/consentement">Voir l’état de la demande</Link></>;
  } else if (acces && doitChoisirCours(acces)) {
    explication = <>Ton essai est terminé. <Link href="/choisir-cours">Choisis ton cours gratuit</Link> pour continuer.</>;
  } else {
    const gratuit = acces?.coursGratuitId ? (await listerCoursDuProfil()).find((c) => c.id === acces.coursGratuitId) : null;
    explication = <>Ton cours gratuit est {gratuit ? <strong>{gratuit.titre}</strong> : 'un autre cours'}. L’abonnement, bientôt disponible, ouvrira tous les cours.</>;
  }
  return (
    <div className="carte">
      <h1>Ce cours n’est pas ouvert pour toi</h1>
      <p><strong>{titre}</strong></p>
      <p>{explication}</p>
      <p><Link href="/" className="lien-action">Retour à l’accueil</Link></p>
    </div>
  );
}
