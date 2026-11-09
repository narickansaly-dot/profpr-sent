import { PageIntrouvable } from '@/components/PageIntrouvable';

export const metadata = { title: 'Page introuvable' };

// URL inconnue : le layout racine apporte le pied de page ; l'en-tête dépend de la session et reste réservé aux pages connectées.
export default function NonTrouve() {
  return <PageIntrouvable avecMain />;
}
