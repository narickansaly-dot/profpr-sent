import { describe, expect, it, vi } from 'vitest';
import { delaiRelance, MAX_ESSAIS, traiterLot, type Envoyer, type LigneEnvoi } from './envoi';

const maintenant = new Date('2026-12-10T12:00:00Z'); // 13 h à Paris
const abo = (n: number) => ({ endpoint: `https://push.example/${n}`, p256dh: 'p'.repeat(87), auth: 'a'.repeat(22) });
const ligne = (autres: Partial<LigneEnvoi> = {}): LigneEnvoi => ({
  id: 'n1', eleve_id: 'e1', titre: 'Devoir', corps: 'Dans 1 heure', url: '/calendrier', envoi_prevu: '2026-12-10T11:59:00Z',
  essais: 0, silence_debut: '22:00:00', silence_fin: '07:00:00', abonnements: [abo(1)], ...autres,
});
const ok: Envoyer = async () => ({ ok: true });

describe('delaiRelance', () => {
  it('double à chaque essai', () => {
    expect([0, 1, 2, 3].map(delaiRelance)).toEqual([1, 2, 4, 8]);
    expect(MAX_ESSAIS).toBe(5);
  });
});

describe('traiterLot', () => {
  it('envoie et passe la notification à envoyée, avec une charge complète', async () => {
    const envoyer = vi.fn(ok);
    const r = await traiterLot([ligne()], envoyer, maintenant);
    expect(r).toEqual({ resultats: [{ id: 'n1', issue: 'envoyee' }], expires: [] });
    expect(JSON.parse(envoyer.mock.calls[0][1])).toEqual({ id: 'n1', titre: 'Devoir', corps: 'Dans 1 heure', url: '/calendrier' });
  });
  it('décale pendant les heures de silence sans rien envoyer', async () => {
    const envoyer = vi.fn(ok);
    const nuit = new Date('2026-12-10T22:30:00Z');
    const r = await traiterLot([ligne()], envoyer, nuit);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'decaler', a: '2026-12-11T06:00:00.000Z' }]);
    expect(envoyer).not.toHaveBeenCalled();
  });
  it('sans appareil, la notification reste dans la liste de rappels', async () => {
    const envoyer = vi.fn(ok);
    const r = await traiterLot([ligne({ abonnements: [] })], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'envoyee' }]);
    expect(envoyer).not.toHaveBeenCalled();
  });
  it('sans appareil pendant les heures de silence, la notification est envoyée sans être décalée', async () => {
    const envoyer = vi.fn(ok);
    const nuit = new Date('2026-12-10T22:30:00Z');
    const r = await traiterLot([ligne({ abonnements: [] })], envoyer, nuit);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'envoyee' }]);
    expect(envoyer).not.toHaveBeenCalled();
  });
  it('un appareil qui répond suffit, l’appareil expiré est signalé', async () => {
    const envoyer: Envoyer = async (a) => (a.endpoint.endsWith('/1') ? { ok: false, expire: true, temporaire: false } : { ok: true });
    const r = await traiterLot([ligne({ abonnements: [abo(1), abo(2)] })], envoyer, maintenant);
    expect(r).toEqual({ resultats: [{ id: 'n1', issue: 'envoyee' }], expires: ['https://push.example/1'] });
  });
  it('tous les appareils expirés : envoyée (liste de rappels), appareils retirés', async () => {
    const envoyer: Envoyer = async () => ({ ok: false, expire: true, temporaire: false });
    const r = await traiterLot([ligne()], envoyer, maintenant);
    expect(r).toEqual({ resultats: [{ id: 'n1', issue: 'envoyee' }], expires: ['https://push.example/1'] });
  });
  it('échec temporaire : nouvel essai plus tard', async () => {
    const envoyer: Envoyer = async () => ({ ok: false, expire: false, temporaire: true });
    const r = await traiterLot([ligne({ essais: 2 })], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'reessayer', a: '2026-12-10T12:04:00.000Z' }]);
  });
  it('échec temporaire au dernier essai : échec', async () => {
    const envoyer: Envoyer = async () => ({ ok: false, expire: false, temporaire: true });
    const r = await traiterLot([ligne({ essais: MAX_ESSAIS - 1 })], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'echec' }]);
  });
  it('échec définitif : échec', async () => {
    const envoyer: Envoyer = async () => ({ ok: false, expire: false, temporaire: false });
    const r = await traiterLot([ligne()], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'echec' }]);
  });
  it('une exception de l’envoyeur compte comme un échec temporaire', async () => {
    const envoyer: Envoyer = async () => { throw new Error('réseau'); };
    const r = await traiterLot([ligne()], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'reessayer', a: '2026-12-10T12:01:00.000Z' }]);
  });
  it('25 lignes, envoyeur qui répond en ordre inverse : l’ordre des lignes est gardé, les appareils expirés s’accumulent', async () => {
    const lignes = Array.from({ length: 25 }, (_, i) => ligne({ id: `n${i}`, abonnements: [abo(i)] }));
    const envoyer: Envoyer = async (a) => {
      const i = Number(a.endpoint.split('/').pop());
      await new Promise((r) => setTimeout(r, (25 - i) * 2));
      return i % 5 === 0 ? { ok: false, expire: true, temporaire: false } : { ok: true };
    };
    const r = await traiterLot(lignes, envoyer, maintenant);
    expect(r.resultats.map((x) => x.id)).toEqual(lignes.map((l) => l.id));
    expect(r.resultats.every((x) => x.issue === 'envoyee')).toBe(true);
    expect([...r.expires].sort()).toEqual([0, 5, 10, 15, 20].map((i) => `https://push.example/${i}`).sort());
  });
  it('un appareil expiré et un appareil en échec temporaire : nouvel essai, l’expiré est retiré', async () => {
    const envoyer: Envoyer = async (a) => (a.endpoint.endsWith('/1')
      ? { ok: false, expire: true, temporaire: false } : { ok: false, expire: false, temporaire: true });
    const r = await traiterLot([ligne({ abonnements: [abo(1), abo(2)] })], envoyer, maintenant);
    expect(r).toEqual({
      resultats: [{ id: 'n1', issue: 'reessayer', a: '2026-12-10T12:01:00.000Z' }], expires: ['https://push.example/1'],
    });
  });
  it('un appareil en échec temporaire et un en échec définitif : nouvel essai', async () => {
    const envoyer: Envoyer = async (a) => (a.endpoint.endsWith('/1')
      ? { ok: false, expire: false, temporaire: true } : { ok: false, expire: false, temporaire: false });
    const r = await traiterLot([ligne({ abonnements: [abo(1), abo(2)] })], envoyer, maintenant);
    expect(r).toEqual({ resultats: [{ id: 'n1', issue: 'reessayer', a: '2026-12-10T12:01:00.000Z' }], expires: [] });
  });
  it('un appareil expiré et un en échec définitif : échec, l’expiré est retiré', async () => {
    const envoyer: Envoyer = async (a) => (a.endpoint.endsWith('/1')
      ? { ok: false, expire: true, temporaire: false } : { ok: false, expire: false, temporaire: false });
    const r = await traiterLot([ligne({ abonnements: [abo(1), abo(2)] })], envoyer, maintenant);
    expect(r).toEqual({ resultats: [{ id: 'n1', issue: 'echec' }], expires: ['https://push.example/1'] });
  });
  it('s’arrête avant un paquet quand l’échéance est atteinte : pas de résultat pour les lignes non traitées', async () => {
    const lignes = Array.from({ length: 25 }, (_, i) => ligne({ id: `n${i}`, abonnements: [abo(i)] }));
    const envoyer = vi.fn(ok);
    let t = 0;
    const horloge = () => (t++ === 0 ? 0 : 100); // le premier paquet passe, le deuxième est refusé
    const r = await traiterLot(lignes, envoyer, maintenant, new Date(50), horloge);
    expect(r.resultats.map((x) => x.id)).toEqual(lignes.slice(0, 10).map((l) => l.id));
    expect(envoyer).toHaveBeenCalledTimes(10);
  });
  it('échéance déjà atteinte : rien n’est envoyé', async () => {
    const envoyer = vi.fn(ok);
    const r = await traiterLot([ligne()], envoyer, maintenant, new Date(0), () => 1);
    expect(r).toEqual({ resultats: [], expires: [] });
    expect(envoyer).not.toHaveBeenCalled();
  });
});
