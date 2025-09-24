import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-orange text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Política de Privacidade – Escritório de Advocacia Clodonil Monteiro</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6 text-gray-700">
            <p className="leading-relaxed text-justify">
              O Escritório de Advocacia Clodonil Monteiro preza pela transparência, ética e respeito à privacidade de todos que acessam nossa plataforma e interagem conosco. Esta Política de Privacidade explica como coletamos, utilizamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).
            </p>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Coleta de dados</h3>
              <p className="leading-relaxed text-justify mb-3">
                Ao preencher os formulários em nossa plataforma, poderemos solicitar informações como:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mb-3">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Telefone/WhatsApp</li>
                <li>Ano de ingresso no serviço público</li>
                <li>Informações sobre progressão de carreira</li>
              </ul>
              <p className="leading-relaxed">
                Esses dados são coletados para que possamos realizar os cálculos de progressão e ADTS, bem como fornecer informações relevantes sobre direitos dos professores.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Finalidade do tratamento</h3>
              <p className="leading-relaxed text-justify mb-3">
                Os dados coletados serão utilizados exclusivamente para:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mb-3">
                <li>Realizar os cálculos de progressão de letras e ADTS</li>
                <li>Envio de conteúdo educativo sobre direitos dos professores (se autorizado)</li>
                <li>Compartilhamento de informações sobre legislação educacional</li>
                <li>Respostas a eventuais dúvidas sobre os cálculos realizados</li>
              </ul>
              <p className="leading-relaxed">
                Não utilizamos os dados para fins de venda direta, comércio de informações ou qualquer prática abusiva.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Compartilhamento de dados</h3>
              <p className="leading-relaxed text-justify">
                O Escritório de Advocacia Clodonil Monteiro não compartilha, vende ou cede dados pessoais a terceiros. O tratamento é realizado apenas por nossa equipe, de forma restrita e com finalidade legítima.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Segurança da informação</h3>
              <p className="leading-relaxed text-justify">
                Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acessos não autorizados, perda, alteração ou divulgação indevida.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Direitos do titular</h3>
              <p className="leading-relaxed text-justify mb-3">
                De acordo com a LGPD, você tem direito a:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mb-3">
                <li>Confirmar a existência de tratamento de seus dados</li>
                <li>Solicitar acesso, atualização ou correção de informações</li>
                <li>Pedir a exclusão dos dados, quando aplicável</li>
                <li>Revogar o consentimento previamente concedido</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Alterações desta Política</h3>
              <p className="leading-relaxed text-justify">
                Esta Política de Privacidade poderá ser atualizada periodicamente, sempre que necessário para refletir mudanças legais ou na plataforma.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Contato</h3>
              <p className="leading-relaxed text-justify mb-3">
                Se tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados, entre em contato conosco:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-semibold whitespace-pre-line">
                  {`Escritório de Advocacia Clodonil Monteiro
E-mail: clodonilmonteiro@gmail.com
Telefone: (84) 3433-2179`}
                </p>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800 font-medium">
                <strong>Última atualização:</strong> Setembro de 2025
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;