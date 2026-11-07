import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { dateLienIcal } from '@/lib/calendrier/requetes';
import { GestionLienIcal } from '@/components/calendrier/GestionLienIcal';

export const metadata = { title: 'Partager mon calendrier' };

export default async function PagePartage() {
  await exigerEleve();
  const actifDepuis = await dateLienIcal();
  return (
    <div className="page-partage">
      <p><Link href="/calendrier">← Mon calendrier</Link></p>
      <h1>Ajouter mon calendrier à un autre agenda</h1>
      <p>Avec ce lien privé, Google Agenda, le Calendrier d’Apple ou Outlook affichent tes révisions, tes devoirs, tes examens et les échéances de tes classes. Ils se mettent à jour seuls, en général en quelques heures.</p>
      <p className="message-info">Ce lien donne accès à ton calendrier sans mot de passe&nbsp;: ne le partage pas. Tu peux le révoquer à tout moment.</p>
      <GestionLienIcal actifDepuis={actifDepuis} />
      <h2>Comment l’ajouter</h2>
      <ul className="regles">
        <li>Google Agenda, sur ordinateur&nbsp;: «&nbsp;Autres agendas&nbsp;», «&nbsp;+&nbsp;», puis «&nbsp;À partir de l’URL&nbsp;». Colle le lien.</li>
        <li>iPhone&nbsp;: Réglages, Calendrier, Comptes, Ajouter un compte, Autre, puis «&nbsp;Ajouter un calendrier avec abonnement&nbsp;».</li>
        <li>Outlook&nbsp;: «&nbsp;Ajouter un calendrier&nbsp;», puis «&nbsp;S’abonner à partir du web&nbsp;».</li>
      </ul>
    </div>
  );
}
