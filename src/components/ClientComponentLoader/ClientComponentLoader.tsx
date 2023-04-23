import { useEffect, useState } from 'react';

interface ClientComponentLoaderProps {
  loader?: React.ReactNode;
  children: React.ReactNode;
}

export const ClientComponentLoader: React.FC<ClientComponentLoaderProps> = ({
  loader = null,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return <>{isLoading ? loader : children}</>;
};
