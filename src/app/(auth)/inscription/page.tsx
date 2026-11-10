import Link from 'next/link';
import { inscrire, connecterAvecGoogle } from '../actions';
import { cheminSuiteSur } from '@/lib/routes';
import { ViderCachePages } from '@/components/ViderCachePages';
import { FormulaireIdentifiants } from '../FormulaireIdentifiants';

export const metadata = { title: 'Créer un compte' };

export default async function PageInscription({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const suite = cheminSuiteSur((await searchParams).suite) ?? undefined;
  const parametre = suite ? `?suite=${encodeURIComponent(suite)}` : '';
  return (
    <main id="contenu" tabIndex={-1} className="page-auth">
      <ViderCachePages />
      <h1>Crée ton compte</h1>
      <p>7 jours pour découvrir tous les cours, gratuitement.</p>
      <FormulaireIdentifiants action={inscrire} libelle="Créer mon compte" autocompleteMotDePasse="new-password" suite={suite} />
      <form action={connecterAvecGoogle}>
        <button type="submit" className="bouton bouton-secondaire">Continuer avec Google</button>
      </form>
      <p>Tu as déjà un compte ? <Link href={`/connexion${parametre}`}>Se connecter</Link></p>
    </main>
  );
}
