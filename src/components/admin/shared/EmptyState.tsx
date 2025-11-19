import { LucideIcon } from 'lucide-react';
import { Button } from '../../ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#004AAD]/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#004AAD]" />
      </div>
      <h3 className="text-[#0A0A0A] text-lg sm:text-xl mb-2">{title}</h3>
      <p className="text-[#0A0A0A]/60 text-sm sm:text-base mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-[#004AAD] w-full sm:w-auto">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
