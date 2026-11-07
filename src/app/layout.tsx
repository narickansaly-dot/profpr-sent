import type { Metadata, Viewport } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';
import { EnregistrementSW } from '@/components/EnregistrementSW';

const fredoka = Fredoka({ subsets: ['latin'], variable: '--police-fredoka' });
const nunito = Nunito({ subsets: ['latin'], variable: '--police-nunito' });

export const metadata: Metadata = {
  title: { default: 'App lycée', template: '%s · App lycée' },
  description: 'Cours détaillés, quiz et évaluations pour réussir au lycée.',
  applicationName: 'App lycée',
  appleWebApp: { capable: true, title: 'App lycée', statusBarStyle: 'default' },
};

export const viewport: Viewport = { themeColor: '#4f46e5' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        {children}
        <EnregistrementSW />
      </body>
    </html>
  );
}
