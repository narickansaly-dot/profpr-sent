import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { lireEnfants, lireProgressionEnfant } from '@/lib/parent/requetes';
import { etatConsentement, formaterDate } from '@/lib/parent/format';
import { formaterNote } from '@/lib/quiz/reponse';
import { ActionsEnfant } from '@/components/parent/ActionsEnfant';

export const metadata = { title: 'Suivi de mon enfant' };

export default async function PageEnfant({ params }: { params: Promise<{ id: string }> }) {
  const profil = await lireProfil();
  if (profil?.role !== 'parent') redirect('/');
  const { id } = await params;
  const enfant = (await lireEnfants()).find((e) => e.eleveId === id);
  if (!enfant) notFound();
  const lignes = await lireProgressionEnfant(id);
  return (
    <div className="page-parent">
      <p><Link href="/parent" className="lien-action">← Mes enfants</Link></p>
      <h1>{enfant.nom}</h1>
      <p>{etatConsentement({ moins15: enfant.moins15, donneLe: enfant.donneLe, retireLe: enfant.retireLe, suppressionPrevueLe: enfant.suppressionPrevueLe })}</p>
      {lignes.length === 0 ? (
        <p className="vide">Aucun cours à afficher pour l’instant.</p>
      ) : (
        <div className="defilement" tabIndex={0} role="region" aria-label={`Progression de ${enfant.nom}, défile horizontalement`}>
          <table className="tableau-suivi">
            <caption>Progression de {enfant.nom} par cours</caption>
            <thead>
              <tr>
                <th scope="col">Cours</th>
                <th scope="col">Chapitres validés</th>
                <th scope="col">Meilleure note à l’évaluation</th>
                <th scope="col">Cours validé</th>
                <th scope="col">Dernière activité</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l) => (
                <tr key={l.coursId}>
                  <th scope="row">{l.titre}</th>
                  <td>{l.chapitresValides} sur {l.chapitresTotal}</td>
                  <td>{l.meilleureNote === null ? '—' : formaterNote(l.meilleureNote)}</td>
                  <td>{l.coursValide ? 'Oui' : 'Non'}</td>
                  <td>{l.derniereActivite ? formaterDate(l.derniereActivite) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ActionsEnfant eleveId={enfant.eleveId} nom={enfant.nom}
        peutRetirer={enfant.moins15 && enfant.donneLe !== null && enfant.retireLe === null} retireParMoi={enfant.retireParMoi} moins15={enfant.moins15} />
    </div>
  );
}
