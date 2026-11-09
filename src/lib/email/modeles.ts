const echapper = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const estLocal = (h: string) => h === 'localhost' || h === '127.0.0.1';

/** Le lien doit être en https (ou http en local) et appartenir à l'origine du site ; sans origine configurée, seul l'hôte local est accepté. */
function verifierLien(lien: string, origine: string | undefined): void {
  let u: URL;
  try {
    if (/[\s\u0000-\u001f]/.test(lien)) throw new Error();
    u = new URL(lien);
  } catch {
    throw new Error('lien invalide');
  }
  const protocoleOk = u.protocol === 'https:' || (u.protocol === 'http:' && estLocal(u.hostname));
  if (!protocoleOk) throw new Error('lien invalide');
  if (origine) {
    let attendue: string;
    try { attendue = new URL(origine).origin; } catch { throw new Error('lien invalide'); }
    if (u.origin !== attendue) throw new Error('lien invalide');
  } else if (!estLocal(u.hostname)) {
    throw new Error('lien invalide');
  }
}

/** E-mail envoyé au parent d'un élève de moins de 15 ans (vouvoiement). */
export function emailConsentement(o: { prenom: string; lien: string; origine?: string }): { sujet: string; texte: string; html: string } {
  verifierLien(o.lien, o.origine ?? process.env.NEXT_PUBLIC_SITE_URL);
  const prenom = o.prenom.replace(/[\r\n]+/g, ' ').trim().slice(0, 50) || 'Votre enfant';
  // Sujet sans le prénom : il reste lisible dans les aperçus de messagerie et les journaux du serveur d'e-mail.
  const sujet = 'Un accord parental est demandé pour App lycée';
  const texte = [
    'Bonjour,',
    '',
    `${prenom} s’est inscrit ou inscrite sur App lycée, une application de cours et de quiz pour le lycée.`,
    'Comme il ou elle a moins de 15 ans, nous avons besoin de votre accord avant de lui ouvrir les cours.',
    '',
    `Pour donner votre accord, ouvrez ce lien : ${o.lien}`,
    'Ce lien est valable 7 jours.',
    '',
    'Si vous ne connaissez pas cette demande, ignorez simplement cet e-mail.',
  ].join('\n');
  const lien = echapper(o.lien);
  const html = `<p>Bonjour,</p>
<p>${echapper(prenom)} s’est inscrit ou inscrite sur App lycée, une application de cours et de quiz pour le lycée.
Comme il ou elle a moins de 15 ans, nous avons besoin de votre accord avant de lui ouvrir les cours.</p>
<p><a href="${lien}">Donner mon accord</a></p>
<p>Ce lien est valable 7 jours. Si le bouton ne fonctionne pas, copiez cette adresse dans votre navigateur&nbsp;: ${lien}</p>
<p>Si vous ne connaissez pas cette demande, ignorez simplement cet e-mail.</p>`;
  return { sujet, texte, html };
}
