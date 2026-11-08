import { describe, expect, it } from 'vitest';
import { hoteDePushAutorise } from './webpush';

describe('hoteDePushAutorise', () => {
  it('accepte les services push connus', () => {
    for (const e of [
      'https://fcm.googleapis.com/fcm/send/abc',
      'https://updates.push.services.mozilla.com/wpush/v2/abc',
      'https://autre.push.services.mozilla.com/x',
      'https://web.push.apple.com/QAbc',
      'https://db5.notify.windows.com/?token=abc',
      'https://FCM.googleapis.com/x',
    ]) expect(hoteDePushAutorise(e), e).toBe(true);
  });
  it('refuse les autres hôtes et les contournements', () => {
    for (const e of [
      'https://evil.example/x',
      'https://fcm.googleapis.com.evil.example/x',
      'https://evil.example\\.push.apple.com/x',
      'https://u@fcm.googleapis.com/x',
      'https://fcm.googleapis.com:443/x',
      'http://fcm.googleapis.com/x',
      'https://fcm.googleapis.com./x',
      'https://a..push.apple.com/x',
      'https://push.apple.com/x',
      'https://fcm.googleapis.com/x y',
      'https://fcm.googleapis.com/\nx',
      '',
    ]) expect(hoteDePushAutorise(e), e).toBe(false);
  });
});
