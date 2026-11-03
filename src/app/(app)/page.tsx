import { listerCoursDuProfil } from '@/lib/contenu/requetes';
import { CarteCours } from '@/components/CarteCours';

export const metadata = { title: 'Mes cours' };

export default async function Accueil() {
  const cours = await listerCoursDuProfil();
  return (
    <>
      <h1>Mes cours</h1>
      {cours.length === 0
        ? <p className="carte">Les cours de ta filière arrivent bientôt. Reviens vite !</p>
        : <div className="grille-cours">{cours.map((c) => <CarteCours key={c.id} {...c} />)}</div>}
    </>
  );
}
