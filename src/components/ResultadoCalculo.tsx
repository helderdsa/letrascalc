import React from 'react';
import type { ResultadoCalculo } from '../utils/calculadoraLetras';
import ComparisonCard from './ComparisonCard';
import ComparisonContainer from './ComparisonContainer';

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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pode_progredir':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'atualizado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mt-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h3 className="text-3xl font-bold text-gray-800">Resultado do Cálculo</h3>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getSituacaoClass(resultado.situacao)}`}>
          {getSituacaoTexto(resultado.situacao)}
        </div>
      </div>

      <div className="space-y-8">
        {/* Resumo Principal - Letras lado a lado com seta sobreposta */}
        <ComparisonContainer 
          arrowColor="text-gray-600"
        >
          <ComparisonCard
            title="Letra Atual"
            value={resultado.letraAtual}
            backgroundGradient="bg-gradient-to-br from-blue-500 to-purple-600"
            valueTextSize="text-6xl"
          />
          <ComparisonCard
            title="Letra Correta"
            value={resultado.letraCalculada}
            backgroundGradient="bg-gradient-to-br from-purple-600 to-pink-500"
            valueTextSize="text-6xl"
          />
        </ComparisonContainer>

        <hr className="border-gray-300" />
        
        {/* Cards ADTS lado a lado com seta sobreposta */}
        <ComparisonContainer arrowColor="text-gray-600">
          <ComparisonCard
            title="ADTS Atual"
            value={`${resultado.adtsAtual}%`}
            backgroundGradient={resultado.adtsCorreto ? 'bg-gradient-green' : 'bg-gradient-red'}
            valueTextSize="text-3xl"
          />
          <ComparisonCard
            title="ADTS Correto"
            value={`${resultado.adtsPercentual}%`}
            backgroundGradient="bg-gradient-blue"
            valueTextSize="text-3xl"
          />
        </ComparisonContainer>

        <hr className="border-gray-300" />

        {/* Informações de Serviço */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Informações do Serviço
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Anos de Serviço:</span>
              <span className="font-semibold text-gray-800">{resultado.anosServico} anos</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">ADTS (Quinquênios):</span>
              <span className="font-semibold text-gray-800">{resultado.adtsQuinquenios} × 5% = {resultado.adtsPercentual}%</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Progressões Normais:</span>
              <span className="font-semibold text-gray-800">{resultado.progressoesNormais}</span>
            </div>
            {resultado.progressaoDecreto && (
              <div className="flex justify-between items-center py-3 px-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Decreto 30.974/2021:</span>
                <span className="font-semibold text-green-700">✓ Beneficiado (+2 letras)</span>
              </div>
            )}
            {resultado.progressaoLCE405 && (
              <div className="flex justify-between items-center py-3 px-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-sm font-medium text-gray-600">LCE 405/2009:</span>
                <span className="font-semibold text-green-700">✓ Beneficiado (+1 letra)</span>
              </div>
            )}
            {resultado.progressaoLCE503 && (
              <div className="flex justify-between items-center py-3 px-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-sm font-medium text-gray-600">LCE 503/2014:</span>
                <span className="font-semibold text-green-700">✓ Beneficiado (+1 letra)</span>
              </div>
            )}
          </div>
        </div>

        {/* Próxima Progressão */}
        {proximaProgressao && (
          <>
            <hr className="border-gray-300" />
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Próxima Progressão
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-lg text-gray-800">
                  Em <strong className="text-blue-700">{proximaProgressao.ano}</strong> você poderá progredir para a letra <strong className="text-blue-700">{proximaProgressao.letra}</strong>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  (aproximadamente {Math.round(proximaProgressao.meses)} meses)
                </p>
              </div>
            </div>
          </>
        )}

        <hr className="border-gray-300" />

        {/* Informações de Retroativo */}
        {resultado.retroativo && (
          <>
            <div className="bg-gradient-green rounded-2xl shadow-lg p-8 text-white">
              <h4 className="text-2xl font-bold text-center mb-6">💰 Estimativa de Valor Retroativo a Receber</h4>
              <div className="space-y-6">
          <div className="flex flex-col items-center bg-white/15 backdrop-blur-sm rounded-lg p-4 space-y-2">
            <span className="text-base font-semibold text-center">Valor Total:</span>
            <span className="text-2xl font-bold text-center break-words">
              R$ {resultado.retroativo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="font-medium">Período:</span>
              <span className="font-semibold text-right sm:text-left">
                {resultado.retroativo.dataInicio.toLocaleDateString('pt-BR')} até {resultado.retroativo.dataFim.toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="font-medium">Meses contemplados:</span>
              <span className="font-semibold text-right sm:text-left">{resultado.retroativo.meses} meses</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border-l-4 border-white/50">
            <p className="text-sm leading-relaxed">
              <strong>⚖️ Observação:</strong> Valores calculados respeitando a prescrição quinquenal (últimos 5 anos).
            </p>
          </div>
              </div>
            </div>
            <hr className="border-gray-300" />
          </>
        )}

        {/* Detalhes do Cálculo */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Detalhes do Cálculo
          </h4>
          <div className="space-y-2">
            {resultado.detalhes.map((detalhe, index) => (
              <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                <span dangerouslySetInnerHTML={{ __html: detalhe }} />
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Informações sobre as Leis */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Sobre as Leis de Progressão
          </h4>
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Decreto 30.974/2021</h5>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Concede uma progressão de duas letras para professores que já haviam completado o estágio probatório em 15 de outubro de 2021.
              </p>
              {resultado.progressaoDecreto ? (
                <p className="text-green-700 font-semibold bg-green-100 border border-green-200 rounded-lg p-3">
                  ✅ Você foi beneficiado por este decreto!
                </p>
              ) : (
                <p className="text-blue-700 font-medium bg-blue-100 border border-blue-200 rounded-lg p-3">
                  ℹ️ Você não foi beneficiado por este decreto pois concluiu o estágio probatório após 15/10/2021.
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h5 className="text-lg font-semibold text-gray-800 mb-3">LCE 405/2009</h5>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Concede uma letra adicional para professores que finalizaram o estágio probatório antes de 02 de agosto de 2009.
              </p>
              {resultado.progressaoLCE405 ? (
                <p className="text-green-700 font-semibold bg-green-100 border border-green-200 rounded-lg p-3">
                  ✅ Você foi beneficiado por esta lei!
                </p>
              ) : (
                <p className="text-blue-700 font-medium bg-blue-100 border border-blue-200 rounded-lg p-3">
                  ℹ️ Você não foi beneficiado por esta lei pois concluiu o estágio probatório após 02/08/2009.
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h5 className="text-lg font-semibold text-gray-800 mb-3">LCE 503/2014</h5>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Concede uma letra adicional para professores que finalizaram o estágio probatório antes de 27 de março de 2014.
              </p>
              {resultado.progressaoLCE503 ? (
                <p className="text-green-700 font-semibold bg-green-100 border border-green-200 rounded-lg p-3">
                  ✅ Você foi beneficiado por esta lei!
                </p>
              ) : (
                <p className="text-blue-700 font-medium bg-blue-100 border border-blue-200 rounded-lg p-3">
                  ℹ️ Você não foi beneficiado por esta lei pois concluiu o estágio probatório após 27/03/2014.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoCalculoComponent;