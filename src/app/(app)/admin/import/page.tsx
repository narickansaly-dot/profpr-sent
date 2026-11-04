import Link from 'next/link';
import { exigerAdmin } from '@/lib/admin/garde';
import { FormulaireImport } from '@/components/admin/FormulaireImport';

export const metadata = { title: 'Importer un cours' };

export default async function PageImport() {
  await exigerAdmin();
  return (
    <div className="page-admin">
      <p className="fil"><Link href="/admin">← Retour au suivi du contenu</Link></p>
      <h1>Importer un cours</h1>
      <p className="vide">Dépose le fichier JSON d’un cours : tu vérifies d’abord ce qu’il contient, puis tu confirmes. Un import peut être refait sans risque : les questions inchangées restent telles quelles.</p>
      <FormulaireImport />
      <section className="carte rappel-format" aria-labelledby="titre-format">
        <h2 id="titre-format">Rappel du format</h2>
        <ul>
          <li>Un seul objet JSON par fichier : le cours (<code>slug</code>, <code>filiere</code>, <code>niveau</code>, <code>matiere</code>, <code>titre</code>, <code>couleur</code>) et sa liste de <code>chapitres</code>.</li>
          <li>Chaque chapitre contient ses <code>sections</code> (HTML) et ses <code>questions</code>, identifiées par une <code>source</code> unique dans tout le fichier.</li>
          <li>Taille maximale : <strong>4 Mo</strong>.</li>
        </ul>
        <p>Le détail de chaque champ est dans le guide des auteurs : <code>docs/guide-auteurs.md</code>.</p>
      </section>
    </div>
  );
}
