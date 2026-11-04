import Link from 'next/link';
import { exigerEnseignant } from '@/lib/enseignant/garde';
import { lireCatalogue, lireClassesEnseignant } from '@/lib/enseignant/requetes';
import { creerClientServeur } from '@/lib/supabase/server';
import { NIVEAUX } from '@/lib/profil/onboarding';
import { FormulaireClasse, type GroupeCours } from '@/components/FormulaireClasse';

export const metadata = { title: 'Mes classes' };

export default async function PageEnseignant() {
  await exigerEnseignant();
  const supabase = await creerClientServeur();
  const [classes, catalogue, filieres] = await Promise.all([
    lireClassesEnseignant(),
    lireCatalogue(),
    supabase.from('filiere').select('id, nom').order('ordre'),
  ]);
  const titres = new Map(catalogue.map((c) => [c.id, c.titre]));
  const parFiliere = new Map<string, { ordre: number; groupe: GroupeCours }>();
  for (const c of catalogue) {
    const f = c.filiere;
    const cle = f?.code ?? '';
    const entree = parFiliere.get(cle) ?? { ordre: f?.ordre ?? 999, groupe: { nom: f?.nom ?? 'Autres cours', cours: [] } };
    entree.groupe.cours.push({ id: c.id, titre: c.titre });
    parFiliere.set(cle, entree);
  }
  const groupes = [...parFiliere.values()].sort((a, b) => a.ordre - b.ordre).map((e) => e.groupe);

  return (
    <div className="page-enseignant">
      <h1>Mes classes</h1>
      {classes.length === 0 ? (
        <p className="vide">Crée ta première classe, puis donne son code à tes élèves.</p>
      ) : (
        <ul className="liste-cartes-classes">
          {classes.map((c) => (
            <li key={c.id} className="carte carte-classe">
              <div className="entete-classe">
                <h2>{c.nom}</h2>
                <p className="nb-eleves">{c.nb_eleves} {c.nb_eleves > 1 ? 'élèves' : 'élève'}</p>
              </div>
              <p className="code-carte"><span className="etiquette">Code</span> <span className="code-valeur">{c.code}</span></p>
              <p className="cours-carte">{c.cours_ids.map((id) => titres.get(id)).filter(Boolean).join(' · ') || 'Aucun cours'}</p>
              <Link href={`/enseignant/classes/${c.id}`} className="bouton bouton-secondaire">
                Ouvrir<span className="sr-only"> la classe {c.nom}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <section className="carte" aria-labelledby="titre-creer">
        <h2 id="titre-creer">Créer une classe</h2>
        <FormulaireClasse groupes={groupes} filieres={filieres.data ?? []} niveaux={NIVEAUX} />
      </section>
    </div>
  );
}
