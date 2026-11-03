import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({ subsets: ['latin'], variable: '--police-fredoka' });
const nunito = Nunito({ subsets: ['latin'], variable: '--police-nunito' });

export const metadata: Metadata = {
  title: { default: 'App lycée', template: '%s · App lycée' },
  description: 'Cours détaillés, quiz et évaluations pour réussir au lycée.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
