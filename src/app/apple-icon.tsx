import { ImageResponse } from 'next/og';
import { Icone } from '@/lib/pwa/icone';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<Icone taille={180} />, size);
}
