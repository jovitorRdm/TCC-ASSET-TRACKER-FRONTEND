'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export const ClientSideAppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());
  const [queryClient] = useState(() => new QueryClient());

  queryClient.setDefaultOptions({ queries: { refetchOnWindowFocus: false } });

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();

    styledComponentsStyleSheet.instance.clearTag();

    return <>{styles}</>;
  });

  return (
    <ConfigProvider
      locale={ptBR}
      componentSize="large"
      theme={{
        token: {
          colorPrimary: '#212330',
          colorPrimaryBg: '#bec4d4',
          fontFamily: 'var(--font-family)',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        {typeof window === 'undefined' ? (
          <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
            {children as React.ReactChild}
          </StyleSheetManager>
        ) : (
          <>{children}</>
        )}

        <ToastContainer limit={3} position="bottom-center" />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ConfigProvider>
  );
};
