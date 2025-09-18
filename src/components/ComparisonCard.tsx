import React from 'react';

interface ComparisonCardProps {
  title: string;
  value: string;
  rounded: string;
  backgroundGradient: string;
  valueTextSize?: 'text-3xl' | 'text-6xl';
  containerClasses?: string;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  title, 
  value,
  rounded = 'rounded-2xl',
  backgroundGradient,
  valueTextSize = 'text-6xl',
  containerClasses = ''
}) => {
  return (
    <div className={`flex flex-col items-center gap-4 p-4 backdrop-blur-sm ${rounded} flex-1 shadow-lg transition-transform hover:scale-105 ${backgroundGradient} ${containerClasses} md:px-3 md:gap-3 sm:px-2 sm:gap-2`} style={{ minWidth: '120px', maxWidth: '150px' }}>
      <div className="text-xs font-bold uppercase tracking-wide text-center text-white whitespace-nowrap md:text-[10px] md:tracking-normal">
        {title}
      </div>
      <div className={`${valueTextSize} font-black w-16 h-16 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md border-2 border-white/30 text-white md:text-xl md:w-14 md:h-14 sm:text-lg sm:w-12 sm:h-12`}>
        {value}
      </div>
    </div>
  );
};

export default ComparisonCard;