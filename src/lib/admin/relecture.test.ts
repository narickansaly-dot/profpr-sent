import { describe, expect, it } from 'vitest';
import { libelleCase, lireSelection, messageLot, toutEstCoche } from './relecture';

const U1 = '11111111-1111-4111-8111-111111111111';
const U2 = '22222222-2222-4222-8222-222222222222';

function form(ids: string[], statut: string) {
  const f = new FormData();
  ids.forEach((i) => f.append('ids', i));
  f.set('statut', statut);
  return f;
}

describe('relecture en lot', () => {
  it('lit les identifiants cochés et le statut', () => {
    expect(lireSelection(form([U1, U2], 'valide'))).toEqual({ ok: true, ids: [U1, U2], statut: 'valide' });
  });
  it('refuse une sélection vide', () => {
    expect(lireSelection(form([], 'valide'))).toEqual({ ok: false, erreur: 'Coche au moins une question.' });
  });
  it('refuse un identifiant invalide ou un statut non prévu', () => {
    expect(lireSelection(form(['x'], 'valide')).ok).toBe(false);
    expect(lireSelection(form([U1], 'archivee')).ok).toBe(false);
  });
  it('refuse plus de 200 questions', () => {
    const ids = Array.from({ length: 201 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`);
    expect(lireSelection(form(ids, 'valide'))).toEqual({ ok: false, erreur: 'Sélectionne au plus 200 questions à la fois.' });
  });
  it('rédige le message de résultat', () => {
    expect(messageLot(1, 'valide')).toBe('1 question validée.');
    expect(messageLot(24, 'valide')).toBe('24 questions validées.');
    expect(messageLot(3, 'brouillon')).toBe('3 questions repassées en brouillon.');
  });
});

describe('libelleCase', () => {
  it('porte la source quand elle existe', () => {
    expect(libelleCase({ source: 'bph:ch1:banque:012', enonce: 'Quelle est la réponse ?' })).toBe('Sélectionner la question bph:ch1:banque:012');
  });
  it('retombe sur les 40 premiers caractères de l’énoncé sans source', () => {
    const enonce = 'Quelle est la fréquence cardiaque normale au repos chez un adulte ?';
    expect(libelleCase({ source: null, enonce })).toBe(`Sélectionner la question ${enonce.slice(0, 40).trim()}`);
    expect(libelleCase({ source: '  ', enonce: 'Court' })).toBe('Sélectionner la question Court');
  });
});

describe('toutEstCoche', () => {
  it('suit l’état réel des cases', () => {
    expect(toutEstCoche([], new Set())).toBe(false);
    expect(toutEstCoche(['a', 'b'], new Set(['a']))).toBe(false);
    expect(toutEstCoche(['a', 'b'], new Set(['a', 'b']))).toBe(true);
    expect(toutEstCoche(['a'], new Set(['a', 'disparue']))).toBe(true);
  });
});
