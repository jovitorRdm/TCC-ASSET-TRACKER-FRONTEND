'use client';

import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import styled from 'styled-components';
import { Button, Form, Image, Input } from 'antd';
import { ClientComponentLoader } from '../ClientComponentLoader';
import { ErrorMessages } from '@/types/messages';
import { LockFilled, UserOutlined } from '@ant-design/icons';
import { Console } from 'console';

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100vh;
  background-color: rgb(150, 117, 170);
  color: #fff;
  min-width: max-content;

  h4 {
    margin-bottom: 24px;
  }

  h6 {
    font-weight: 600;
    margin-top: 8px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 8px;

  div${Stack}:first-of-type {
    display: none;
  }

  div${Stack}:last-of-type {
    width: 100%;
    flex-grow: 1;
  }

  form {
    width: 100%;
    max-width: 415px;
    margin-top: 16px;
  }

  @media (max-width: 900px) {
    width: 100%;
    height: 100vh;
    padding: 40px 8px;

    div${Stack}:first-of-type {
      display: flex;
      color: #212330;
    }
  }
`;

export const LoginPageContent: React.FC = () => {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false); // o que e ?

  const initialValues = {
    email: '',
    password: '',
  };

  const onFinish = ({ email, password }: typeof initialValues) => {
    setIsLoading(true);

    console.log(password, email);

    authService
      .login(email, password)
      .then((token) => {
        setCookie('helloWorld', token, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
          secure: true,
        });
        push('/assignment');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Aside>
        <Stack>
          <Image
            src="\img\img-capa.svg"
            alt="Asset Tracker imagem capa"
            height={700}
            width={600}
          />
          <br />
          <h4 style={{ color: '#fff', textAlign: 'center' }}>
            Bem-vindo ao Sistema <br />
            <strong>Asset Tracker</strong>
          </h4>
        </Stack>
      </Aside>

      <Main>
        <ClientComponentLoader>
          <Stack>
            <h4>
              Bem-vindo ao Sistema <strong>Asset Tracker</strong>
            </h4>
          </Stack>

          <Stack>
            <p>Faça login para continuar</p>

            <Form
              size="large"
              initialValues={initialValues}
              onFinish={onFinish}
              disabled={isLoading}
            >
              <Form.Item
                required
                name="email"
                rules={[
                  { required: true, message: '' },
                  { type: 'email', message: ErrorMessages.MSGE06 },
                ]}
              >
                <Input placeholder="E-mail" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                required
                name="password"
                rules={[
                  { required: true, message: '' },
                  { type: 'string', min: 8, message: ErrorMessages.MSGE08 },
                  { type: 'string', max: 16, message: ErrorMessages.MSGE09 },
                ]}
              >
                <Input.Password placeholder="Senha" prefix={<LockFilled />} />
              </Form.Item>

              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Entrar
              </Button>
            </Form>
          </Stack>
        </ClientComponentLoader>
      </Main>
    </div>
  );
};
