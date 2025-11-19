interface AdSenseSlotProps {
  format?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

export function AdSenseSlot({ format = 'horizontal', className = '' }: AdSenseSlotProps) {
  const dimensions = {
    horizontal: 'h-24 md:h-32',
    vertical: 'h-96',
    square: 'h-64',
  };

  return (
    <div
      className={`bg-[#F5F5F5] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${dimensions[format]} ${className}`}
    >
      <div className="text-center space-y-1">
        <p className="text-[#0A0A0A]/40 text-sm">Advertisement</p>
        <p className="text-[#0A0A0A]/30 text-xs">Google AdSense</p>
      </div>
    </div>
  );
}
