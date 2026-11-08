import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { optionsCours } from '@/lib/calendrier/requetes';
import { estJourValide, jourParis } from '@/lib/calendrier/dates';
import { TYPES_EVENEMENT } from '@/lib/calendrier/schema-evenement';
import { FormulaireEvenement } from '@/components/calendrier/FormulaireEvenement';

export const metadata = { title: 'Nouvel événement' };

export default async function PageNouvelEvenement({ searchParams }: { searchParams: Promise<{ jour?: string; type?: string }> }) {
  await exigerEleve();
  const { jour, type } = await searchParams;
  const cours = await optionsCours();
  return (
    <div className="page-evenement">
      <p><Link href="/calendrier">← Mon calendrier</Link></p>
      <h1>Nouvel événement</h1>
      <FormulaireEvenement cours={cours} initial={{
        type: (TYPES_EVENEMENT as readonly string[]).includes(type ?? '') ? type! : 'revision',
        titre: '', jour: jour && estJourValide(jour) ? jour : jourParis(new Date()), heure: '17:00', duree: '60',
        cours: '', chapitres: [], repetition: 'aucune', jours: [], jusqu: '', rappel: '',
      }} />
    </div>
  );
}
