'use client';

import { useActionState, useId, useState } from 'react';
import { enregistrerEvenement, type EtatEvenement } from '@/app/(app)/calendrier/actions';
import { DUREES_EVENEMENT, RAPPELS } from '@/lib/calendrier/constantes';
import type { ChampEvenement, ValeursEvenement } from '@/lib/calendrier/schema-evenement';
import type { CoursOption } from '@/lib/calendrier/requetes';

const TYPES = [
  { valeur: 'revision', libelle: 'Révision' },
  { valeur: 'devoir', libelle: 'Devoir' },
  { valeur: 'examen_reel', libelle: 'Examen (contrôle, bac blanc…)' },
];
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const libelleDuree = (d: number) => (d < 60 ? `${d} min` : d % 60 === 0 ? `${d / 60} h` : `${Math.floor(d / 60)} h ${d % 60}`);

type Props = { id?: string; cours: CoursOption[]; initial: ValeursEvenement };

export function FormulaireEvenement({ id, cours, initial }: Props) {
  const [etat, envoyer, enCours] = useActionState<EtatEvenement, FormData>(enregistrerEvenement, {});
  const v = etat.valeurs ?? initial;
  const [type, setType] = useState(v.type);
  const [coursId, setCoursId] = useState(v.cours);
  const [repetition, setRepetition] = useState(v.repetition);
  const uid = useId();
  const erreurId = `${uid}-erreur`;
  const aideHeure = `${uid}-aide-heure`;
  const aideRappel = `${uid}-aide-rappel`;
  const aideChapitres = `${uid}-aide-chapitres`;
  // Seul le champ en cause est marqué invalide et relié au message d'erreur.
  const decrit = (champ: ChampEvenement, aide?: string) => ({
    'aria-invalid': etat.champ === champ ? true : undefined,
    'aria-describedby': [aide, etat.champ === champ ? erreurId : null].filter(Boolean).join(' ') || undefined,
  });
  const chapitres = cours.find((c) => c.id === coursId)?.chapitres ?? [];
  return (
    // key : React 19 vide les champs non contrôlés après une action ; on les remonte avec les valeurs renvoyées.
    <form action={envoyer} className="formulaire formulaire-evenement" key={JSON.stringify(etat.valeurs ?? null)}>
      {id && <input type="hidden" name="id" value={id} />}
      {id ? <input type="hidden" name="type" value={type} /> : (
        <fieldset aria-describedby={etat.champ === 'type' ? erreurId : undefined}>
          <legend>Type</legend>
          {TYPES.map((t) => (
            <label key={t.valeur} className="choix-radio">
              <input type="radio" name="type" value={t.valeur} checked={type === t.valeur} onChange={() => setType(t.valeur)} required />
              {t.libelle}
            </label>
          ))}
        </fieldset>
      )}
      <label>
        Titre
        <input name="titre" defaultValue={v.titre} maxLength={120} required {...decrit('titre')} />
      </label>
      <div className="ligne-champs">
        <label>Date<input type="date" name="jour" defaultValue={v.jour} required {...decrit('jour')} /></label>
        <label>Heure<input type="time" name="heure" defaultValue={v.heure} required {...decrit('heure', aideHeure)} /></label>
        <label>
          Durée
          <select name="duree" defaultValue={v.duree} {...decrit('duree')}>
            {DUREES_EVENEMENT.map((d) => <option key={d} value={d}>{libelleDuree(d)}</option>)}
          </select>
        </label>
      </div>
      <p id={aideHeure} className="aide-champ">Heure de Paris.</p>
      <label>
        Rappel
        <select name="rappel" id="rappel" defaultValue={v.rappel} {...decrit('rappel', aideRappel)}>
          {RAPPELS.map((r) => <option key={r.valeur} value={r.valeur}>{r.libelle}</option>)}
        </select>
      </label>
      <p id={aideRappel} className="aide-champ">Une notification sur tes appareils, ou dans la page Rappels.</p>
      <label>
        Cours
        <select name="cours" value={coursId} onChange={(e) => setCoursId(e.target.value)} {...decrit('cours')}>
          <option value="">Aucun</option>
          {cours.map((c) => <option key={c.id} value={c.id}>{c.titre}</option>)}
        </select>
      </label>
      {chapitres.length > 0 && (
        <fieldset aria-describedby={[aideChapitres, etat.champ === 'chapitres' ? erreurId : null].filter(Boolean).join(' ')}>
          <legend>Chapitres</legend>
          <p id={aideChapitres} className="aide-champ">
            {type === 'examen_reel' ? 'Les chapitres au programme. Sans choix, le planning prend tout le cours.' : 'Facultatif.'}
          </p>
          {chapitres.map((ch) => (
            <label key={ch.id} className="choix-case">
              <input type="checkbox" name="chapitres" value={ch.id} defaultChecked={v.chapitres.includes(ch.id)} />
              Ch. {ch.numero} · {ch.titre}
            </label>
          ))}
        </fieldset>
      )}
      {!id && type === 'examen_reel' && coursId && (
        <p className="message-info">Après l’enregistrement, on te proposera un planning de révision.</p>
      )}
      <label>
        Répétition
        <select name="repetition" value={repetition} onChange={(e) => setRepetition(e.target.value)} {...decrit('repetition')}>
          <option value="aucune">Aucune</option>
          <option value="quotidienne">Tous les jours</option>
          <option value="hebdomadaire">Toutes les semaines</option>
          <option value="jours">Certains jours de la semaine</option>
        </select>
      </label>
      {repetition === 'jours' && (
        <fieldset aria-describedby={etat.champ === 'jours' ? erreurId : undefined}>
          <legend>Jours</legend>
          {JOURS.map((j, i) => (
            <label key={j} className="choix-case">
              <input type="checkbox" name="jours" value={i + 1} defaultChecked={v.jours.includes(String(i + 1))} />
              {j}
            </label>
          ))}
        </fieldset>
      )}
      {repetition !== 'aucune' && (
        <label>Jusqu’au<input type="date" name="jusqu" defaultValue={v.jusqu} required {...decrit('jusqu')} /></label>
      )}
      {etat.erreur && <p id={erreurId} role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Enregistrement…' : id ? 'Enregistrer les modifications' : 'Ajouter au calendrier'}
      </button>
    </form>
  );
}
