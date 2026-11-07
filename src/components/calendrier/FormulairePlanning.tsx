'use client';

import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { accepterPlanning, apercuPlanning, refuserPlanning, type EtatPlanning, type ValeursPlanning } from '@/app/(app)/calendrier/actions';
import { DUREES_SESSION, type ChampReglages } from '@/lib/planning/reglages';
import type { Reglages } from '@/lib/planning/generer';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const formatSession = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris',
});

function valeursEnvoyees(form: FormData): ValeursPlanning {
  return {
    sessions: String(form.get('sessions') ?? ''), duree: String(form.get('duree') ?? ''),
    jours: form.getAll('jours').map(String), heure: String(form.get('heure') ?? ''),
  };
}

/** Un seul réducteur pour les trois boutons : l'état affiché est toujours celui de la dernière action. */
async function agir(precedent: EtatPlanning, form: FormData): Promise<EtatPlanning> {
  const intention = form.get('intention');
  if (intention === 'accepter') return accepterPlanning(precedent, form);
  if (intention === 'refuser') {
    const r = await refuserPlanning(precedent, form);
    // Un refus qui échoue garde l'aperçu ; la saisie en cours (celle du formulaire envoyé) n'est jamais réinitialisée.
    return { ...precedent, erreur: r.erreur, champ: r.champ, valeurs: r.valeurs ?? valeursEnvoyees(form) };
  }
  return apercuPlanning(precedent, form);
}

const deReglages = (r: Reglages): ValeursPlanning => ({
  sessions: String(r.sessionsParSemaine), duree: String(r.dureeMinutes), jours: r.joursPreferes.map(String), heure: r.heureDebut,
});

function Envoi({ libelle, enCours, classe }: { libelle: string; enCours: string; classe: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" className={`bouton ${classe}`} disabled={pending}>{pending ? enCours : libelle}</button>;
}

/** Champs cachés : l'acceptation et le refus reprennent les réglages de l'aperçu affiché. */
function ReglagesCaches({ examenId, v, intention }: { examenId: string; v: ValeursPlanning; intention: 'accepter' | 'refuser' }) {
  return (
    <>
      <input type="hidden" name="intention" value={intention} />
      <input type="hidden" name="examen" value={examenId} />
      <input type="hidden" name="sessions" value={v.sessions} />
      <input type="hidden" name="duree" value={v.duree} />
      {v.jours.map((j) => <input key={j} type="hidden" name="jours" value={j} />)}
      <input type="hidden" name="heure" value={v.heure} />
    </>
  );
}

export function FormulairePlanning({ examenId, initial, peutRefuser }: { examenId: string; initial: Reglages; peutRefuser: boolean }) {
  const [etat, envoyer] = useActionState<EtatPlanning, FormData>(agir, {});
  const r = etat.reglages ?? initial;
  const v: ValeursPlanning = etat.valeurs ?? deReglages(initial);
  const planning = etat.apercu;
  const uid = useId();
  const erreurId = `${uid}-erreur`;
  const aideHeure = `${uid}-aide-heure`;
  const decrit = (champ: ChampReglages, aide?: string) => ({
    'aria-invalid': etat.champ === champ ? true : undefined,
    'aria-describedby': [aide, etat.champ === champ ? erreurId : null].filter(Boolean).join(' ') || undefined,
  });
  const n = planning?.sessions.length ?? 0;
  return (
    <div className="planning">
      {/* key : React 19 vide les champs non contrôlés après une action ; on les remonte avec les valeurs renvoyées. */}
      <form action={envoyer} className="formulaire" key={JSON.stringify(v)}>
        <input type="hidden" name="examen" value={examenId} />
        <div className="ligne-champs">
          <label>
            Sessions par semaine
            <select name="sessions" defaultValue={v.sessions} {...decrit('sessions')}>
              {[1, 2, 3, 4, 5, 6, 7].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <label>
            Durée d’une session
            <select name="duree" defaultValue={v.duree} {...decrit('duree')}>
              {DUREES_SESSION.map((d) => <option key={d} value={d}>{d} min</option>)}
            </select>
          </label>
          <label>
            Heure de début
            <input type="time" name="heure" min="06:00" max="21:00" defaultValue={v.heure} required {...decrit('heure', aideHeure)} />
          </label>
        </div>
        <p id={aideHeure} className="aide-champ">Heure de Paris, entre 6&nbsp;h et 21&nbsp;h.</p>
        <fieldset aria-describedby={etat.champ === 'jours' ? erreurId : undefined}>
          <legend>Jours où tu peux réviser</legend>
          {JOURS.map((j, i) => (
            <label key={j} className="choix-case">
              <input type="checkbox" name="jours" value={i + 1} defaultChecked={v.jours.includes(String(i + 1))} />
              {j}
            </label>
          ))}
        </fieldset>
        <Envoi libelle="Voir le planning proposé" enCours="Calcul…" classe="bouton-secondaire" />
      </form>
      {etat.erreur && <p id={erreurId} role="alert" className="message-erreur">{etat.erreur}</p>}
      {/* Annonce courte : la liste complète n'est pas lue d'un bloc. */}
      <p className="sr-only" aria-live="polite">{planning ? `${n} session${n > 1 ? 's' : ''} proposée${n > 1 ? 's' : ''}.` : ''}</p>
      {planning && (
        <section aria-labelledby={`${uid}-apercu`} className="apercu-planning">
          <h2 id={`${uid}-apercu`}>Planning proposé</h2>
          {planning.avertissements.map((a) => <p key={a} className="message-info">{a}</p>)}
          {n > 0 && (
            <ol className="liste-sessions">
              {planning.sessions.map((s) => (
                <li key={s.debut} className="carte">
                  <strong>{formatSession.format(new Date(s.debut))}</strong> · {s.dureeMinutes} min
                  <br />{s.titre}
                </li>
              ))}
            </ol>
          )}
          {n > 0 && (
            <form action={envoyer} className="actions-planning">
              <ReglagesCaches examenId={examenId} v={deReglages(r)} intention="accepter" />
              <Envoi libelle="Accepter ce planning" enCours="Enregistrement…" classe="bouton-principal" />
            </form>
          )}
        </section>
      )}
      {peutRefuser && (
        <form action={envoyer} className="actions-planning">
          <ReglagesCaches examenId={examenId} v={v} intention="refuser" />
          <Envoi libelle="Non merci, pas de planning" enCours="Un instant…" classe="bouton-secondaire" />
        </form>
      )}
    </div>
  );
}
