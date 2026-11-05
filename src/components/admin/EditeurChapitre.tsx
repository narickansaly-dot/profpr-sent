'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useTransition, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { apercuChapitre, enregistrerChapitre, type EtatChapitre, type SaisieChapitre } from '@/app/(app)/admin/chapitres/actions';
import { EditeurSection, type SectionSaisie } from './EditeurSection';

export type ChapitreInitial = Omit<SaisieChapitre, 'sections'> & { sections: { id: string; titre: string; html: string }[] };


export function EditeurChapitre({ coursId, coursSlug, couleur, chapitreId, initial }: {
  coursId: string; coursSlug: string; couleur: string; chapitreId?: string; initial: ChapitreInitial;
}) {
  const [champs, setChamps] = useState(() => ({ ...initial, sections: undefined }));
  const [sections, setSections] = useState<SectionSaisie[]>(() => initial.sections.map((s, i) => ({ ...s, cle: `s${i}` })));
  // Clés déterministes (identiques sur le serveur et dans le navigateur, car elles servent d'identifiants dans le DOM).
  const prochaineCle = useRef(initial.sections.length);
  const [erreur, setErreur] = useState<(EtatChapitre & { erreur: string }) | null>(null);
  const [annonce, setAnnonce] = useState('');
  const aFocaliser = useRef<string | null>(null);
  const refErreur = useRef<HTMLParagraphElement>(null);
  const refApercu = useRef<HTMLElement>(null);
  const [apercu, setApercu] = useState<{ noeud: ReactNode; retire: string[] } | null>(null);
  const [erreurApercu, setErreurApercu] = useState('');
  const [enregistrement, lancerEnregistrement] = useTransition();
  const [calcul, lancerApercu] = useTransition();
  const maj = (p: Partial<typeof champs>) => setChamps((c) => ({ ...c, ...p }));
  const inv = (c: string) => (erreur?.champ === c && erreur.section === undefined
    ? { 'aria-invalid': true as const, 'aria-describedby': 'erreur-chapitre' } : {});
  const saisie = (): SaisieChapitre => ({ ...champs, sections: sections.map(({ id, titre, html }) => ({ id, titre, html })) });

  // Focus demandé par une action (déplacement, suppression) : appliqué une fois la liste redessinée.
  useEffect(() => {
    const cible = aFocaliser.current;
    if (!cible) return;
    aFocaliser.current = null;
    const cibler = () => document.getElementById(cible)?.focus();
    cibler();
    // Le navigateur peut ramener le focus au corps après la désactivation du bouton pressé : on le reprend au rendu suivant.
    requestAnimationFrame(() => { if (document.activeElement === document.body) cibler(); });
  }, [sections]);
  // Après une erreur d'enregistrement : le focus va au champ en cause, sinon au message.
  useEffect(() => {
    if (!erreur) return;
    const section = erreur.section !== undefined ? sections[erreur.section] : undefined;
    const champ = section ? document.getElementById(`titre-${section.cle}`) : erreur.champ ? document.getElementById(`champ-${erreur.champ}`) : null;
    const cible = champ ?? refErreur.current;
    cible?.scrollIntoView({ block: 'center' });
    cible?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seulement quand une nouvelle erreur arrive
  }, [erreur]);
  // Après un aperçu : le focus va au panneau, qui porte un nom.
  useEffect(() => { if (apercu) { refApercu.current?.scrollIntoView({ block: 'start' }); refApercu.current?.focus({ preventScroll: true }); } }, [apercu]);

  const majSection = (cle: string, p: Partial<SectionSaisie>) => setSections((l) => l.map((s) => (s.cle === cle ? { ...s, ...p } : s)));
  const deplacer = (i: number, d: -1 | 1) => {
    const cle = sections[i].cle;
    const j = i + d;
    // Un bouton désactivé ne peut pas garder le focus : à l'extrémité, on passe au bouton opposé.
    const meme = d === -1 ? 'monter' : 'descendre';
    const autre = d === -1 ? 'descendre' : 'monter';
    aFocaliser.current = `${j === 0 && d === -1 || j === sections.length - 1 && d === 1 ? autre : meme}-${cle}`;
    setSections((l) => {
      const c = [...l];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
    setAnnonce(`Section « ${sections[i].titre || i + 1} » déplacée en position ${j + 1} sur ${sections.length}.`);
  };
  const supprimer = (i: number) => {
    const reste = sections.filter((_, k) => k !== i);
    const voisine = reste[i - 1] ?? reste[i];
    aFocaliser.current = voisine ? `titre-${voisine.cle}` : 'ajouter-section';
    setSections(reste);
    setAnnonce(`Section supprimée. ${reste.length} section${reste.length > 1 ? 's' : ''} restante${reste.length > 1 ? 's' : ''}.`);
  };
  const ajouter = () => {
    const cle = `s${prochaineCle.current++}`;
    setSections((l) => {
      let n = l.length + 1;
      while (l.some((s) => s.id === `section-${n}`)) n++;
      return [...l, { cle, id: `section-${n}`, titre: '', html: '<p>…</p>' }];
    });
  };

  function previsualiser() {
    setErreurApercu('');
    lancerApercu(async () => {
      try {
        const r = await apercuChapitre(saisie());
        if (r.erreur || !r.apercu) setErreurApercu(r.erreur ?? 'L’aperçu n’a pas pu être généré.');
        else {
          setApercu({ noeud: r.apercu, retire: r.retire ?? [] });
          setAnnonce(`Aperçu mis à jour.${r.retire?.length ? ` Le nettoyage a retiré : ${r.retire.join(', ')}.` : ''}`);
        }
      } catch {
        setErreurApercu('L’aperçu n’a pas pu être généré. Réessaie dans un instant.');
      }
    });
  }

  function enregistrer(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    lancerEnregistrement(async () => {
      try {
        const r = await enregistrerChapitre(coursId, chapitreId ?? null, saisie());
        if (r?.erreur) setErreur({ ...r, erreur: r.erreur });
      } catch (err) {
        // La redirection de l'action est gérée par Next ; toute autre exception est une vraie panne.
        if (err && typeof err === 'object' && 'digest' in err) throw err;
        setErreur({ erreur: 'L’enregistrement a échoué. Vérifie ta connexion et réessaie.' });
      }
    });
  }

  const styleCours = { '--couleur-cours': couleur } as CSSProperties;
  // L'aperçu est rendu hors du <form> : Entrée dans un champ du contenu prévisualisé (calculatrice, etc.)
  // ne doit jamais enregistrer le chapitre (envoi implicite du formulaire).
  return (
    <>
    <form onSubmit={enregistrer} className="formulaire editeur-chapitre" style={styleCours}>
      <fieldset className="section-editeur">
        <legend>Informations du chapitre</legend>
        <label>Titre<input id="champ-titre" {...inv('titre')} type="text" required maxLength={200} autoComplete="off" value={champs.titre} onChange={(e) => maj({ titre: e.target.value })} /></label>
        <div className="ligne-champs">
          <label>Titre court<input id="champ-titre_court" {...inv('titre_court')} type="text" maxLength={80} autoComplete="off" value={champs.titre_court} onChange={(e) => maj({ titre_court: e.target.value })} /></label>
          <label>Durée<input id="champ-duree" {...inv('duree')} type="text" maxLength={40} autoComplete="off" value={champs.duree} onChange={(e) => maj({ duree: e.target.value })} /></label>
        </div>
        <div className="ligne-champs">
          <label>Numéro<input id="champ-numero" {...inv('numero')} type="number" inputMode="numeric" required min={1} max={99} step={1} value={champs.numero} onChange={(e) => maj({ numero: e.target.value })} /></label>
          <label>
            Identifiant d’URL (slug)
            <input id="champ-slug" {...inv('slug')} type="text" required maxLength={80} pattern="[a-z0-9\-]{1,80}" autoComplete="off" spellCheck={false} value={champs.slug} onChange={(e) => maj({ slug: e.target.value })} />
          </label>
        </div>
        <label>Résumé<textarea id="champ-resume" {...inv('resume')} rows={3} maxLength={1000} value={champs.resume} onChange={(e) => maj({ resume: e.target.value })} /></label>
        <label>Chapeau<textarea id="champ-chapeau" {...inv('chapeau')} rows={3} maxLength={4000} value={champs.chapeau} onChange={(e) => maj({ chapeau: e.target.value })} /></label>
        <label>
          Objectifs (un par ligne)
          <textarea id="champ-objectifs" {...inv('objectifs')} rows={5} value={champs.objectifs} onChange={(e) => maj({ objectifs: e.target.value })} />
        </label>
      </fieldset>

      <h2 className="titre-sections">Sections</h2>
      {sections.length === 0 && <p className="vide">Ce chapitre n’a pas encore de section.</p>}
      {sections.map((s, i) => (
        <EditeurSection key={s.cle} section={s} position={i} total={sections.length} coursSlug={coursSlug}
          enErreur={erreur?.section === i}
          onChange={(p) => majSection(s.cle, p)} onMonter={() => deplacer(i, -1)} onDescendre={() => deplacer(i, 1)}
          onSupprimer={() => supprimer(i)} />
      ))}
      <div><button id="ajouter-section" type="button" className="bouton bouton-secondaire" onClick={ajouter} disabled={sections.length >= 40}>Ajouter une section</button></div>

      <fieldset className="section-editeur">
        <legend>Je retiens</legend>
        <label>
          HTML de la zone « Je retiens »
          <textarea id="champ-a_retenir" {...inv('a_retenir')} className="zone-html" rows={8} spellCheck={false} value={champs.a_retenir} onChange={(e) => maj({ a_retenir: e.target.value })} />
        </label>
      </fieldset>

      <div className="actions-formulaire barre-actions-editeur">
        {/* Dans la barre collante : le message reste visible pendant que le focus est sur le champ en cause. */}
        {erreur && <p ref={refErreur} id="erreur-chapitre" role="alert" tabIndex={-1} className="message-erreur">{erreur.erreur}</p>}
        <button type="submit" className="bouton bouton-principal" disabled={enregistrement}>{enregistrement ? 'Enregistrement…' : 'Enregistrer'}</button>
        <button type="button" className="bouton bouton-secondaire" onClick={previsualiser} disabled={calcul}>{calcul ? 'Aperçu…' : 'Aperçu'}</button>
        <Link href="/admin" className="bouton bouton-secondaire">Annuler</Link>
      </div>

      <p role="status" className="sr-only">{annonce}</p>
    </form>
      <section ref={refApercu} className="panneau-apercu" aria-label="Aperçu du chapitre" tabIndex={-1} style={styleCours}>
        <h2>Aperçu</h2>
        {erreurApercu && <p role="alert" className="message-erreur">{erreurApercu}</p>}
        {!apercu && !erreurApercu && <p className="vide">Clique sur « Aperçu » pour voir le chapitre tel que les élèves le verront.</p>}
        {apercu && (
          <>
            {apercu.retire.length > 0
              ? <p className="message-avertissement">Le nettoyage a retiré du contenu non autorisé : {apercu.retire.join(', ')}.</p>
              : <p className="message-info">Rien n’a été retiré par le nettoyage.</p>}
            <div className="apercu-chapitre">{apercu.noeud}</div>
          </>
        )}
      </section>
    </>
  );
}
