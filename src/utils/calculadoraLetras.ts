// Tipos para a lógica de cálculo de letras
export interface DadosProfessor {
  anoIngresso: number;
  letraAtual: string;
}

export interface ResultadoCalculo {
  letraCalculada: string;
  letraAtual: string;
  anosServico: number;
  tempoEstagioProbatorio: number;
  progressoesNormais: number;
  progressaoDecreto: boolean;
  detalhes: string[];
  situacao: 'em_estagio' | 'aprovado' | 'pode_progredir' | 'atualizado';
}

// Constantes
const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const ANOS_ESTAGIO_PROBATORIO = 3;
const ANOS_ENTRE_PROGRESSOES = 2;
const DATA_DECRETO = new Date('2021-10-15');

export class CalculadoraLetras {
  
  /**
   * Calcula a letra que o professor deveria ter baseado no tempo de serviço
   */
  static calcularLetraDevida(dadosProfessor: DadosProfessor): ResultadoCalculo {
    const anoAtual = new Date().getFullYear();
    const anosServico = anoAtual - dadosProfessor.anoIngresso;
    const detalhes: string[] = [];
    
    detalhes.push(`Ingresso no serviço público: ${dadosProfessor.anoIngresso}`);
    detalhes.push(`Anos de serviço: ${anosServico} anos`);
    
    // Verificar se ainda está em estágio probatório
    if (anosServico < ANOS_ESTAGIO_PROBATORIO) {
      const anosRestantes = ANOS_ESTAGIO_PROBATORIO - anosServico;
      detalhes.push(`Ainda em estágio probatório. Faltam ${anosRestantes} anos para concluir.`);
      
      return {
        letraCalculada: 'A',
        letraAtual: dadosProfessor.letraAtual,
        anosServico,
        tempoEstagioProbatorio: anosServico,
        progressoesNormais: 0,
        progressaoDecreto: false,
        detalhes,
        situacao: 'em_estagio'
      };
    }
    
    // Concluiu estágio probatório
    const dataFimEstagio = new Date(dadosProfessor.anoIngresso + ANOS_ESTAGIO_PROBATORIO, 0, 1);
    detalhes.push(`Estágio probatório concluído em: ${dataFimEstagio.getFullYear()}`);
    
    // Verificar se tem direito ao decreto 30.974/2021
    const temDireitoDecreto = dataFimEstagio <= DATA_DECRETO;
    let progressaoDecreto = 0;
    
    if (temDireitoDecreto) {
      progressaoDecreto = 2;
      detalhes.push(`✓ Tem direito ao Decreto 30.974/2021 (2 letras extras)`);
      detalhes.push(`  - Estágio probatório concluído antes de 15/10/2021`);
    } else {
      detalhes.push(`✗ Não tem direito ao Decreto 30.974/2021`);
      detalhes.push(`  - Estágio probatório concluído após 15/10/2021`);
    }
    
    // Calcular progressões normais (a cada 2 anos após estágio probatório)
    const anosAposEstagio = anosServico - ANOS_ESTAGIO_PROBATORIO;
    const progressoesNormais = Math.floor(anosAposEstagio / ANOS_ENTRE_PROGRESSOES);
    
    detalhes.push(`Anos após estágio probatório: ${anosAposEstagio}`);
    detalhes.push(`Progressões normais (a cada 2 anos): ${progressoesNormais}`);
    
    // Calcular letra final
    let indiceLeira = 0; // Começa na letra A
    
    // Primeira progressão: A para B (após estágio probatório)
    if (anosServico >= ANOS_ESTAGIO_PROBATORIO) {
      indiceLeira = 1; // B
      detalhes.push(`Progressão A → B (conclusão do estágio probatório)`);
    }
    
    // Aplicar progressões normais
    indiceLeira += progressoesNormais;
    
    // Aplicar decreto se aplicável
    if (temDireitoDecreto) {
      indiceLeira += progressaoDecreto;
      detalhes.push(`Aplicação do Decreto 30.974/2021: +${progressaoDecreto} letras`);
    }
    
    // Garantir que não ultrapasse a letra J
    if (indiceLeira >= LETRAS.length) {
      indiceLeira = LETRAS.length - 1;
      detalhes.push(`⚠️ Atingiu o topo da carreira (Letra J)`);
    }
    
    const letraCalculada = LETRAS[indiceLeira];
    detalhes.push(`Letra calculada: ${letraCalculada}`);
    
    // Determinar situação
    let situacao: ResultadoCalculo['situacao'] = 'aprovado';
    const indiceAtual = LETRAS.indexOf(dadosProfessor.letraAtual);
    const indiceCalculado = LETRAS.indexOf(letraCalculada);
    
    if (indiceCalculado > indiceAtual) {
      situacao = 'pode_progredir';
      detalhes.push(`🎯 Você pode progredir da letra ${dadosProfessor.letraAtual} para ${letraCalculada}!`);
    } else if (indiceCalculado === indiceAtual) {
      situacao = 'atualizado';
      detalhes.push(`✅ Sua letra atual (${dadosProfessor.letraAtual}) está correta.`);
    } else {
      detalhes.push(`⚠️ Sua letra atual (${dadosProfessor.letraAtual}) está acima do calculado (${letraCalculada})`);
    }
    
    return {
      letraCalculada,
      letraAtual: dadosProfessor.letraAtual,
      anosServico,
      tempoEstagioProbatorio: ANOS_ESTAGIO_PROBATORIO,
      progressoesNormais,
      progressaoDecreto: temDireitoDecreto,
      detalhes,
      situacao
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
}
