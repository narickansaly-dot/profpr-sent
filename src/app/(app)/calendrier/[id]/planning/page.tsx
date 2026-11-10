import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lirePlanning } from '@/lib/calendrier/requetes';
import { REGLAGES_PAR_DEFAUT } from '@/lib/planning/reglages';
import type { Reglages } from '@/lib/planning/generer';
import { FormulairePlanning } from '@/components/calendrier/FormulairePlanning';

export const metadata = { title: 'Planning de révision' };
const formatDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

export default async function PagePlanning({ params }: { params: Promise<{ id: string }> }) {
  await exigerEleve();
  const { id } = await params;
  const p = await lirePlanning(id, new Date());
  if (!p) notFound();
  const initial: Reglages = p.plan
    ? { sessionsParSemaine: p.plan.sessions_par_semaine, dureeMinutes: p.plan.duree_minutes, joursPreferes: p.plan.jours_preferes, heureDebut: p.plan.heure_debut.slice(0, 5) }
    : REGLAGES_PAR_DEFAUT;
  return (
    <div className="page-planning">
      <p><Link className="lien-action" href={`/calendrier/${id}`}>← {p.examen.titre}</Link></p>
      <h1>Planning de révision</h1>
      <p>{p.examen.titre} · {formatDate.format(new Date(p.examen.debut))}{p.examen.cours ? ` · ${p.examen.cours.titre}` : ''}</p>
      {p.passe ? <p className="vide">Cet examen est passé.</p>
        : p.tropLoin ? <p className="vide">Ton examen est dans plus d’un an. Reviens plus tard pour préparer ton planning.</p>
        : (
          <>
            {p.plan?.statut === 'accepte' && (
              <section aria-labelledby="titre-en-place">
                <h2 id="titre-en-place">Ton planning est en place</h2>
                {p.sessionsAVenir.length === 0 ? <p className="vide">Plus de session à venir.</p> : (
                  <ol className="liste-sessions">
                    {p.sessionsAVenir.map((s) => (
                      <li key={s.id} className="carte"><Link href={`/calendrier/${s.id}`}>{formatDate.format(new Date(s.debut))} · {s.titre}</Link></li>
                    ))}
                  </ol>
                )}
                <p>Pour le réorganiser, change les réglages et accepte le nouveau planning&nbsp;: les sessions à venir seront remplacées.</p>
              </section>
            )}
            {p.plan?.statut === 'refuse' && <p className="message-info">Tu as refusé le planning proposé. Tu peux en demander un autre quand tu veux.</p>}
            {!p.plan && <p>On répartit tes chapitres d’ici l’examen, en commençant par ceux que tu maîtrises le moins. La veille, une révision générale te fait réviser tout le programme.</p>}
            <FormulairePlanning examenId={id} initial={initial} peutRefuser={!p.plan} />
          </>
        )}
    </div>
  );
}
