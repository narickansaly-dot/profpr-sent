import Link from 'next/link';
import { exigerAdmin } from '@/lib/admin/garde';
import { lireSuiviContenu, type LigneSuiviContenu } from '@/lib/admin/requetes';
import { couleurCoursAcceptable } from '@/lib/contenu/couleur';
import { BarreProgression } from '@/components/BarreProgression';
import { MessageStatut } from '@/components/admin/MessageStatut';
import { BoutonPublier } from '@/components/admin/BoutonPublier';
import { creerClientServeur } from '@/lib/supabase/server';

export const metadata = { title: 'Suivi du contenu' };

const OBJECTIF = 150;
const SEUIL = 30;
const CONFIRMATIONS: Record<string, string> = { cours: 'Cours enregistré.' };

type Bloc = { id: string; slug: string; titre: string; publie: boolean; chapitres: LigneSuiviContenu[] };

function grouper(lignes: LigneSuiviContenu[]): Bloc[] {
  const blocs = new Map<string, Bloc>();
  for (const l of lignes) {
    let b = blocs.get(l.cours_id);
    if (!b) { b = { id: l.cours_id, slug: l.cours_slug, titre: l.cours_titre, publie: l.cours_publie, chapitres: [] }; blocs.set(l.cours_id, b); }
    if (l.chapitre_id) b.chapitres.push(l);
  }
  return [...blocs.values()];
}

export default async function PageAdmin({ searchParams }: { searchParams: Promise<{ enregistre?: string | string[] }> }) {
  await exigerAdmin();
  const { enregistre } = await searchParams;
  const confirmation = typeof enregistre === 'string' ? CONFIRMATIONS[enregistre] : undefined;
  const [lignes, couleurs] = await Promise.all([lireSuiviContenu(), lireCouleurs()]);
  const blocs = grouper(lignes);
  return (
    <div className="page-admin">
      <h1>Suivi du contenu</h1>
      {/* Région toujours présente : son texte change sans qu'elle soit démontée, il est donc annoncé. */}
      <MessageStatut texte={confirmation ?? ''} />
      {blocs.length === 0 ? (
        <p className="vide">Aucun cours pour l’instant. Importe un fichier ou crée un cours.</p>
      ) : blocs.map((b) => {
        const couleur = couleurs.get(b.id);
        const idTitre = `cours-${b.id}`;
        return (
          <section key={b.id} className="carte bloc-cours" aria-labelledby={idTitre}
            style={couleur && couleurCoursAcceptable(couleur) ? { ['--couleur-bloc' as string]: couleur } : undefined}>
            <div className="entete-bloc">
              <div className="titre-bloc">
                <span className="pastille-couleur" aria-hidden="true" />
                <h2 id={idTitre}>{b.titre}</h2>
                <span className={`statut ${b.publie ? 'statut-publie' : 'statut-brouillon'}`}>{b.publie ? 'Publié' : 'Brouillon'}</span>
              </div>
              <div className="actions-bloc">
                <Link href={`/admin/cours/${b.id}`} className="bouton bouton-secondaire">
                  Modifier le cours<span className="sr-only"> {b.titre}</span>
                </Link>
                <BoutonPublier type="cours" id={b.id} publie={b.publie} nom={b.titre} />
              </div>
            </div>
            {b.chapitres.length === 0 ? (
              <p className="vide">Aucun chapitre dans ce cours.</p>
            ) : (
              <div className="defilement" role="region" aria-label={`Chapitres de ${b.titre}`} tabIndex={0}>
                <table className="tableau-suivi tableau-contenu">
                  <thead>
                    <tr>
                      <th scope="col" className="col-eleve col-ligne">Chapitre</th>
                      <th scope="col">Validées</th>
                      <th scope="col" className="num">À relire</th>
                      <th scope="col" className="num">Brouillons</th>
                      <th scope="col" className="num">Signalements</th>
                      <th scope="col">Publié</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.chapitres.map((c) => {
                      const valides = c.valides ?? 0;
                      const titre = `Ch. ${c.numero} — ${c.chapitre_titre}`;
                      return (
                        <tr key={c.chapitre_id}>
                          <th scope="row" className="col-eleve col-ligne">{titre}</th>
                          <td>
                            <span className="fraction">{valides} / {OBJECTIF}</span>
                            <BarreProgression valeur={Math.min(valides, OBJECTIF)} max={OBJECTIF} libelle={`Questions validées, ${titre}`} />
                            {valides < SEUIL && (
                              <span className="insuffisante">
                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                                  <path d="M12 3 2 21h20L12 3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                  <path d="M12 10v5M12 18v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Banque insuffisante
                              </span>
                            )}
                          </td>
                          <td className="num">{c.a_relire ?? 0}</td>
                          <td className="num">{c.brouillons ?? 0}</td>
                          <td className="num">
                            {(c.signalements ?? 0) > 0
                              ? <Link href="/admin/signalements" className="lien-signalements">{c.signalements}<span className="sr-only"> signalements, voir la liste</span></Link>
                              : 0}
                          </td>
                          <td>
                            <div className="cellule-publie">
                              <span className={`statut ${c.chapitre_publie ? 'statut-publie' : 'statut-brouillon'}`}>{c.chapitre_publie ? 'Oui' : 'Non'}</span>
                              <BoutonPublier type="chapitre" id={c.chapitre_id!} publie={!!c.chapitre_publie} nom={titre} compact />
                            </div>
                          </td>
                          <td>
                            <div className="liens-actions">
                              <Link href={`/admin/chapitres/${c.chapitre_id}`}>Modifier<span className="sr-only"> {titre}</span></Link>
                              <Link href={`/admin/chapitres/${c.chapitre_id}/questions`}>Questions<span className="sr-only"> de {titre}</span></Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <p className="pied-bloc">
              <Link href={`/admin/cours/${b.id}/chapitres/nouveau`} className="bouton bouton-secondaire">
                Nouveau chapitre<span className="sr-only"> dans {b.titre}</span>
              </Link>
            </p>
          </section>
        );
      })}
      <p><Link href="/admin/cours/nouveau" className="bouton bouton-principal">Nouveau cours</Link></p>
    </div>
  );
}

/** Couleurs des cours (la fonction de suivi ne les renvoie pas). Le contraste est revérifié avant usage. */
async function lireCouleurs(): Promise<Map<string, string>> {
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('cours').select('id, couleur');
  return new Map((data ?? []).map((c) => [c.id, c.couleur]));
}
