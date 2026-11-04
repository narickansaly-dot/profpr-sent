import Link from 'next/link';
import { redirect } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { listerCoursDuProfil } from '@/lib/contenu/requetes';
import { lireTableauDeBord } from '@/lib/quiz/requetes';
import { formaterNote } from '@/lib/quiz/reponse';
import { CarteCours } from '@/components/CarteCours';
import { FormulaireQuiz } from '@/components/FormulaireQuiz';

export const metadata = { title: 'Tableau de bord' };
const jour = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });

export default async function Accueil() {
  const profil = await lireProfil();
  if (profil?.role === 'enseignant') redirect('/enseignant');
  if (profil?.role === 'admin_contenu') redirect('/cours');
  const [cours, { tdb, erreur: erreurTdb }] = await Promise.all([
    listerCoursDuProfil(),
    lireTableauDeBord().then(
      (tdb) => ({ tdb, erreur: false }),
      () => ({ tdb: null, erreur: true }),
    ),
  ]);
  const examens = (tdb?.examens ?? []).filter((e) => e.cours);
  return (
    <div className="tableau-de-bord">
      <header className="tdb-entete">
        <h1>{tdb?.prenom ? `Salut ${tdb.prenom} !` : 'Salut !'}</h1>
        {tdb && tdb.serie > 0 && (
          <p className="serie">🔥 {tdb.serie} jour{tdb.serie > 1 ? 's' : ''} de révision d’affilée</p>
        )}
      </header>

      {erreurTdb && (
        <p className="vide">Ton tableau de bord n’a pas pu se charger entièrement. Recharge la page dans un instant.</p>
      )}

      <section aria-labelledby="titre-cours">
        <h2 id="titre-cours">Mes cours</h2>
        {cours.length === 0
          ? <p className="carte">Les cours de ta filière arrivent bientôt. Reviens vite !</p>
          : <div className="grille-cours">{cours.map((c) => (
              <CarteCours key={c.id} {...c} nbValides={tdb?.validesParCours.get(c.id) ?? 0} />
            ))}</div>}
      </section>

      <section aria-labelledby="titre-examens">
        <h2 id="titre-examens">Mes notes d’examen</h2>
        {examens.length === 0 ? (
          erreurTdb ? null : <p className="vide">Pas encore d’évaluation passée. Valide les chapitres d’un cours pour débloquer la sienne.</p>
        ) : (
          <ul className="liste-tdb">
            {examens.map((e) => (
              <li key={e.cours?.slug} className="carte ligne-tdb">
                <Link href={`/cours/${e.cours?.slug}/evaluation`}>{e.cours?.titre}</Link>
                <strong className={e.valide ? 'note-reussie' : 'note-ratee'}>{formaterNote(Number(e.meilleure_note ?? 0))}</strong>
                <span>{e.valide ? 'Réussie' : 'À repasser'} · {e.essais} essai{e.essais > 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="titre-quiz">
        <h2 id="titre-quiz">Mes derniers quiz</h2>
        {!tdb || tdb.derniers.length === 0 ? (
          erreurTdb ? null : <p className="vide">Lance ton premier quiz depuis un chapitre !</p>
        ) : (
          <ul className="liste-tdb">
            {tdb.derniers.map((t) => (
              <li key={t.id} className="carte ligne-tdb">
                <Link href={`/tentative/${t.id}/resultat`}>
                  {t.type === 'evaluation_cours' ? `Évaluation · ${t.cours?.titre ?? 'cours'}` : t.chapitre?.titre ?? t.cours?.titre ?? 'Quiz'}
                </Link>
                <strong className={t.reussie ? 'note-reussie' : 'note-ratee'}>{formaterNote(Number(t.note ?? 0))}</strong>
                <span>{t.fin ? jour.format(new Date(t.fin)) : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {tdb && tdb.pointsFaibles.length > 0 && (
        <section aria-labelledby="titre-faibles">
          <h2 id="titre-faibles">À retravailler</h2>
          <ul className="liste-tdb">
            {tdb.pointsFaibles.map((p) => (
              <li key={`${p.chapitre_id}-${p.libelle}`} className="carte ligne-tdb ligne-faible">
                <Link href={`/cours/${p.cours_slug}/${p.chapitre_slug}`}>{p.libelle}</Link>
                <span>{p.taux_erreur} % d’erreurs sur {p.reponses} réponse{p.reponses > 1 ? 's' : ''}</span>
                <FormulaireQuiz chapitreId={p.chapitre_id} longueurs={[15]} revision libelle="Réviser" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
