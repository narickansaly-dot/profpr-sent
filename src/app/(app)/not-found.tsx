import { PageIntrouvable } from '@/components/PageIntrouvable';

// Ressource absente dans l'espace connecté (cours, chapitre…) : l'en-tête et le <main> viennent du layout.
export default function NonTrouve() {
  return <PageIntrouvable avecMain={false} />;
}
