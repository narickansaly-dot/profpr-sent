import { notFound } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { lireDemandesEnseignant } from '@/lib/enseignant/requetes';
import { FormulaireDemande } from './FormulaireDemande';
import { MessageStatut } from '@/components/admin/MessageStatut';

export const metadata = { title: 'Demandes enseignant' };
const jour = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

const CONFIRMATIONS: Record<string, string> = { accepte: 'Compte enseignant validé.', refuse: 'Demande refusée.' };

export default async function PageDemandes({ searchParams }: { searchParams: Promise<{ traite?: string | string[]; n?: string | string[] }> }) {
  const profil = await lireProfil();
  if (profil?.role !== 'admin_contenu') notFound();
  const { traite, n } = await searchParams;
  const confirmation = typeof traite === 'string' ? CONFIRMATIONS[traite] : undefined;
  const demandes = await lireDemandesEnseignant();
  return (
    <div className="admin-demandes">
      <h1>Demandes de comptes enseignants</h1>
      {/* Région toujours présente, hors de la liste ; le texte est inséré après le montage, il est donc annoncé. */}
      <MessageStatut texte={confirmation ?? ''} cle={typeof n === 'string' ? n : undefined} />
      {demandes.length === 0 ? (
        <p className="vide">Aucune demande en attente.</p>
      ) : (
        <ul className="liste-demandes">
          {demandes.map((d) => (
            <li key={d.id} className="carte demande">
              <div className="demande-infos">
                <h2>{d.nom}</h2>
                <p>{d.email}</p>
                <p>{d.etablissement}</p>
                <p className="vide">Demande du {jour.format(new Date(d.inscrit_le))}</p>
              </div>
              <FormulaireDemande profil={d.id} nom={d.nom} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
