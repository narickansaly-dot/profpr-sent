import { redirect } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { lireClassesEleve } from '@/lib/enseignant/requetes';
import { normaliserCode } from '@/lib/classes/code';
import { BoutonQuitter, FormulaireRejoindre } from '@/components/FormulaireRejoindre';

export const metadata = { title: 'Mes classes' };
const dateArrivee = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

export default async function PageClasses({ searchParams }: { searchParams: Promise<{ code?: string | string[] }> }) {
  const profil = await lireProfil();
  if (profil?.role !== 'eleve') redirect('/');
  const { code } = await searchParams;
  const codeInitial = normaliserCode((Array.isArray(code) ? code[0] : code) ?? '');
  const classes = await lireClassesEleve();
  return (
    <div className="page-classes">
      <h1>Mes classes</h1>
      <section className="carte" aria-labelledby="titre-rejoindre">
        <h2 id="titre-rejoindre">Rejoindre une classe</h2>
        <FormulaireRejoindre codeInitial={codeInitial} />
      </section>
      <section aria-labelledby="titre-liste">
        <h2 id="titre-liste">Tes classes</h2>
        {classes.length === 0 ? (
          <p className="vide">Tu n’as pas encore rejoint de classe.</p>
        ) : (
          <ul className="liste-classes">
            {classes.map((c) => (
              <li key={c.id} className="carte ligne-classe">
                <div className="infos-classe">
                  <h3>{c.nom}</h3>
                  {c.enseignant_nom && <p>Classe de {c.enseignant_nom}</p>}
                  <p>Depuis le {dateArrivee.format(new Date(c.rejoint_le))}</p>
                </div>
                <BoutonQuitter classeId={c.id} nom={c.nom} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
