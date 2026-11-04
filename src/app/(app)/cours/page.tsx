import { redirect } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { lireCatalogue } from '@/lib/enseignant/requetes';
import { CarteCours } from '@/components/CarteCours';

export const metadata = { title: 'Catalogue des cours' };

const ORDRE_NIVEAUX = ['2de', '1re', 'Tle'];
const NOM_NIVEAUX: Record<string, string> = { '2de': 'Seconde', '1re': 'Première', Tle: 'Terminale' };

export default async function PageCatalogue() {
  const profil = await lireProfil();
  if (profil?.role !== 'enseignant' && profil?.role !== 'admin_contenu') redirect('/');
  const cours = await lireCatalogue();

  const filieres = new Map<string, { nom: string; ordre: number; cours: typeof cours }>();
  for (const c of cours) {
    const code = c.filiere?.code ?? '';
    const f = filieres.get(code) ?? { nom: c.filiere?.nom ?? 'Autres cours', ordre: c.filiere?.ordre ?? 999, cours: [] };
    f.cours.push(c);
    filieres.set(code, f);
  }
  const groupes = [...filieres.entries()].sort((a, b) => a[1].ordre - b[1].ordre);

  return (
    <div className="catalogue">
      <h1>Catalogue des cours</h1>
      {groupes.length === 0 && <p className="vide">Aucun cours publié pour le moment.</p>}
      {groupes.map(([code, f]) => (
        <section key={code} aria-labelledby={`filiere-${code || 'autres'}`}>
          <h2 id={`filiere-${code || 'autres'}`}>{f.nom}</h2>
          {[...new Set(f.cours.map((c) => c.niveau_code))]
            .sort((a, b) => ORDRE_NIVEAUX.indexOf(a ?? '') - ORDRE_NIVEAUX.indexOf(b ?? ''))
            .map((niveau) => (
              <div key={niveau ?? 'sans'} className="groupe-niveau">
                <h3>{NOM_NIVEAUX[niveau ?? ''] ?? 'Tous niveaux'}</h3>
                <div className="grille-cours">
                  {f.cours.filter((c) => c.niveau_code === niveau).map((c) => (
                    <CarteCours key={c.id} slug={c.slug} titre={c.titre} matiere={c.matiere} couleur={c.couleur}
                      nbChapitres={c.nbChapitres} sansProgression />
                  ))}
                </div>
              </div>
            ))}
        </section>
      ))}
    </div>
  );
}
