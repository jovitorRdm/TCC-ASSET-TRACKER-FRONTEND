import { ClientSideAppProvider } from '@/components/ClientSideAppProvider';
import './globals.css';

export const metadata = {
  title: 'Events',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <ClientSideAppProvider>{children}</ClientSideAppProvider>
      </body>
    </html>
  );
}
