import { ClientComponentLoader } from '@/components/ClientComponentLoader';
import { ClientSideAppProvider } from '@/components/ClientSideAppProvider';

export const metadata = {
  title: 'ASSET tracker | Colaboradores',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <ClientSideAppProvider>
          <ClientComponentLoader>{children}</ClientComponentLoader>
        </ClientSideAppProvider>
      </body>
    </html>
  );
}
