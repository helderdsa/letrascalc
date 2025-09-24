import React, { useState } from 'react';
import { CalculadoraLetras, type DadosProfessor, type ResultadoCalculo } from '../utils/calculadoraLetras';
import ResultadoCalculoComponent from './ResultadoCalculo';
import TermsModal from './TermsModal';

interface FormData {
  nomeCompleto: string;
  email: string;
  whatsapp: string;
  anoIngresso: number;
  possuiProcessos: boolean;
  letraAtual: string;
  nivel: string; // I, II, III, IV, V, VI
  adtsAtual: number; // Percentual de ADTS que o professor recebe atualmente (0-35%)
  conditions: boolean; // Aceitar termos e condições
  newsletter: boolean; // Aceitar receber conteúdo por e-mail
}

interface FormErrors {
  nomeCompleto?: string;
  email?: string;
  whatsapp?: string;
  anoIngresso?: string;
  possuiProcessos?: string;
  letraAtual?: string;
  nivel?: string;
  adtsAtual?: string;
  conditions?: string;
}

const MainForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    email: '',
    whatsapp: '',
    anoIngresso: new Date().getFullYear(),
    possuiProcessos: false,
    letraAtual: '',
    nivel: 'I',
    adtsAtual: 0,
    conditions: true, // Marcado por padrão
    newsletter: true  // Marcado por padrão
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [proximaProgressao, setProximaProgressao] = useState<{ ano: number; letra: string; meses: number } | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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
    } else if (name === 'anoIngresso') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === 'adtsAtual') {
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
    }

    if (formData.anoIngresso < 1900 || formData.anoIngresso > 2025) {
      newErrors.anoIngresso = 'Ano deve estar entre 1900 e 2025';
    }

    if (!formData.letraAtual) {
      newErrors.letraAtual = 'Letra atual é obrigatória';
    }

    if (!formData.nivel) {
      newErrors.nivel = 'Nível da carreira é obrigatório';
    }

    if (!formData.conditions) {
      newErrors.conditions = 'Você deve aceitar os termos e condições';
    }

    // Validação de consistência: verificar se letra e nível são compatíveis

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch(import.meta.env.VITE_DB_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (validateForm()) {
      try {
        // Preparar dados para o cálculo
        const dadosProfessor: DadosProfessor = {
          anoIngresso: formData.anoIngresso,
          letraAtual: formData.letraAtual,
          nivel: ['I', 'II', 'III', 'IV', 'V', 'VI'].indexOf(formData.nivel) + 1,
          adtsAtual: formData.adtsAtual
        };

        // Calcular letra devida
        const resultadoCalculo = CalculadoraLetras.calcularLetraDevida(dadosProfessor);
        
        // Calcular próxima progressão
        const proximaProgressaoData = CalculadoraLetras.calcularProximaProgressao(dadosProfessor);

        // Atualizar estados
        setResultado(resultadoCalculo);
        setProximaProgressao(proximaProgressaoData);
        setMostrarResultado(true);

      } catch (error) {
        console.error('Erro no cálculo:', error);
        setErrors({
          anoIngresso: 'Erro no cálculo. Verifique os dados e tente novamente.'
        });
      }
    }
  };

  return (
    <div className="" >
      {/* Mostrar formulário apenas quando NÃO estiver mostrando resultado */}
      {!mostrarResultado && (
        <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Verifique sua progressão de letras!</h2>
          <h6 className="font-bold text-gray-800 text-center mb-8">Não deixe seus direitos de progressão para depois!</h6>
        
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome Completo */}
        <div className="space-y-2">
          <label htmlFor="nomeCompleto" className="block text-sm font-semibold text-gray-700">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.nomeCompleto 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
            }`}
          />
          {errors.nomeCompleto && (
            <span className="text-red-500 text-sm font-medium">{errors.nomeCompleto}</span>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.email 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm font-medium">{errors.email}</span>
          )}
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700">
            Número do WhatsApp *
          </label>
          <input
            type="text"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="(99) 99999-9999"
            maxLength={15}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.whatsapp 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
            }`}
          />
          {errors.whatsapp && (
            <span className="text-red-500 text-sm font-medium">{errors.whatsapp}</span>
          )}
        </div>

        {/* Ano de Ingresso */}
        <div className="space-y-2">
          <label htmlFor="anoIngresso" className="block text-sm font-semibold text-gray-700">
            Ano de Ingresso no Serviço Público *
          </label>
          <select
            id="anoIngresso"
            name="anoIngresso"
            value={formData.anoIngresso}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.anoIngresso 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
            }`}
          >
            {anos.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
          {errors.anoIngresso && (
            <span className="text-red-500 text-sm font-medium">{errors.anoIngresso}</span>
          )}
        </div>

        {/* Processos em relação a atraso de letras */}
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="possuiProcessos"
              checked={formData.possuiProcessos}
              onChange={handleInputChange}
              className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Você já possui processos em relação a atraso de letras?
            </span>
          </label>
        </div>

        {/* Letra Atual */}
        <div className="space-y-2">
          <label htmlFor="letraAtual" className="block text-sm font-semibold text-gray-700">
            Letra Atual *
          </label>
          <select
            id="letraAtual"
            name="letraAtual"
            value={formData.letraAtual}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.letraAtual 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
            }`}
          >
            <option value="">Selecione a letra</option>
            {letras.map(letra => (
              <option key={letra} value={letra}>{letra}</option>
            ))}
          </select>
          {errors.letraAtual && (
            <span className="text-red-500 text-sm font-medium">{errors.letraAtual}</span>
          )}
        </div>

        {/* Nível de titulação */}
        <div className="space-y-2">
          <label htmlFor="nivel" className="block text-sm font-semibold text-gray-700">
            Nível de titulação *
          </label>
          <select
            id="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.nivel 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
            }`}
          >
            <option value="I">I - Magistério</option>
            <option value="II">II - Lic. Curta</option>
            <option value="III">III - Lic. Plena</option>
            <option value="IV">IV - Especialista</option>
            <option value="V">V - Mestrado</option>
            <option value="VI">VI - Doutorado</option>
          </select>
          {errors.nivel && (
            <span className="text-red-500 text-sm font-medium">{errors.nivel}</span>
          )}
        </div>

        {/* ADTS Atual */}
        <div className="space-y-2">
          <label htmlFor="adtsAtual" className="block text-sm font-semibold text-gray-700">
            ADTS Atual (%) *
          </label>
          <select
            id="adtsAtual"
            name="adtsAtual"
            value={formData.adtsAtual}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.adtsAtual 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
            }`}
          >
            <option value={0}>0%</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
            <option value={25}>25%</option>
            <option value={30}>30%</option>
            <option value={35}>35%</option>
          </select>
          {errors.adtsAtual && (
            <span className="text-red-500 text-sm font-medium">{errors.adtsAtual}</span>
          )}
        </div>

        {/* Alerta sobre aplicabilidade do cálculo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-medium">
              ℹ️ <strong>Importante:</strong> Este cálculo se aplica exclusivamente a servidores do estado do Rio Grande do Norte (RN).
            </p>
          </div>
        </div>

        {/* Termos e Condições */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="conditions"
                checked={formData.conditions}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
              />
              <span className="text-sm font-medium text-gray-700">
                Li e aceito os{' '}
                <span
                  onClick={() => setShowTermsModal(true)}
                  className="text-orange-600 underline hover:text-orange-700 font-semibold"
                >
                  termos e condições
                </span>
                {' '}*
              </span>
            </label>
            {errors.conditions && (
              <span className="text-red-500 text-sm font-medium ml-8">{errors.conditions}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
              />
              <span className="text-sm font-medium text-gray-700">
                Aceito receber conteúdo por e-mail
              </span>
            </label>
          </div>
        </div>

        {/* Botão de Submit */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={!formData.conditions}
            className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 shadow-lg ${
              formData.conditions 
                ? 'bg-gradient-orange hover:opacity-90 text-white hover:scale-[1.02] focus:ring-orange-300' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            Calcule Agora!
          </button>
        </div>
        </form>
      </div>
      )}

      {/* Resultado do Cálculo - agora com botão para voltar */}
      {mostrarResultado && (
        <>
          {/* Botão para voltar ao formulário */}
          <div className="mb-6">
            <button 
              onClick={() => setMostrarResultado(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Voltar ao formulário</span>
            </button>
          </div>
          
          <ResultadoCalculoComponent 
            resultado={resultado} 
            proximaProgressao={proximaProgressao} 
          />
        </>
      )}

      {/* Modal de Termos e Condições */}
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};

export default MainForm;
