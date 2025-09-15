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
        
        {/* Cards ADTS lado a lado com seta sobreposta */}
        <div className="letras-comparacao" style={{
          borderRadius: '20px',
          padding: '20px 15px',
          margin: '20px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: '#ffffff'
        }}>
          <div className="cards-container">
            <div 
              className={`adts-card adts-atual ${resultado.adtsCorreto ? 'adts-correto' : 'adts-incorreto'}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                padding: '25px 15px',
                borderRadius: '16px',
                flex: 1,
                maxWidth: '180px',
                minWidth: '140px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease',
                background: resultado.adtsCorreto ? 
                  'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 
                  'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                  color: 'white'
                }}
            >
              <div className="adts-header" style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                color: 'white',
                WebkitTextFillColor: 'white'
              }}>ADTS Atual</div>
              <div className="adts-valor" style={{
                fontSize: '32px',
                fontWeight: 900,
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                WebkitTextFillColor: 'white'
              }}>{resultado.adtsAtual}%</div>
            </div>
            <div 
              className="adts-card adts-calculado"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                padding: '25px 15px',
                borderRadius: '16px',
                flex: 1,
                maxWidth: '180px',
                minWidth: '140px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease',
                background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                color: 'white'
              }}
            >
              <div className="adts-header" style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                color: 'white',
                WebkitTextFillColor: 'white'
              }}>ADTS Correto</div>
              <div className="adts-valor" style={{
                fontSize: '32px',
                fontWeight: 900,
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                WebkitTextFillColor: 'white'
              }}>{resultado.adtsPercentual}%</div>
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
              <span className="info-label">ADTS (Quinquênios):</span>
              <span className="info-value">{resultado.adtsQuinquenios} × 5% = {resultado.adtsPercentual}%</span>
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
            {resultado.progressaoLCE405 && (
              <div className="info-pair decreto-info">
                <span className="info-label">LCE 405/2009:</span>
                <span className="info-value">✓ Beneficiado (+1 letra)</span>
              </div>
            )}
            {resultado.progressaoLCE503 && (
              <div className="info-pair decreto-info">
                <span className="info-label">LCE 503/2014:</span>
                <span className="info-value">✓ Beneficiado (+1 letra)</span>
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

        {/* Informações de Retroativo */}
        {resultado.retroativo && (
          <>
            <div className="info-section retroativo-section">
              <h4>💰 Valor Retroativo a Receber</h4>
              <div className="retroativo-content">
                <div className="valor-principal">
                  <span className="valor-label">Valor Total:</span>
                  <span className="valor-destaque">R$ {resultado.retroativo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="info-grid">
                  <div className="info-pair">
                    <span className="info-label">Período:</span>
                    <span className="info-value">
                      {resultado.retroativo.dataInicio.toLocaleDateString('pt-BR')} até {resultado.retroativo.dataFim.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="info-pair">
                    <span className="info-label">Meses contemplados:</span>
                    <span className="info-value">{resultado.retroativo.meses} meses</span>
                  </div>
                </div>
                <div className="observacao-prescricao">
                  <p><strong>⚖️ Observação:</strong> Valores calculados respeitando a prescrição quinquenal (últimos 5 anos).</p>
                </div>
              </div>
            </div>
            <hr className="separator" />
          </>
        )}

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

        {/* Informações sobre as Leis */}
        <div className="info-section">
          <h4>Sobre as Leis de Progressão</h4>
          <div className="decreto-content">
            <div className="lei-item">
              <h5>Decreto 30.974/2021</h5>
              <p>Concede uma progressão de duas letras para professores que já haviam completado o estágio probatório em 15 de outubro de 2021.</p>
              {resultado.progressaoDecreto ? (
                <p className="decreto-status beneficiado">✅ Você foi beneficiado por este decreto!</p>
              ) : (
                <p className="decreto-status nao-beneficiado">ℹ️ Você não foi beneficiado por este decreto pois concluiu o estágio probatório após 15/10/2021.</p>
              )}
            </div>
            
            <div className="lei-item">
              <h5>LCE 405/2009</h5>
              <p>Concede uma letra adicional para professores que finalizaram o estágio probatório antes de 02 de agosto de 2009.</p>
              {resultado.progressaoLCE405 ? (
                <p className="decreto-status beneficiado">✅ Você foi beneficiado por esta lei!</p>
              ) : (
                <p className="decreto-status nao-beneficiado">ℹ️ Você não foi beneficiado por esta lei pois concluiu o estágio probatório após 02/08/2009.</p>
              )}
            </div>
            
            <div className="lei-item">
              <h5>LCE 503/2014</h5>
              <p>Concede uma letra adicional para professores que finalizaram o estágio probatório antes de 27 de março de 2014.</p>
              {resultado.progressaoLCE503 ? (
                <p className="decreto-status beneficiado">✅ Você foi beneficiado por esta lei!</p>
              ) : (
                <p className="decreto-status nao-beneficiado">ℹ️ Você não foi beneficiado por esta lei pois concluiu o estágio probatório após 27/03/2014.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoCalculoComponent;