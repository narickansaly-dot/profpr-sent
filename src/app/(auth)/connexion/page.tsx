import Link from 'next/link';
import { connecter, connecterAvecGoogle } from '../actions';
import { FormulaireIdentifiants } from '../FormulaireIdentifiants';

export const metadata = { title: 'Connexion' };

export default async function PageConnexion({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  return (
    <main className="page-auth">
      <h1>Content de te revoir !</h1>
      {erreur === 'google' && <p role="alert" className="message-erreur">La connexion avec Google a échoué. Réessaie.</p>}
      <FormulaireIdentifiants action={connecter} libelle="Se connecter" autocompleteMotDePasse="current-password" />
      <form action={connecterAvecGoogle}>
        <button type="submit" className="bouton bouton-secondaire">Continuer avec Google</button>
      </form>
      <p>Pas encore de compte ? <Link href="/inscription">Créer un compte</Link></p>
    </main>
  );
}
