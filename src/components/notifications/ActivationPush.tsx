'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { activerPush, desactiverPush, lireEtatPush, nomAppareil, type EtatPush } from '@/lib/notifications/client';
import { enregistrerAbonnement, oublierAppareilCourant } from '@/app/(app)/notifications/actions';
import { GuideIphone } from './GuideIphone';

export function ActivationPush({ clePublique, onActive }: { clePublique: string; onActive?: () => void }) {
  const router = useRouter();
  const [etat, setEtat] = useState<EtatPush | 'chargement'>('chargement');
  const [message, setMessage] = useState('');
  const [enCours, demarrer] = useTransition();

  useEffect(() => {
    lireEtatPush().then(setEtat).catch(() => setEtat('non_supporte'));
  }, []);

  function activer() {
    setMessage('');
    // Rien n'est attendu avant activerPush : Safari exige que la demande d'autorisation parte du clic.
    demarrer(async () => {
      try {
        const r = await activerPush(clePublique);
        if (r === 'refuse') { setEtat('refuse'); return; }
        if (r === 'ignore') { setMessage('Autorisation non accordée. Réessaie quand tu veux.'); return; }
        if (r === 'indisponible') {
          setMessage('Les notifications ne sont pas disponibles sur cette version de l’application.');
          return;
        }
        const enregistre = await enregistrerAbonnement(r, nomAppareil(navigator.userAgent));
        if (enregistre.erreur) { setMessage(enregistre.erreur); return; }
        setEtat('actif');
        setMessage('Notifications activées sur cet appareil.');
        onActive?.();
        router.refresh();
      } catch {
        setMessage('L’activation a échoué. Réessaie dans un instant.');
      }
    });
  }

  function desactiver() {
    setMessage('');
    demarrer(async () => {
      try {
        const endpoint = await desactiverPush();
        if (endpoint) await oublierAppareilCourant(endpoint);
        setEtat('inactif');
        setMessage('Notifications désactivées sur cet appareil.');
        router.refresh();
      } catch {
        setMessage('La désactivation a échoué. Réessaie dans un instant.');
      }
    });
  }

  return (
    <div className="activation-push">
      {etat === 'chargement' && <p>Vérification de cet appareil…</p>}
      {etat === 'iphone_installer' && <GuideIphone />}
      {etat === 'non_supporte' && <p>Ce navigateur ne reçoit pas de notifications. Tes rappels restent visibles dans la page Rappels.</p>}
      {etat === 'refuse' && (
        <p>Tu as bloqué les notifications pour ce site. Pour les réactiver, change l’autorisation dans les réglages de ton navigateur. Tes rappels restent visibles dans la page Rappels.</p>
      )}
      {etat === 'inactif' && (
        <button type="button" className="bouton bouton-principal" onClick={activer} disabled={enCours}>
          {enCours ? 'Activation…' : 'Activer les notifications'}
        </button>
      )}
      {etat === 'actif' && (
        <button type="button" className="bouton bouton-secondaire" onClick={desactiver} disabled={enCours}>
          {enCours ? 'Désactivation…' : 'Désactiver sur cet appareil'}
        </button>
      )}
      <p role="status" className="message-info">{message}</p>
    </div>
  );
}
