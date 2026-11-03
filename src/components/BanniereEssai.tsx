export function BanniereEssai({ joursRestants }: { joursRestants: number }) {
  if (joursRestants === 0) {
    return <p className="banniere banniere-fin" role="status">Ton essai est terminé. Bientôt : choisis ton cours gratuit ou abonne-toi.</p>;
  }
  return (
    <p className="banniere" role="status">
      🎁 Essai gratuit : encore <strong>{joursRestants} jour{joursRestants > 1 ? 's' : ''}</strong> pour découvrir tous les cours.
    </p>
  );
}
