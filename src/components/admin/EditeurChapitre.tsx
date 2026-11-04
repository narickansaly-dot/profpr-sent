'use client';

import Link from 'next/link';
import { useState, useTransition, type CSSProperties, type ReactNode } from 'react';
import { apercuChapitre, enregistrerChapitre, type SaisieChapitre } from '@/app/(app)/admin/chapitres/actions';
import { EditeurSection, type SectionSaisie } from './EditeurSection';

export type ChapitreInitial = Omit<SaisieChapitre, 'sections'> & { sections: { id: string; titre: string; html: string }[] };

let compteur = 0;
const nouvelleCle = () => `s${Date.now().toString(36)}${compteur++}`;

export function EditeurChapitre({ coursId, coursSlug, couleur, chapitreId, initial }: {
  coursId: string; coursSlug: string; couleur: string; chapitreId?: string; initial: ChapitreInitial;
}) {
  const [champs, setChamps] = useState(() => ({ ...initial, sections: undefined }));
  const [sections, setSections] = useState<SectionSaisie[]>(() => initial.sections.map((s) => ({ ...s, cle: nouvelleCle() })));
  const [erreur, setErreur] = useState('');
  const [apercu, setApercu] = useState<{ noeud: ReactNode; retire: string[] } | null>(null);
  const [erreurApercu, setErreurApercu] = useState('');
  const [enregistrement, lancerEnregistrement] = useTransition();
  const [calcul, lancerApercu] = useTransition();
  const maj = (p: Partial<typeof champs>) => setChamps((c) => ({ ...c, ...p }));
  const saisie = (): SaisieChapitre => ({ ...champs, sections: sections.map(({ id, titre, html }) => ({ id, titre, html })) });

  const majSection = (cle: string, p: Partial<SectionSaisie>) => setSections((l) => l.map((s) => (s.cle === cle ? { ...s, ...p } : s)));
  const deplacer = (i: number, d: -1 | 1) => setSections((l) => {
    const c = [...l];
    [c[i], c[i + d]] = [c[i + d], c[i]];
    return c;
  });
  const ajouter = () => setSections((l) => {
    let n = l.length + 1;
    while (l.some((s) => s.id === `section-${n}`)) n++;
    return [...l, { cle: nouvelleCle(), id: `section-${n}`, titre: '', html: '<p>…</p>' }];
  });

  function previsualiser() {
    setErreurApercu('');
    lancerApercu(async () => {
      try {
        const r = await apercuChapitre(saisie());
        if (r.erreur || !r.apercu) setErreurApercu(r.erreur ?? 'L’aperçu n’a pas pu être généré.');
        else setApercu({ noeud: r.apercu, retire: r.retire ?? [] });
      } catch {
        setErreurApercu('L’aperçu n’a pas pu être généré. Réessaie dans un instant.');
      }
    });
  }

  function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    lancerEnregistrement(async () => {
      try {
        const r = await enregistrerChapitre(coursId, chapitreId ?? null, saisie());
        if (r?.erreur) setErreur(r.erreur);
      } catch (err) {
        // La redirection de l'action est gérée par Next ; toute autre exception est une vraie panne.
        if (err && typeof err === 'object' && 'digest' in err) throw err;
        setErreur('L’enregistrement a échoué. Vérifie ta connexion et réessaie.');
      }
    });
  }

  return (
    <form onSubmit={enregistrer} className="formulaire editeur-chapitre" style={{ '--couleur-cours': couleur } as CSSProperties}>
      <fieldset className="section-editeur">
        <legend>Informations du chapitre</legend>
        <label>Titre<input type="text" required maxLength={200} autoComplete="off" value={champs.titre} onChange={(e) => maj({ titre: e.target.value })} /></label>
        <div className="ligne-champs">
          <label>Titre court<input type="text" maxLength={80} autoComplete="off" value={champs.titre_court} onChange={(e) => maj({ titre_court: e.target.value })} /></label>
          <label>Durée<input type="text" maxLength={40} autoComplete="off" value={champs.duree} onChange={(e) => maj({ duree: e.target.value })} /></label>
        </div>
        <div className="ligne-champs">
          <label>Numéro<input type="number" inputMode="numeric" required min={1} max={99} step={1} value={champs.numero} onChange={(e) => maj({ numero: e.target.value })} /></label>
          <label>
            Identifiant d’URL (slug)
            <input type="text" required maxLength={80} pattern="[a-z0-9\-]{1,80}" autoComplete="off" spellCheck={false} value={champs.slug} onChange={(e) => maj({ slug: e.target.value })} />
          </label>
        </div>
        <label>Résumé<textarea rows={3} maxLength={1000} value={champs.resume} onChange={(e) => maj({ resume: e.target.value })} /></label>
        <label>Chapeau<textarea rows={3} maxLength={4000} value={champs.chapeau} onChange={(e) => maj({ chapeau: e.target.value })} /></label>
        <label>
          Objectifs (un par ligne)
          <textarea rows={5} value={champs.objectifs} onChange={(e) => maj({ objectifs: e.target.value })} />
        </label>
      </fieldset>

      <h2 className="titre-sections">Sections</h2>
      {sections.length === 0 && <p className="vide">Ce chapitre n’a pas encore de section.</p>}
      {sections.map((s, i) => (
        <EditeurSection key={s.cle} section={s} position={i} total={sections.length} coursSlug={coursSlug}
          onChange={(p) => majSection(s.cle, p)} onMonter={() => deplacer(i, -1)} onDescendre={() => deplacer(i, 1)}
          onSupprimer={() => setSections((l) => l.filter((x) => x.cle !== s.cle))} />
      ))}
      <div><button type="button" className="bouton bouton-secondaire" onClick={ajouter} disabled={sections.length >= 40}>Ajouter une section</button></div>

      <fieldset className="section-editeur">
        <legend>Je retiens</legend>
        <label>
          HTML de la zone « Je retiens »
          <textarea className="zone-html" rows={8} spellCheck={false} value={champs.a_retenir} onChange={(e) => maj({ a_retenir: e.target.value })} />
        </label>
      </fieldset>

      {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
      <div className="actions-formulaire barre-actions-editeur">
        <button type="submit" className="bouton bouton-principal" disabled={enregistrement}>{enregistrement ? 'Enregistrement…' : 'Enregistrer'}</button>
        <button type="button" className="bouton bouton-secondaire" onClick={previsualiser} disabled={calcul}>{calcul ? 'Aperçu…' : 'Aperçu'}</button>
        <Link href="/admin" className="bouton bouton-secondaire">Annuler</Link>
      </div>

      <section className="panneau-apercu" aria-labelledby="titre-apercu" aria-live="polite">
        <h2 id="titre-apercu">Aperçu</h2>
        {erreurApercu && <p role="alert" className="message-erreur">{erreurApercu}</p>}
        {!apercu && !erreurApercu && <p className="vide">Clique sur « Aperçu » pour voir le chapitre tel que les élèves le verront.</p>}
        {apercu && (
          <>
            {apercu.retire.length > 0
              ? <p role="status" className="message-avertissement">Le nettoyage a retiré du contenu non autorisé : {apercu.retire.join(', ')}.</p>
              : <p role="status" className="message-info">Rien n’a été retiré par le nettoyage.</p>}
            <div className="apercu-chapitre">{apercu.noeud}</div>
          </>
        )}
      </section>
    </form>
  );
}
