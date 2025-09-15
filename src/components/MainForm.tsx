import React, { useState } from 'react';
import { CalculadoraLetras, type DadosProfessor, type ResultadoCalculo } from '../utils/calculadoraLetras';
import ResultadoCalculoComponent from './ResultadoCalculo';
import './MainForm.css';

interface FormData {
  nomeCompleto: string;
  email: string;
  whatsapp: string;
  anoIngresso: number;
  adtsAtual: number;
  possuiProcessos: boolean;
  nivelAtual: string;
  letraAtual: string;
  nivel: string; // I, II, III, IV, V, VI
}

interface FormErrors {
  nomeCompleto?: string;
  email?: string;
  whatsapp?: string;
  anoIngresso?: string;
  adtsAtual?: string;
  possuiProcessos?: string;
  nivelAtual?: string;
  letraAtual?: string;
  nivel?: string;
}

const MainForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    email: '',
    whatsapp: '',
    anoIngresso: new Date().getFullYear(),
    adtsAtual: 0,
    possuiProcessos: false,
    nivelAtual: '',
    letraAtual: '',
    nivel: 'I'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [proximaProgressao, setProximaProgressao] = useState<{ ano: number; letra: string; meses: number } | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  // Função para formatar o WhatsApp
  const formatWhatsapp = (value: string): string => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a formatação (99) 99999-9999
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Gerar anos de 1900 a 2025
  const anos = Array.from({ length: 126 }, (_, i) => 1900 + i);
  
  // Gerar opções de ADTS de 0% a 35% pulando de 5 em 5
  const adtsOptions = Array.from({ length: 8 }, (_, i) => i * 5);
  
  // Opções de nível
  const niveisEducacao = ['graduação', 'pós-graduação', 'mestrado', 'doutorado'];
  
  // Letras de A a J
  const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'whatsapp') {
      const formattedValue = formatWhatsapp(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'anoIngresso' || name === 'adtsAtual') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (formData.whatsapp.replace(/\D/g, '').length !== 11) {
      newErrors.whatsapp = 'WhatsApp deve ter 11 dígitos';
    }

    if (formData.anoIngresso < 1900 || formData.anoIngresso > 2025) {
      newErrors.anoIngresso = 'Ano deve estar entre 1900 e 2025';
    }

    if (!formData.nivelAtual) {
      newErrors.nivelAtual = 'Nível atual é obrigatório';
    }

    if (!formData.letraAtual) {
      newErrors.letraAtual = 'Letra atual é obrigatória';
    }

    if (!formData.nivel) {
      newErrors.nivel = 'Nível da carreira é obrigatório';
    }

    // Validação de consistência: verificar se letra e nível são compatíveis
    if (formData.letraAtual && formData.nivel) {
      const letraIndex = letras.indexOf(formData.letraAtual);
      const nivelIndex = ['I', 'II', 'III', 'IV', 'V', 'VI'].indexOf(formData.nivel);
      
      if (letraIndex === -1) {
        newErrors.letraAtual = 'Letra inválida';
      }
      
      if (nivelIndex === -1) {
        newErrors.nivel = 'Nível inválido';
      }
      
      // Verificar se a combinação letra/nível é realística
      if (letraIndex >= 0 && nivelIndex >= 0) {
        // Professores iniciantes (letra A) normalmente estão em níveis mais baixos
        if (formData.letraAtual === 'A' && nivelIndex > 3) {
          newErrors.nivel = 'Professores na letra A raramente possuem nível V ou VI';
        }
        
        // Professores experientes (letra I, J) normalmente estão em níveis mais altos
        if ((formData.letraAtual === 'I' || formData.letraAtual === 'J') && nivelIndex < 2) {
          newErrors.nivel = 'Professores em letras avançadas normalmente possuem nível III ou superior';
        }
      }
    }

    // Validação de ano de ingresso x letra atual
    if (formData.anoIngresso && formData.letraAtual) {
      const anosServico = new Date().getFullYear() - formData.anoIngresso;
      const letraIndex = letras.indexOf(formData.letraAtual);
      
      // Professor com poucos anos de serviço não deveria ter letra muito alta
      if (anosServico <= 5 && letraIndex > 2) {
        newErrors.letraAtual = 'Letra muito alta para o tempo de serviço informado';
      }
      
      // Professor com muitos anos de serviço deveria ter progredido
      if (anosServico >= 15 && letraIndex === 0) {
        newErrors.letraAtual = 'Professor com 15+ anos normalmente já progrediu da letra A';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Preparar dados para o cálculo
        const dadosProfessor: DadosProfessor = {
          anoIngresso: formData.anoIngresso,
          letraAtual: formData.letraAtual,
          nivel: ['I', 'II', 'III', 'IV', 'V', 'VI'].indexOf(formData.nivel) + 1
        };

        // Calcular letra devida
        const resultadoCalculo = CalculadoraLetras.calcularLetraDevida(dadosProfessor);
        
        // Calcular próxima progressão
        const proximaProgressaoData = CalculadoraLetras.calcularProximaProgressao(dadosProfessor);

        // Atualizar estados
        setResultado(resultadoCalculo);
        setProximaProgressao(proximaProgressaoData);
        setMostrarResultado(true);

        console.log('Dados do formulário:', formData);
        console.log('Resultado do cálculo:', resultadoCalculo);
      } catch (error) {
        console.error('Erro no cálculo:', error);
        setErrors({
          anoIngresso: 'Erro no cálculo. Verifique os dados e tente novamente.'
        });
      }
    }
  };

  return (
    <div className="main-form-container">
      <h2>Calculadora de Letras - Dados Pessoais</h2>
      
      <form onSubmit={handleSubmit} className="main-form">
        {/* Nome Completo */}
        <div className="form-group">
          <label htmlFor="nomeCompleto">Nome Completo *</label>
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleInputChange}
            className={errors.nomeCompleto ? 'error' : ''}
          />
          {errors.nomeCompleto && <span className="error-message">{errors.nomeCompleto}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* WhatsApp */}
        <div className="form-group">
          <label htmlFor="whatsapp">Número do WhatsApp *</label>
          <input
            type="text"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="(99) 99999-9999"
            maxLength={15}
            className={errors.whatsapp ? 'error' : ''}
          />
          {errors.whatsapp && <span className="error-message">{errors.whatsapp}</span>}
        </div>

        {/* Ano de Ingresso */}
        <div className="form-group">
          <label htmlFor="anoIngresso">Ano de Ingresso no Serviço Público *</label>
          <select
            id="anoIngresso"
            name="anoIngresso"
            value={formData.anoIngresso}
            onChange={handleInputChange}
            className={errors.anoIngresso ? 'error' : ''}
          >
            {anos.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
          {errors.anoIngresso && <span className="error-message">{errors.anoIngresso}</span>}
        </div>

        {/* ADTS Atual */}
        <div className="form-group">
          <label htmlFor="adtsAtual">ADTS Atual</label>
          <select
            id="adtsAtual"
            name="adtsAtual"
            value={formData.adtsAtual}
            onChange={handleInputChange}
          >
            {adtsOptions.map(adts => (
              <option key={adts} value={adts}>{adts}%</option>
            ))}
          </select>
        </div>

        {/* Processos em relação a atraso de letras */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="possuiProcessos"
              checked={formData.possuiProcessos}
              onChange={handleInputChange}
            />
            Você já possui processos em relação a atraso de letras?
          </label>
        </div>

        {/* Nível Atual */}
        <div className="form-group">
          <label htmlFor="nivelAtual">Nível Atual *</label>
          <select
            id="nivelAtual"
            name="nivelAtual"
            value={formData.nivelAtual}
            onChange={handleInputChange}
            className={errors.nivelAtual ? 'error' : ''}
          >
            <option value="">Selecione o nível</option>
            {niveisEducacao.map(nivel => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </select>
          {errors.nivelAtual && <span className="error-message">{errors.nivelAtual}</span>}
        </div>

        {/* Letra Atual */}
        <div className="form-group">
          <label htmlFor="letraAtual">Letra Atual *</label>
          <select
            id="letraAtual"
            name="letraAtual"
            value={formData.letraAtual}
            onChange={handleInputChange}
            className={errors.letraAtual ? 'error' : ''}
          >
            <option value="">Selecione a letra</option>
            {letras.map(letra => (
              <option key={letra} value={letra}>{letra}</option>
            ))}
          </select>
          {errors.letraAtual && <span className="error-message">{errors.letraAtual}</span>}
        </div>

        {/* Nível da Carreira */}
        <div className="form-group">
          <label htmlFor="nivel">Nível da Carreira *</label>
          <select
            id="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleInputChange}
            className={errors.nivel ? 'error' : ''}
          >
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
          </select>
          {errors.nivel && <span className="error-message">{errors.nivel}</span>}
        </div>

        {/* Botão de Submit */}
        <div className="form-group">
          <button type="submit" className="submit-button">
            Calcular Letras
          </button>
        </div>
      </form>

      {/* Resultado do Cálculo */}
      {mostrarResultado && (
        <ResultadoCalculoComponent 
          resultado={resultado} 
          proximaProgressao={proximaProgressao} 
        />
      )}
    </div>
  );
};

export default MainForm;
