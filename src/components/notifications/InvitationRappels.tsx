'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lireEtatPush } from '@/lib/notifications/client';
import { ActivationPush } from './ActivationPush';

const CLE = 'rappels-invitation-masquee';

/** Invitation au bon moment : le calendrier contient un événement et cet appareil n'a encore rien décidé. */
export function InvitationRappels({ clePublique }: { clePublique: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let masquee = false;
    try { masquee = localStorage.getItem(CLE) === '1'; } catch { /* stockage indisponible : on affiche */ }
    if (masquee) return;
    lireEtatPush().then((e) => setVisible(e === 'inactif' || e === 'iphone_installer')).catch(() => {});
  }, []);

  if (!visible) return null;
  function plusTard() {
    try { localStorage.setItem(CLE, '1'); } catch { /* rien */ }
    setVisible(false);
  }
  return (
    <section className="carte invitation-rappels" aria-labelledby="invitation-rappels-titre">
      <h2 id="invitation-rappels-titre">Active les rappels</h2>
      <p>Reçois un rappel avant tes révisions et tes devoirs, même quand l’application est fermée. Tu choisis ce que tu reçois dans <Link href="/notifications">tes réglages</Link>.</p>
      <ActivationPush clePublique={clePublique} onActive={() => setVisible(false)} />
      <button type="button" className="bouton bouton-secondaire" onClick={plusTard} aria-label="Plus tard pour les rappels">Plus tard</button>
    </section>
  );
}
