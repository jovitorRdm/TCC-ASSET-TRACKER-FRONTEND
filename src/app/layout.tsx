import { ClientSideAppProvider } from '@/components/ClientSideAppProvider';
import '../style/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ClientComponentLoader } from '@/components/ClientComponentLoader';

export const metadata = {
  title: 'ASSET tracker',
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
