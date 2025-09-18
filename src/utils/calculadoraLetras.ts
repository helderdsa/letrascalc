// Tipos para a lógica de cálculo de letras
export interface DadosProfessor {
  anoIngresso: number;
  letraAtual: string;
  nivel: number; // 1=I, 2=II, 3=III, 4=IV, 5=V, 6=VI
  adtsAtual: number; // Percentual de ADTS que o professor recebe atualmente (0-35%)
}

export interface ResultadoCalculo {
  letraCalculada: string;
  letraAtual: string;
  anosServico: number;
  tempoEstagioProbatorio: number;
  progressoesNormais: number;
  progressaoDecreto: boolean;
  progressaoLCE405: boolean;
  progressaoLCE503: boolean;
  adtsPercentual: number;
  adtsQuinquenios: number;
  adtsAtual: number;
  adtsCorreto: boolean;
  detalhes: string[];
  situacao: 'em_estagio' | 'pode_progredir' | 'atualizado';
  retroativo?: {
    valor: number;
    meses: number;
    dataInicio: Date;
    dataFim: Date;
    detalhes: {
      mes: Date;
      diferenca: number;
      vencimentoCorreto: number;
      vencimentoRecebido: number;
    }[];
  } | null;
}

// Constantes
const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// Matriz de vencimentos de 2020 (base para cálculos)
const VENCIMENTOS_2020 = [
  [2165.13, 2489.90, 3031.18, 3247.70, 3680.72, 4979.80], // A
  [2273.39, 2614.39, 3182.74, 3410.08, 3864.76, 5228.79], // B
  [2387.06, 2745.11, 3341.88, 3580.58, 4057.99, 5490.23], // C
  [2504.41, 2882.37, 3508.97, 3759.61, 4260.89, 5764.74], // D
  [2631.73, 3026.49, 3684.42, 3947.59, 4473.94, 6052.98], // E
  [2763.32, 3177.81, 3868.64, 4144.97, 4697.64, 6355.63], // F
  [2901.48, 3336.70, 4062.07, 4352.22, 4932.52, 6673.41], // G
  [3046.56, 3503.54, 4265.18, 4569.83, 5179.14, 7007.08], // H
  [3198.88, 3678.72, 4478.44, 4798.32, 5438.10, 7357.43], // I
  [3358.83, 3862.65, 4702.36, 5038.24, 5710.01, 7725.30]  // J
];

// Taxas de aumento por ano
const TAXAS_AUMENTO = {
  2020: 0,      // Sem aumento
  2021: 0,      // Sem aumento
  2022: 33.24,  // 33.24%
  2023: {       // Aumentos escalonados
    maio: 7.21,
    novembro: 3.61,
    dezembro: 3.49
  },
  2024: 3.62,   // 3.62%
  2025: 6.27    // 6.27%
};

// Função para calcular vencimentos de um ano específico
function calcularVencimentosAno(anoDestino: number): number[][] {
  if (anoDestino <= 2020) return VENCIMENTOS_2020;
  
  let vencimentos = VENCIMENTOS_2020.map(letra => [...letra]);
  
  for (let ano = 2021; ano <= anoDestino; ano++) {
    const taxa = TAXAS_AUMENTO[ano as keyof typeof TAXAS_AUMENTO];
    
    if (typeof taxa === 'number' && taxa > 0) {
      // Aumento simples
      vencimentos = vencimentos.map(letra => 
        letra.map(valor => valor * (1 + taxa / 100))
      );
    } else if (typeof taxa === 'object') {
      // Aumentos escalonados (2023)
      if (ano === 2023) {
        // Maio: +7.21%
        vencimentos = vencimentos.map(letra => 
          letra.map(valor => valor * (1 + taxa.maio / 100))
        );
        // Novembro: +3.61%
        vencimentos = vencimentos.map(letra => 
          letra.map(valor => valor * (1 + taxa.novembro / 100))
        );
        // Dezembro: +3.49%
        vencimentos = vencimentos.map(letra => 
          letra.map(valor => valor * (1 + taxa.dezembro / 100))
        );
      }
    }
  }
  
  return vencimentos;
}

// Função para calcular o percentual de ADTS baseado nos anos de serviço
function calcularPercentualADTS(anosServico: number): number {
  // ADTS: 5% a cada 5 anos de serviço
  const quinquenios = Math.floor(anosServico / 5);
  return quinquenios * 5; // 5% por quinquênio
}

// Cache para vencimentos calculados
const CACHE_VENCIMENTOS: { [ano: number]: number[][] } = {
  2020: VENCIMENTOS_2020,
  2021: VENCIMENTOS_2020
};

// Função para obter vencimentos de um ano (com cache)
function obterVencimentos(ano: number): number[][] {
  if (!CACHE_VENCIMENTOS[ano]) {
    CACHE_VENCIMENTOS[ano] = calcularVencimentosAno(ano);
  }
  return CACHE_VENCIMENTOS[ano];
}

const ANOS_ESTAGIO_PROBATORIO = 3;
const ANOS_ENTRE_PROGRESSOES = 2;
const DATA_DECRETO = new Date('2021-10-15');
const DATA_LCE_405 = new Date('2009-08-02');
const DATA_LCE_503 = new Date('2014-03-27');

export class CalculadoraLetras {
  
  /**
   * Calcula a letra que o professor deveria ter baseado no tempo de serviço
   */
  static calcularLetraDevida(dadosProfessor: DadosProfessor): ResultadoCalculo {
    const anoAtual = new Date().getFullYear();
    const anosServico = anoAtual - dadosProfessor.anoIngresso;
    const detalhes: string[] = [];
    
    
    // Calcular ADTS
    const percentualADTS = calcularPercentualADTS(anosServico);
    
    // Verificar se o ADTS atual está correto
    if (dadosProfessor.adtsAtual === percentualADTS) {
      detalhes.push(`✅ ADTS atual (${dadosProfessor.adtsAtual}%) está correto`);
    } else {
      detalhes.push(`⚠️ ADTS atual (${dadosProfessor.adtsAtual}%) está INCORRETO - <strong>deveria ser ${percentualADTS}%</strong>`);
    }
    
    // Verificar se ainda está em estágio probatório
    if (anosServico < ANOS_ESTAGIO_PROBATORIO) {
      
      return {
        letraCalculada: 'A',
        letraAtual: dadosProfessor.letraAtual,
        anosServico,
        tempoEstagioProbatorio: anosServico,
        progressoesNormais: 0,
        progressaoDecreto: false,
        progressaoLCE405: false,
        progressaoLCE503: false,
        adtsPercentual: calcularPercentualADTS(anosServico),
        adtsQuinquenios: Math.floor(anosServico / 5),
        adtsAtual: dadosProfessor.adtsAtual,
        adtsCorreto: dadosProfessor.adtsAtual === calcularPercentualADTS(anosServico),
        detalhes,
        situacao: 'em_estagio'
      };
    }
    
    // Concluiu estágio probatório
    const dataFimEstagio = new Date(dadosProfessor.anoIngresso + ANOS_ESTAGIO_PROBATORIO, 0, 1);
    
    // Verificar se tem direito ao decreto 30.974/2021
    const temDireitoDecreto = dataFimEstagio <= DATA_DECRETO;
    let progressaoDecreto = 0;
    
    if (temDireitoDecreto) {
      progressaoDecreto = 2;
      detalhes.push(`✅ Tem direito ao Decreto 30.974/2021 <strong>(2 letras extras)</strong>`);
    } else {
      detalhes.push(`❌ Não tem direito ao Decreto 30.974/2021`);
    }
    
    // Verificar se tem direito à LCE 405/2009
    const temDireitoLCE405 = dataFimEstagio <= DATA_LCE_405;
    let progressaoLCE405 = 0;
    
    if (temDireitoLCE405) {
      progressaoLCE405 = 1;
      detalhes.push(`✅ Tem direito à LCE 405/2009 <strong>(1 letra extra)</strong>`);
    } else {
      detalhes.push(`❌ Não tem direito à LCE 405/2009`);
    }
    
    // Verificar se tem direito à LCE 503/2014
    const temDireitoLCE503 = dataFimEstagio <= DATA_LCE_503;
    let progressaoLCE503 = 0;
    
    if (temDireitoLCE503) {
      progressaoLCE503 = 1;
      detalhes.push(`✅ Tem direito à LCE 503/2014 <strong>(1 letra extra)</strong>`);
    } else {
      detalhes.push(`❌ Não tem direito à LCE 503/2014`);
    }
    
    // Calcular progressões normais (a cada 2 anos após estágio probatório)
    const anosAposEstagio = anosServico - ANOS_ESTAGIO_PROBATORIO;
    const progressoesNormais = Math.floor(anosAposEstagio / ANOS_ENTRE_PROGRESSOES);
    
    
    // Calcular letra final
    let indiceLeira = 0; // Começa na letra A
    
    // Primeira progressão: A para B (após estágio probatório)
    if (anosServico >= ANOS_ESTAGIO_PROBATORIO) {
      indiceLeira = 1; // B
    }
    
    // Aplicar progressões normais
    indiceLeira += progressoesNormais;
    
    // Aplicar decreto se aplicável
    if (temDireitoDecreto) {
      indiceLeira += progressaoDecreto;
    }
    
    // Aplicar LCE 405/2009 se aplicável
    if (temDireitoLCE405) {
      indiceLeira += progressaoLCE405;
    }
    
    // Aplicar LCE 503/2014 se aplicável
    if (temDireitoLCE503) {
      indiceLeira += progressaoLCE503;
    }
    
    // Garantir que não ultrapasse a letra J
    if (indiceLeira >= LETRAS.length) {
      indiceLeira = LETRAS.length - 1;
    }
    
    const letraCalculada = LETRAS[indiceLeira];
    
    // Determinar situação
    let situacao: ResultadoCalculo['situacao'] = 'atualizado';
    const indiceAtual = LETRAS.indexOf(dadosProfessor.letraAtual);
    const indiceCalculado = LETRAS.indexOf(letraCalculada);
    
    if (indiceCalculado > indiceAtual) {
      situacao = 'pode_progredir';
      detalhes.push(`🎯 Você pode progredir da letra ${dadosProfessor.letraAtual} para ${letraCalculada}!`);
    } else if (indiceCalculado === indiceAtual) {
      situacao = 'atualizado';
      detalhes.push(`✅ Sua letra atual (${dadosProfessor.letraAtual}) está correta.`);
    } else {
      situacao = 'atualizado'; // Considera como atualizado mesmo se estiver acima
      detalhes.push(`⚠️ Sua letra atual (${dadosProfessor.letraAtual}) está acima do calculado (${letraCalculada})`);
    }
    
    return {
      letraCalculada,
      letraAtual: dadosProfessor.letraAtual,
      anosServico,
      tempoEstagioProbatorio: ANOS_ESTAGIO_PROBATORIO,
      progressoesNormais,
      progressaoDecreto: temDireitoDecreto,
      progressaoLCE405: temDireitoLCE405,
      progressaoLCE503: temDireitoLCE503,
      adtsPercentual: calcularPercentualADTS(anosServico),
      adtsQuinquenios: Math.floor(anosServico / 5),
      adtsAtual: dadosProfessor.adtsAtual,
      adtsCorreto: dadosProfessor.adtsAtual === calcularPercentualADTS(anosServico),
      detalhes,
      situacao,
      retroativo: this.calcularRetroativo(dadosProfessor)
    };
  }
  
  /**
   * Calcula quando será a próxima progressão
   */
  static calcularProximaProgressao(dadosProfessor: DadosProfessor): { ano: number; letra: string; meses: number } | null {
    const resultado = this.calcularLetraDevida(dadosProfessor);
    const anoAtual = new Date().getFullYear();
    
    // Se ainda está em estágio probatório
    if (resultado.situacao === 'em_estagio') {
      const anoFimEstagio = dadosProfessor.anoIngresso + ANOS_ESTAGIO_PROBATORIO;
      const mesesRestantes = (anoFimEstagio - anoAtual) * 12;
      return {
        ano: anoFimEstagio,
        letra: 'B',
        meses: mesesRestantes
      };
    }
    
    // Se já pode progredir, não há próxima progressão a calcular
    if (resultado.situacao === 'pode_progredir') {
      return null;
    }
    
    // Calcular próxima progressão normal
    const anosAposEstagio = resultado.anosServico - ANOS_ESTAGIO_PROBATORIO;
    const proximaProgressaoEm = ANOS_ENTRE_PROGRESSOES - (anosAposEstagio % ANOS_ENTRE_PROGRESSOES);
    const anoProximaProgressao = anoAtual + proximaProgressaoEm;
    
    const indiceAtual = LETRAS.indexOf(dadosProfessor.letraAtual);
    const proximaLetra = LETRAS[indiceAtual + 1];
    
    if (!proximaLetra) {
      return null; // Já está na letra máxima
    }
    
    return {
      ano: anoProximaProgressao,
      letra: proximaLetra,
      meses: proximaProgressaoEm * 12
    };
  }

  /**
   * Calcula o valor retroativo baseado na prescrição de 5 anos
   */
  static calcularRetroativo(dadosProfessor: DadosProfessor): ResultadoCalculo['retroativo'] {
    try {
      // Evitar recursão circular - calcular diretamente sem chamar calcularLetraDevida
      const anoAtual = new Date().getFullYear();
      const mesAtual = new Date().getMonth();
      const anosServico = anoAtual - dadosProfessor.anoIngresso;
      
      // Verificar se ainda está em estágio probatório
      if (anosServico < ANOS_ESTAGIO_PROBATORIO) {
        return null; // Não há retroativo durante estágio
      }
      
      const indiceLetraAtual = LETRAS.indexOf(dadosProfessor.letraAtual);
      
      // Validar nível
      if (dadosProfessor.nivel < 1 || dadosProfessor.nivel > 6) {
        throw new Error('Nível deve estar entre 1 e 6');
      }
      
      // Data limite de prescrição (5 anos atrás)
      const dataLimiteDescricao = new Date(anoAtual - 5, mesAtual, 1);
      
      // Determinar quando deveria ter começado a receber diferenças
      let dataInicioRetroativo = new Date(dadosProfessor.anoIngresso + ANOS_ESTAGIO_PROBATORIO, 0, 1);
      
      // Aplicar limite de prescrição
      if (dataInicioRetroativo < dataLimiteDescricao) {
        dataInicioRetroativo = dataLimiteDescricao;
      }
      
      const dataFim = new Date(anoAtual, mesAtual, 0); // Último dia do mês anterior
      
      // Função para calcular a letra correta em uma data específica
      const calcularLetraCorretaParaData = (data: Date): number => {
        const anoData = data.getFullYear();
        const anosServicoNaData = anoData - dadosProfessor.anoIngresso;
        
        // Durante estágio probatório permanece em A
        if (anosServicoNaData < ANOS_ESTAGIO_PROBATORIO) {
          return 0; // A
        }
        
        let indiceLetra = 1; // B após estágio
        
        // Progressões normais
        const anosAposEstagio = anosServicoNaData - ANOS_ESTAGIO_PROBATORIO;
        const progressoesNormais = Math.floor(anosAposEstagio / ANOS_ENTRE_PROGRESSOES);
        indiceLetra += progressoesNormais;
        
        // Verificar se as leis já estavam em vigor na data
        const dataFimEstagio = new Date(dadosProfessor.anoIngresso + ANOS_ESTAGIO_PROBATORIO, 0, 1);
        
        if (dataFimEstagio <= DATA_LCE_405 && data >= DATA_LCE_405) {
          indiceLetra += 1;
        }
        if (dataFimEstagio <= DATA_LCE_503 && data >= DATA_LCE_503) {
          indiceLetra += 1;
        }
        if (dataFimEstagio <= DATA_DECRETO && data >= DATA_DECRETO) {
          indiceLetra += 2;
        }
        
        // Garantir que não ultrapasse J
        if (indiceLetra >= LETRAS.length) {
          indiceLetra = LETRAS.length - 1;
        }
        
        return indiceLetra;
      };
      
      // Calcular diferenças mês a mês
      const detalhesRetroativo = [];
      let valorTotal = 0;
      let mesesContados = 0;
      
      const dataIteracao = new Date(dataInicioRetroativo.getFullYear(), dataInicioRetroativo.getMonth(), 1);
      
      while (dataIteracao <= dataFim && mesesContados < 60) { // Limite de segurança
        const ano = dataIteracao.getFullYear();
        const vencimentosAno = obterVencimentos(ano);
        
        // Calcular a letra correta para esta data específica
        const indiceLetraCorretaNoMes = calcularLetraCorretaParaData(dataIteracao);
        
        // Calcular ADTS para a data específica
        const anosServicoNaData = ano - dadosProfessor.anoIngresso;
        const adtsCorreto = calcularPercentualADTS(anosServicoNaData);
        const adtsAtual = dadosProfessor.adtsAtual; // Usar o ADTS informado pelo usuário
        
        // Aplicar ADTS nos vencimentos
        const vencimentoBaseCorreto = vencimentosAno[indiceLetraCorretaNoMes][dadosProfessor.nivel - 1];
        const vencimentoBaseRecebido = vencimentosAno[indiceLetraAtual][dadosProfessor.nivel - 1];
        
        const vencimentoCorreto = vencimentoBaseCorreto * (1 + adtsCorreto / 100);
        const vencimentoRecebido = vencimentoBaseRecebido * (1 + adtsAtual / 100);
        
        const diferenca = vencimentoCorreto - vencimentoRecebido;
        
        if (diferenca > 0) {
          valorTotal += diferenca;
          mesesContados++;
          
          detalhesRetroativo.push({
            mes: new Date(dataIteracao),
            diferenca,
            vencimentoCorreto,
            vencimentoRecebido
          });
        }
        
        // Avançar para o próximo mês
        dataIteracao.setMonth(dataIteracao.getMonth() + 1);
      }
      
      if (valorTotal === 0) {
        return null;
      }
      
      return {
        valor: valorTotal,
        meses: mesesContados,
        dataInicio: dataInicioRetroativo,
        dataFim,
        detalhes: detalhesRetroativo
      };
    } catch (error) {
      console.error('Erro no cálculo de retroativo:', error);
      return null;
    }
  }
}
