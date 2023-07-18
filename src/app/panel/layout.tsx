import { ClientSideAppProvider } from '@/components/ClientSideAppProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Asset Tracker - Gestão de Eventos',
    template: 'TCC Asset Tracker - %s',
  },

  description: 'Sistema Web desenvolvido para TCC de Sistemas de Informação',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientSideAppProvider>{children}</ClientSideAppProvider>
      </body>
    </html>
  );
}
