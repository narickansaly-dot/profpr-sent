import { describe, expect, it } from 'vitest';
import { base64UrlVersOctets, estIphoneHorsEcranAccueil, nomAppareil } from './client';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
const FIREFOX = 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0';

describe('base64UrlVersOctets', () => {
  it('décode le base64 URL sans remplissage', () => {
    expect([...base64UrlVersOctets('AQID')]).toEqual([1, 2, 3]);
    expect([...base64UrlVersOctets('AQIDBA')]).toEqual([1, 2, 3, 4]);
    expect([...base64UrlVersOctets('-_8')]).toEqual([251, 255]);
  });
});

describe('estIphoneHorsEcranAccueil', () => {
  it('repère un iPhone dans Safari', () => expect(estIphoneHorsEcranAccueil(IPHONE, false, 5)).toBe(true));
  it('pas de guide une fois sur l’écran d’accueil', () => expect(estIphoneHorsEcranAccueil(IPHONE, true, 5)).toBe(false));
  it('repère un iPad qui se présente comme un Mac', () => expect(estIphoneHorsEcranAccueil(IPAD, false, 5)).toBe(true));
  it('un vrai Mac n’est pas concerné', () => expect(estIphoneHorsEcranAccueil(IPAD, false, 0)).toBe(false));
  it('Android n’est pas concerné', () => expect(estIphoneHorsEcranAccueil(ANDROID, false, 5)).toBe(false));
});

describe('nomAppareil', () => {
  it('nomme l’appareil sans détail identifiant', () => {
    expect(nomAppareil(IPHONE)).toBe('Safari sur iPhone');
    expect(nomAppareil(ANDROID)).toBe('Chrome sur Android');
    expect(nomAppareil(FIREFOX)).toBe('Firefox sur ordinateur');
  });
});
