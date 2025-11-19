import { Badge } from '../../ui/badge';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const getVariantClass = () => {
    switch (variant || status.toLowerCase()) {
      case 'published':
      case 'success':
      case 'active':
      case 'released':
        return 'bg-green-500/10 text-green-600';
      case 'draft':
      case 'pending':
      case 'warning':
        return 'bg-orange-500/10 text-orange-600';
      case 'error':
      case 'closed':
      case 'expired':
        return 'bg-red-500/10 text-red-600';
      case 'info':
      case 'updated':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <Badge variant="secondary" className={`${getVariantClass()} text-xs`}>
      {status}
    </Badge>
  );
}
