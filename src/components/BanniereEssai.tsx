import Link from 'next/link';
import { joursAvant } from '@/lib/acces/essai';
import { doitChoisirCours, type MonAcces } from '@/lib/acces/etat';

const dateHeure = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

const jourMois = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });

type Props = { acces: MonAcces; titreCoursGratuit?: string | null; maintenant?: Date };

export function BanniereEssai({ acces, titreCoursGratuit = null, maintenant = new Date() }: Props) {
  if (acces.consentementRequis) return null;
  if (acces.abonnement?.actif) {
    if (acces.abonnement.statut === 'impaye' && acces.abonnement.finGrace) {
      return (
        <p className="banniere banniere-fin" role="status">
          Le paiement de ton abonnement a échoué. Tu gardes l’accès à tous les cours jusqu’au {jourMois.format(new Date(acces.abonnement.finGrace))}.
        </p>
      );
    }
    return null;
  }
  if (acces.enEssai && acces.finEssai) {
    const jours = joursAvant(new Date(acces.finEssai), maintenant);
    return (
      <p className="banniere" role="status">
        🎁 Essai gratuit&nbsp;: encore <strong>{jours} jour{jours > 1 ? 's' : ''}</strong> pour découvrir tous les cours.
      </p>
    );
  }
  if (doitChoisirCours(acces)) {
    return (
      <p className="banniere banniere-fin" role="status">
        Ton essai est terminé. <Link href="/choisir-cours">Choisis ton cours gratuit</Link> pour continuer.
      </p>
    );
  }
  if (acces.coursGratuitId && acces.changementPossibleJusquAu) {
    return (
      <p className="banniere" role="status">
        Ton cours gratuit{titreCoursGratuit ? <>&nbsp;: <strong>{titreCoursGratuit}</strong></> : ''}. Tu peux encore en changer jusqu’au {dateHeure.format(new Date(acces.changementPossibleJusquAu))}.{' '}
        <Link href="/choisir-cours">Changer de cours</Link>
      </p>
    );
  }
  return null;
}
