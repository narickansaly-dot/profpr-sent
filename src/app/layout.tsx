import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import { Fredoka, Nunito } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { EnregistrementSW } from '@/components/EnregistrementSW';
import { PiedDePage } from '@/components/PiedDePage';

const fredoka = Fredoka({ subsets: ['latin'], variable: '--police-fredoka' });
const nunito = Nunito({ subsets: ['latin'], variable: '--police-nunito' });
// Police de secours pour la flèche des vecteurs (U+20D7, « AB⃗ ») que Nunito et Fredoka n'ont pas : sans elle, la flèche
// s'affiche comme un carré vide. Le navigateur cherche dans la liste des polices une police qui contient à la fois la lettre
// et la flèche ; STIX Two Text (licence SIL OFL 1.1, voir polices/OFL.txt) les a. Pas de préchargement : seules les pages
// qui contiennent un caractère absent de Nunito la téléchargent.
const secours = localFont({
  src: [
    { path: './polices/STIXTwoText.ttf', weight: '400 700', style: 'normal' },
    { path: './polices/STIXTwoText-Italic.ttf', weight: '400 700', style: 'italic' },
  ],
  variable: '--police-secours',
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: { default: 'App lycée', template: '%s · App lycée' },
  description: 'Cours détaillés, quiz et évaluations pour réussir au lycée.',
  applicationName: 'App lycée',
  appleWebApp: { capable: true, title: 'App lycée', statusBarStyle: 'default' },
};

export const viewport: Viewport = { themeColor: '#4f46e5' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Rendu à la demande : chaque réponse porte le nonce de sa requête (voir proxy.ts).
  await connection();
  return (
    <html lang="fr" className={`${fredoka.variable} ${nunito.variable} ${secours.variable}`}>
      <body>
        <a href="#contenu" className="lien-evitement">Aller au contenu</a>
        {children}
        <PiedDePage />
        <EnregistrementSW />
      </body>
    </html>
  );
}
