// Ajoute à .env.local les clés VAPID, le secret d'envoi et celui du consentement parental s'ils manquent, sans jamais les afficher.
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import * as webpush from 'web-push';

const FICHIER = '.env.local';
const contenu = existsSync(FICHIER) ? readFileSync(FICHIER, 'utf8') : '';
const present = (cle: string) => new RegExp(`^${cle}=.+$`, 'm').test(contenu);

const ajouts: string[] = [];
if (!present('NEXT_PUBLIC_VAPID_PUBLIC_KEY') || !present('VAPID_PRIVATE_KEY')) {
  const cles = webpush.generateVAPIDKeys();
  ajouts.push(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${cles.publicKey}`, `VAPID_PRIVATE_KEY=${cles.privateKey}`);
}
if (!present('VAPID_SUJET')) ajouts.push('VAPID_SUJET=mailto:contact@example.com');
if (!present('ENVOI_SECRET')) ajouts.push(`ENVOI_SECRET=${randomBytes(32).toString('base64url')}`);
if (!present('CONSENTEMENT_SECRET')) ajouts.push(`CONSENTEMENT_SECRET=${randomBytes(32).toString('base64url')}`);
if (!present('ENVOI_URL')) ajouts.push('ENVOI_URL=http://host.docker.internal:3000/api/notifications/envoyer');

if (ajouts.length === 0) {
  console.log('Clés des notifications déjà présentes dans .env.local.');
} else {
  appendFileSync(FICHIER, (contenu.endsWith('\n') || contenu === '' ? '' : '\n') + '\n# Notifications\n' + ajouts.join('\n') + '\n');
  console.log(`${ajouts.length} variable(s) ajoutée(s) à .env.local (valeurs non affichées).`);
}
