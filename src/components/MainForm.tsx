import React, { useState } from 'react';
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
    letraAtual: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
      // Aqui você pode processar os dados do formulário
      alert('Formulário enviado com sucesso!');
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

        {/* Botão de Submit */}
        <div className="form-group">
          <button type="submit" className="submit-button">
            Calcular Letras
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainForm;
