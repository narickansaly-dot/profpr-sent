import { creerClientServeur } from '@/lib/supabase/server';
import { cheminSuiteSur } from '@/lib/routes';
import { FormulaireBienvenue } from './FormulaireBienvenue';

export const metadata = { title: 'Bienvenue' };

export default async function PageBienvenue({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const suite = cheminSuiteSur((await searchParams).suite) ?? undefined;
  const supabase = await creerClientServeur();
  const { data: filieres, error } = await supabase.from('filiere').select('id, voie, nom').order('ordre');
  return (
    <main className="page-auth">
      <h1>Bienvenue !</h1>
      <p>Dis-nous où tu en es pour qu’on te montre les bons cours.</p>
      {error ? (
        <p role="alert" className="message-erreur">Impossible de charger les filières. Recharge la page.</p>
      ) : (
        <FormulaireBienvenue filieres={filieres ?? []} suite={suite} />
      )}
    </main>
  );
}
