import React from 'react';

interface ComparisonContainerProps {
  children: React.ReactNode;
  backgroundGradient?: string;
  arrowColor?: string;
}

const ComparisonContainer: React.FC<ComparisonContainerProps> = ({ 
  children, 
  backgroundGradient = '',
  arrowColor = 'text-gray-600'
}) => {
  return (
    <div className={`flex justify-center items-center p-4 rounded-2xl shadow-lg ${backgroundGradient} overflow-hidden`}>
      <div className="relative flex items-center justify-center gap-3 w-full" style={{ maxWidth: '400px' }}>
        {children}
        <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold pointer-events-none sm:text-2xl ${arrowColor}`}>
          →
        </div>
      </div>
    </div>
  );
};

export default ComparisonContainer;