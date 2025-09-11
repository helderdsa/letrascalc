import React from 'react';
import type { ResultadoCalculo } from '../utils/calculadoraLetras';
import './ResultadoCalculo.css';

interface Props {
  resultado: ResultadoCalculo | null;
  proximaProgressao: { ano: number; letra: string; meses: number } | null;
}

const ResultadoCalculoComponent: React.FC<Props> = ({ resultado, proximaProgressao }) => {
  if (!resultado) {
    return null;
  }

  const getSituacaoClass = (situacao: ResultadoCalculo['situacao']) => {
    switch (situacao) {
      case 'em_estagio':
        return 'situacao-estagio';
      case 'pode_progredir':
        return 'situacao-progresso';
      case 'atualizado':
        return 'situacao-atualizado';
      default:
        return 'situacao-normal';
    }
  };

  const getSituacaoTexto = (situacao: ResultadoCalculo['situacao']) => {
    switch (situacao) {
      case 'em_estagio':
        return 'Em Estágio Probatório';
      case 'pode_progredir':
        return 'Pode Progredir';
      case 'atualizado':
        return 'Situação Atualizada';
      default:
        return 'Aprovado';
    }
  };

  return (
    <div className="resultado-container">
      <div className="resultado-header">
        <h3>Resultado do Cálculo</h3>
        <div className={`situacao-badge ${getSituacaoClass(resultado.situacao)}`}>
          {getSituacaoTexto(resultado.situacao)}
        </div>
      </div>

      <div className="resultado-content">
        {/* Resumo Principal - Letras lado a lado com seta sobreposta */}
        <div className="letras-comparacao">
          <div className="cards-container">
            <div className="letra-card letra-atual">
              <div className="letra-header">Letra Atual</div>
              <div className="letra-valor">{resultado.letraAtual}</div>
            </div>
            <div className="letra-card letra-calculada">
              <div className="letra-header">Letra Calculada</div>
              <div className="letra-valor">{resultado.letraCalculada}</div>
            </div>
            <div className="arrow-overlay">→</div>
          </div>
        </div>

        <hr className="separator" />

        {/* Informações de Serviço */}
        <div className="info-section">
          <h4>Informações do Serviço</h4>
          <div className="info-grid">
            <div className="info-pair">
              <span className="info-label">Anos de Serviço:</span>
              <span className="info-value">{resultado.anosServico} anos</span>
            </div>
            <div className="info-pair">
              <span className="info-label">Progressões Normais:</span>
              <span className="info-value">{resultado.progressoesNormais}</span>
            </div>
            {resultado.progressaoDecreto && (
              <div className="info-pair decreto-info">
                <span className="info-label">Decreto 30.974/2021:</span>
                <span className="info-value">✓ Beneficiado (+2 letras)</span>
              </div>
            )}
          </div>
        </div>

        {/* Próxima Progressão */}
        {proximaProgressao && (
          <>
            <hr className="separator" />
            <div className="info-section">
              <h4>Próxima Progressão</h4>
              <div className="progressao-content">
                <p>Em <strong>{proximaProgressao.ano}</strong> você poderá progredir para a letra <strong>{proximaProgressao.letra}</strong></p>
                <p className="tempo-restante">
                  (aproximadamente {Math.round(proximaProgressao.meses)} meses)
                </p>
              </div>
            </div>
          </>
        )}

        <hr className="separator" />

        {/* Detalhes do Cálculo */}
        <div className="info-section">
          <h4>Detalhes do Cálculo</h4>
          <div className="detalhes-list">
            {resultado.detalhes.map((detalhe, index) => (
              <div key={index} className="detalhe-line">
                {detalhe}
              </div>
            ))}
          </div>
        </div>

        <hr className="separator" />

        {/* Informações do Decreto */}
        <div className="info-section">
          <h4>Sobre o Decreto 30.974/2021</h4>
          <div className="decreto-content">
            <p>
              O Decreto 30.974/2021 concede uma progressão de duas letras para professores que 
              já haviam completado o estágio probatório em 15 de outubro de 2021.
            </p>
            {resultado.progressaoDecreto ? (
              <p className="decreto-status beneficiado">
                ✅ Você foi beneficiado por este decreto!
              </p>
            ) : (
              <p className="decreto-status nao-beneficiado">
                ℹ️ Você não foi beneficiado por este decreto pois concluiu o estágio probatório após 15/10/2021.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoCalculoComponent;