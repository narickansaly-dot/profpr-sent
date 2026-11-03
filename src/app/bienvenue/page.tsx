import { creerClientServeur } from '@/lib/supabase/server';
import { FormulaireBienvenue } from './FormulaireBienvenue';

export const metadata = { title: 'Bienvenue' };

export default async function PageBienvenue() {
  const supabase = await creerClientServeur();
  const { data: filieres } = await supabase.from('filiere').select('id, voie, nom').order('ordre');
  return (
    <main className="page-auth">
      <h1>Bienvenue !</h1>
      <p>Dis-nous où tu en es pour qu’on te montre les bons cours.</p>
      <FormulaireBienvenue filieres={filieres ?? []} />
    </main>
  );
}
