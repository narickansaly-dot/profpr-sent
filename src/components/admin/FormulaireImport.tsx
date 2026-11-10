'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { importer, verifierImport, type EtatImport, type EtatVerification } from '@/app/(app)/admin/import/actions';
import { TAILLE_MAX_IMPORT, TAILLE_MAX_LIBELLE } from '@/lib/contenu/limite-import';

const AFFICHEES = 30;
const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;

export function FormulaireImport() {
  const [etatV, verifier, verifie] = useActionState<EtatVerification, FormData>(verifierImport, {});
  const [etatI, lancer, importe] = useActionState<EtatImport, FormData>(importer, {});
  const [publier, setPublier] = useState(false);
  const [taille, setTaille] = useState('');
  const erreursRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLHeadingElement>(null);
  const bilanRef = useRef<HTMLHeadingElement>(null);
  const echecRef = useRef<HTMLParagraphElement>(null);

  const { resume, erreurs, erreur: erreurV } = etatV;
  const termine = !!etatI.bilan && etatI.serie === etatV.serie;
  const echec = etatI.erreur && etatI.serie === etatV.serie ? etatI.erreur : undefined;

  // Le résultat d'une action remplace le contenu : le focus suit, pour que le lecteur d'écran lise le nouveau bloc.
  useEffect(() => {
    if (erreurs || erreurV) erreursRef.current?.focus();
    else if (resume) resumeRef.current?.focus();
  }, [etatV, erreurs, erreurV, resume]);
  useEffect(() => { if (termine) bilanRef.current?.focus(); }, [termine, etatI]);
  useEffect(() => { if (echec) echecRef.current?.focus(); }, [echec, etatI]);

  const liste = erreurs ?? [];
  return (
    <>
      <form action={verifier} className="carte formulaire formulaire-import" aria-labelledby="titre-depot">
        <h2 id="titre-depot">1. Choisir le fichier</h2>
        <div className="champ">
          <label htmlFor="champ-fichier">Fichier JSON du cours</label>
          <input id="champ-fichier" name="fichier" type="file" accept=".json,application/json" required aria-describedby="aide-fichier"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setTaille(f && f.size > TAILLE_MAX_IMPORT ? `Ce fichier dépasse la limite de ${TAILLE_MAX_LIBELLE}.` : '');
            }} />
          <span id="aide-fichier" className="aide-champ">Taille maximale : {TAILLE_MAX_LIBELLE}.</span>
          {taille && <p role="alert" className="message-erreur">{taille}</p>}
        </div>
        <label className="case-import" htmlFor="champ-publier">
          <input id="champ-publier" name="publier" type="checkbox" checked={publier} onChange={(e) => setPublier(e.target.checked)} />
          <span>Publier le cours et les nouveaux chapitres</span>
        </label>
        <div className="actions-formulaire">
          <button type="submit" className="bouton bouton-principal" disabled={verifie || !!taille}>{verifie ? 'Vérification…' : 'Vérifier'}</button>
        </div>
      </form>

      {/* Les erreurs sont hors des libellés. La région reçoit le focus (lue une fois, par son titre) : pas de role="alert" en plus. */}
      {(erreurs || erreurV) && (
        <section className="carte resultat-import resultat-erreurs" ref={erreursRef} tabIndex={-1} aria-labelledby="titre-erreurs">
          <h2 id="titre-erreurs">{erreurV ? 'Fichier non vérifié' : 'Fichier invalide : rien n’a été écrit'}</h2>
          {erreurV ? <p>{erreurV}</p> : (
            <>
              <p>{pluriel(liste.length, 'problème à corriger', 'problèmes à corriger')} dans le fichier, puis recommence la vérification.</p>
              <ul className="liste-erreurs-import">
                {liste.slice(0, AFFICHEES).map((e, i) => <li key={i}>{e}</li>)}
              </ul>
              {liste.length > AFFICHEES && <p>… et {pluriel(liste.length - AFFICHEES, 'autre problème', 'autres problèmes')}.</p>}
            </>
          )}
        </section>
      )}

      {resume && !termine && (
        <section className="carte resultat-import" aria-labelledby="titre-resume">
          <h2 id="titre-resume" tabIndex={-1} ref={resumeRef}>2. Vérifier le résumé</h2>
          <p className="resume-titre"><strong>{resume.titre}</strong> <span className="vide">({resume.slug} · {resume.filiere} · {resume.niveau})</span></p>
          <ul className="liste-resume">
            <li>{pluriel(resume.chapitres, 'chapitre', 'chapitres')}</li>
            <li>{pluriel(resume.questions.valide, 'question validée', 'questions validées')}</li>
            <li>{pluriel(resume.questions.a_relire, 'question à relire', 'questions à relire')}</li>
            <li>{pluriel(resume.questions.brouillon, 'brouillon', 'brouillons')}</li>
          </ul>
          <p>
            {resume.coursExistant
              ? `Ce cours existe déjà. ${resume.chapitresExistants.length > 0 ? `Chapitres déjà présents, qui seront mis à jour : ${resume.chapitresExistants.join(', ')}.` : 'Aucun de ces chapitres n’existe encore.'}`
              : 'Ce cours est nouveau.'}
          </p>
          <p>{etatV.publier ? 'Le cours et les nouveaux chapitres seront publiés.' : 'Rien ne sera publié : tu pourras le faire ensuite.'}</p>
          {echec && <p ref={echecRef} tabIndex={-1} role="alert" className="message-erreur">{echec}</p>}
          <form action={lancer} className="actions-formulaire">
            <input type="hidden" name="json" value={etatV.json} />
            <input type="hidden" name="publier" value={etatV.publier ? 'oui' : 'non'} />
            <input type="hidden" name="serie" value={String(etatV.serie ?? '')} />
            <button type="submit" className="bouton bouton-principal" disabled={importe}>{importe ? 'Import en cours…' : 'Importer'}</button>
          </form>
        </section>
      )}

      {termine && etatI.bilan && (
        <section className="carte resultat-import resultat-ok" aria-labelledby="titre-bilan">
          <h2 id="titre-bilan" tabIndex={-1} ref={bilanRef}>Import terminé : {etatI.titre}</h2>
          <p role="status">Le cours a été importé.</p>
          <dl className="bilan-import">
            {([['cree', 'Créées'], ['modifiee', 'Modifiées'], ['versionnee', 'Nouvelles versions'], ['inchangee', 'Inchangées'], ['archivee', 'Archivées'], ['supprimee', 'Supprimées']] as const)
              .map(([c, l]) => <div key={c}><dt>{l}</dt><dd>{etatI.bilan![c]}</dd></div>)}
          </dl>
          {etatI.bilan.chapitres_absents.length > 0 && (
            <p>Chapitres présents en base mais absents du fichier (laissés tels quels) : {etatI.bilan.chapitres_absents.join(', ')}.</p>
          )}
        </section>
      )}
    </>
  );
}
