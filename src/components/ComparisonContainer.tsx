import React from 'react';

interface ComparisonContainerProps {
  children: React.ReactNode;
  backgroundGradient?: string;
}

const ComparisonContainer: React.FC<ComparisonContainerProps> = ({ 
  children, 
  backgroundGradient = ''
}) => {
  return (
    <div className={`flex justify-center items-center p-4 rounded-2xl shadow-lg ${backgroundGradient} overflow-hidden`}>
      <div className="relative flex items-center justify-center w-full" style={{ maxWidth: '400px' }}>
        {children}
        <div className="absolute left-1/2 top-1/2 text-6xl font-black pointer-events-none text-white sm:text-4xl  arrow-animated">
          →
        </div>
      </div>
    </div>
  );
};

export default ComparisonContainer;