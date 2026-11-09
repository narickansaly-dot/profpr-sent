const echapper = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** E-mail envoyé au parent d'un élève de moins de 15 ans (vouvoiement). */
export function emailConsentement(o: { prenom: string; lien: string }): { sujet: string; texte: string; html: string } {
  if (!/^https?:\/\//.test(o.lien)) throw new Error('lien invalide');
  const prenom = o.prenom.trim() || 'Votre enfant';
  const sujet = `${prenom} a besoin de votre accord pour utiliser App lycée`;
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
