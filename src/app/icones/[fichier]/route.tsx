import { ImageResponse } from 'next/og';
import { Icone } from '@/lib/pwa/icone';

const ICONES: Record<string, { taille: number; marge: number }> = {
  '192.png': { taille: 192, marge: 0 },
  '512.png': { taille: 512, marge: 0 },
  'maskable-512.png': { taille: 512, marge: 0.1 },
};

export const dynamic = 'force-static';
export function generateStaticParams() {
  return Object.keys(ICONES).map((fichier) => ({ fichier }));
}

export async function GET(_requete: Request, { params }: { params: Promise<{ fichier: string }> }) {
  const icone = ICONES[(await params).fichier];
  if (!icone) return new Response('Introuvable.', { status: 404 });
  return new ImageResponse(<Icone taille={icone.taille} marge={icone.marge} />, { width: icone.taille, height: icone.taille });
}
