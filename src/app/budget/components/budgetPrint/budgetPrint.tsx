import styled from 'styled-components';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useRef } from 'react';
import { Budget } from '@/types/budget';
import { useReactToPrint } from 'react-to-print';

const TableContainer = styled.table`
  width: 100%;
  border: 1px solid #4e4e4e;
  border-spacing: 0;

  th,
  td {
    border-collapse: collapse;
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #4e4e4e;
  }

  th,
  td:not(:first-of-type) {
    border-left: 1px solid #4e4e4e;
  }

  th:first-of-type,
  td:first-of-type {
    border-left: none;
  }

  th:last-child,
  td:last-child {
    border-right: none;
  }

  th {
    font-weight: bold;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const Container = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 0.875rem;
  margin: 40px;
  @media print {
    display: block;
  }
`;

const HeaderToPDF = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ImageLogo = styled.div`
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

const TitleLogo = styled.div`
  display: flex;
  flex-direction: column;

  span:nth-child(1) {
    font-size: 25px;
    margin-left: 5px;
    font-weight: bold;
  }
  span {
    font-size: 15px;
    margin-left: 5px;
  }
`;

interface BudgetPrintProps {
  budget: any;
  clear: () => void;
}

const BudgetPrint: React.FC<BudgetPrintProps> = forwardRef(
  ({ budget, clear }) => {
    const printRef = useRef<HTMLDivElement>(null);

    function obterDataHoraAtual() {
      const agora = dayjs();
      const dataHoraFormatada = agora.format('DD [de] MMMM [de] YYYY, HH:mm');
      return dataHoraFormatada;
    }

    const print = useReactToPrint({
      documentTitle: 'Orçamento do Evento',
      content: () => printRef.current,
      onAfterPrint: () => clear,
    });

    useEffect(() => {
      print();

      console.log(budget);
    }, [print]);

    return (
      <Container ref={printRef}>
        <HeaderToPDF>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <ImageLogo>
              <img
                src="./img/teste02.png"
                alt="Logo da Empresa"
                style={{ width: '100px' }}
              />
            </ImageLogo>
            <TitleLogo>
              <span style={{ color: '#f0ccb7' }}>ASSET</span>
              <span style={{ color: 'black' }}>TRACKER</span>
            </TitleLogo>
          </div>
          <span>{obterDataHoraAtual()}</span>
        </HeaderToPDF>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h2>AGENDAMENTO</h2>
          <p>{budget?.Customer?.person.name}</p>
        </div>
      </Container>
    );
  }
);

BudgetPrint.displayName = 'BudgetPrint';

export { BudgetPrint };
