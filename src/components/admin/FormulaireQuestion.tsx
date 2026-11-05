'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useTransition, type CSSProperties, type FormEvent } from 'react';
import { enregistrerQuestion, type EtatQuestion } from '@/app/(app)/admin/questions/actions';
import { TYPES_QUESTION, LIBELLE_DIFFICULTE } from '@/lib/admin/questions';
import type { SaisieQuestion } from '@/lib/contenu/schema-question-editeur';
import { ApercuQuestion } from './ApercuQuestion';
import { GroupeReponseCourte } from './GroupeReponseCourte';
import type { TypeQuestion } from '@/lib/quiz/reponse';

type Prop = { cle: string; texte: string; bonne: boolean };

export type QuestionInitiale = Omit<SaisieQuestion, 'propositions'> & { propositions: { texte: string; bonne: boolean }[] };

const MIN = 2, MAX = 10;

export function FormulaireQuestion({ chapitreId, questionId, utilisee, couleur, notions, initial, annulerHref }: {
  chapitreId: string; questionId?: string; utilisee: boolean; couleur: string; notions: string[];
  initial: QuestionInitiale; annulerHref: string;
}) {
  const [champs, setChamps] = useState(() => ({ ...initial, propositions: undefined }));
  // Clés déterministes (identiques au rendu serveur et à l'hydratation).
  const [props, setProps] = useState<Prop[]>(() => initial.propositions.map((p, i) => ({ ...p, cle: `p${i}` })));
  const prochaine = useRef(initial.propositions.length);
  const [erreur, setErreur] = useState<(EtatQuestion & { erreur: string }) | null>(null);
  const [annonce, setAnnonce] = useState('');
  const aFocaliser = useRef<string | null>(null);
  const refErreur = useRef<HTMLParagraphElement>(null);
  const [enCours, lancer] = useTransition();
  const maj = (p: Partial<typeof champs>) => setChamps((c) => ({ ...c, ...p }));
  const type = champs.type;
  const aChoix = type === 'qcm_unique' || type === 'qcm_multiple';

  const enErreur = (c: string) => erreur?.champ === c;
  const inv = (c: string, aide?: string) => ({
    ...(enErreur(c) ? { 'aria-invalid': true as const } : {}),
    'aria-describedby': [enErreur(c) ? 'erreur-question' : '', aide ?? ''].filter(Boolean).join(' ') || undefined,
  });

  // Après une erreur : le focus va au premier champ en cause, sinon au message.
  useEffect(() => {
    if (!erreur) return;
    const cible = (erreur.champ ? document.getElementById(`champ-${erreur.champ}`) : null) ?? refErreur.current;
    cible?.scrollIntoView({ block: 'center' });
    cible?.focus({ preventScroll: true });
  }, [erreur]);
  // Focus demandé par un ajout ou un retrait de proposition : appliqué une fois la liste redessinée.
  useEffect(() => {
    const id = aFocaliser.current;
    if (!id) return;
    aFocaliser.current = null;
    document.getElementById(id)?.focus();
  }, [props]);

  const changerType = (t: string) => {
    // Un QCM à réponse unique ne garde qu'une bonne réponse.
    if (t === 'qcm_unique') {
      const premiere = props.findIndex((p) => p.bonne);
      setProps((l) => l.map((p, i) => ({ ...p, bonne: i === premiere })));
    }
    maj({ type: t });
  };
  const majProp = (cle: string, p: Partial<Prop>) => setProps((l) => l.map((x) => (x.cle === cle ? { ...x, ...p } : x)));
  const cocher = (cle: string, bonne: boolean) =>
    setProps((l) => l.map((x) => (type === 'qcm_unique' ? { ...x, bonne: x.cle === cle } : x.cle === cle ? { ...x, bonne } : x)));
  const ajouter = () => {
    const cle = `p${prochaine.current++}`;
    aFocaliser.current = `champ-proposition-${props.length}`;
    setProps((l) => [...l, { cle, texte: '', bonne: false }]);
    setAnnonce(`Proposition ${props.length + 1} ajoutée.`);
  };
  const retirer = (i: number) => {
    const reste = props.filter((_, k) => k !== i);
    aFocaliser.current = `champ-proposition-${Math.min(i, reste.length - 1)}`;
    setProps(reste);
    setAnnonce(`Proposition retirée. ${reste.length} propositions restantes.`);
  };

  function enregistrer(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    lancer(async () => {
      try {
        const saisie: SaisieQuestion = { ...champs, propositions: props.map(({ texte, bonne }) => ({ texte, bonne })) };
        const r = await enregistrerQuestion(chapitreId, questionId ?? null, saisie);
        if (r?.erreur) setErreur({ ...r, erreur: r.erreur });
      } catch (err) {
        // La redirection de l'action est gérée par Next ; toute autre exception est une vraie panne.
        if (err && typeof err === 'object' && 'digest' in err) throw err;
        setErreur({ erreur: 'L’enregistrement a échoué. Vérifie ta connexion et réessaie.' });
      }
    });
  }

  return (
    <>
    <form onSubmit={enregistrer} noValidate className="formulaire editeur-question" style={{ '--couleur-cours': couleur } as CSSProperties}>
      <div className="champ-question">
        <label htmlFor="champ-type">Type de question</label>
        <select id="champ-type" {...inv('type', utilisee ? 'aide-utilisee' : undefined)} value={type} onChange={(e) => changerType(e.target.value)}>
          {TYPES_QUESTION.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        {utilisee && (
          <p id="aide-utilisee" className="aide-champ">
            Cette question a déjà servi : changer le type, les propositions ou les réponses crée une nouvelle version.
          </p>
        )}
      </div>

      <div className="champ-question">
        <label htmlFor="champ-enonce">Énoncé</label>
        <textarea id="champ-enonce" {...inv('enonce')} rows={3} maxLength={2000} value={champs.enonce} onChange={(e) => maj({ enonce: e.target.value })} />
      </div>

      {aChoix && (
        <fieldset className="groupe-propositions" aria-describedby={enErreur('bonne-0') ? 'erreur-question' : 'aide-propositions'}>
          <legend>Propositions ({props.length} sur {MAX} au maximum)</legend>
          <p id="aide-propositions" className="aide-champ">
            {type === 'qcm_unique' ? 'Choisis la seule bonne réponse.' : 'Coche toutes les bonnes réponses.'} De {MIN} à {MAX} propositions.
          </p>
          <ul className="liste-propositions">
            {props.map((p, i) => (
              <li key={p.cle} className="ligne-proposition">
                <div className="champ-question">
                  <label htmlFor={`champ-proposition-${i}`}>Proposition {i + 1}</label>
                  <input id={`champ-proposition-${i}`} {...inv(`proposition-${i}`)} type="text" maxLength={500} autoComplete="off"
                    value={p.texte} onChange={(e) => majProp(p.cle, { texte: e.target.value })} />
                </div>
                <label className="case-bonne" htmlFor={`champ-bonne-${i}`}>
                  <input id={`champ-bonne-${i}`} {...(i === 0 ? inv('bonne-0') : {})} type={type === 'qcm_unique' ? 'radio' : 'checkbox'} name="bonne"
                    checked={p.bonne} onChange={(e) => cocher(p.cle, e.target.checked)} />
                  <span>Bonne réponse<span className="sr-only"> : proposition {i + 1}</span></span>
                </label>
                <button type="button" className="bouton bouton-secondaire bouton-compact" onClick={() => retirer(i)} disabled={props.length <= MIN}>
                  Retirer<span className="sr-only"> la proposition {i + 1}</span>
                </button>
              </li>
            ))}
          </ul>
          <div><button type="button" className="bouton bouton-secondaire" onClick={ajouter} disabled={props.length >= MAX}>Ajouter une proposition</button></div>
        </fieldset>
      )}

      {type === 'vrai_faux' && (
        <fieldset className="groupe-propositions" aria-describedby={enErreur('vrai') ? 'erreur-question' : undefined}>
          <legend>L’affirmation est…</legend>
          <div className="choix-simples">
            {([['vrai', 'Vrai'], ['faux', 'Faux']] as const).map(([v, l]) => (
              <label key={v} className="case-bonne">
                <input id={v === 'vrai' ? 'champ-vrai' : undefined} {...(v === 'vrai' ? inv('vrai') : {})} type="radio" name="vrai-faux"
                  checked={champs.vraiFaux === v} onChange={() => maj({ vraiFaux: v })} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {type === 'reponse_courte' && (
        <GroupeReponseCourte acceptees={champs.acceptees} marge={champs.marge} margeRelative={champs.margeRelative}
          erreurAcceptees={enErreur('acceptees')} erreurMarge={enErreur('marge')} onChange={maj} />
      )}

      <div className="ligne-champs">
        <div className="champ-question">
          <label htmlFor="champ-notion">Notion</label>
          <input id="champ-notion" {...inv('notion', 'aide-notion')} type="text" list="notions" maxLength={120} autoComplete="off"
            value={champs.notion} onChange={(e) => maj({ notion: e.target.value })} />
          <datalist id="notions">{notions.map((n) => <option key={n} value={n} />)}</datalist>
          <p id="aide-notion" className="aide-champ">Facultatif. Les statistiques de l’élève sont regroupées par notion.</p>
        </div>
        <fieldset className="groupe-propositions groupe-difficulte">
          <legend>Difficulté</legend>
          <div className="choix-simples">
            {[1, 2, 3].map((d) => (
              <label key={d} className="case-bonne">
                <input id={d === 1 ? 'champ-difficulte' : undefined} {...(d === 1 ? inv('difficulte') : {})} type="radio" name="difficulte" checked={champs.difficulte === String(d)} onChange={() => maj({ difficulte: String(d) })} />
                <span>{LIBELLE_DIFFICULTE[d]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="champ-question">
        <label htmlFor="champ-explication">Explication (montrée dans la correction)</label>
        <textarea id="champ-explication" {...inv('explication')} rows={4} maxLength={4000} value={champs.explication} onChange={(e) => maj({ explication: e.target.value })} />
      </div>

      {erreur && <p ref={refErreur} id="erreur-question" role="alert" tabIndex={-1} className="message-erreur">{erreur.erreur}</p>}
      <div className="actions-formulaire barre-actions-editeur">
        <button type="submit" className="bouton bouton-principal" disabled={enCours}>{enCours ? 'Enregistrement…' : 'Enregistrer'}</button>
        <Link href={annulerHref} className="bouton bouton-secondaire">Annuler</Link>
      </div>
      <p role="status" className="sr-only">{annonce}</p>

    </form>
    <ApercuQuestion key={`${type}:${props.map((p) => p.cle).join(',')}`} type={type as TypeQuestion}
      enonce={champs.enonce} propositions={props.map((p) => p.texte)} />
    </>
  );
}
