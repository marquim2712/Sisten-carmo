import { Chamado, STATUS_LABELS, STATUS_COLORS } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  MapPin, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle,
  ArrowRight,
  Clock,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ChamadoListItemProps {
  chamado: Chamado;
  onEdit?: (chamado: Chamado) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Chamado['status']) => void;
  onViewDetails?: () => void;
}

export const ChamadoListItem = ({ chamado, onEdit, onDelete, onStatusChange, onViewDetails }: ChamadoListItemProps) => {
  const { user } = useAuth();
  const isAdmin = user?.tipo === 'admin';

  const getStatusColor = (status: Chamado['status']) => {
    const colorMap = {
      aberto: 'bg-info-light text-info border-info/20',
      em_andamento: 'bg-warning-light text-warning border-warning/20',
      concluido: 'bg-success-light text-success border-success/20'
    };
    return colorMap[status];
  };

  const getNextStatus = (currentStatus: Chamado['status']): Chamado['status'] | null => {
    switch (currentStatus) {
      case 'aberto':
        return 'em_andamento';
      case 'em_andamento':
        return 'concluido';
      default:
        return null;
    }
  };

  const getStatusIcon = (status: Chamado['status']) => {
    switch (status) {
      case 'aberto':
        return <Clock className="w-4 h-4" />;
      case 'em_andamento':
        return <ArrowRight className="w-4 h-4" />;
      case 'concluido':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const nextStatus = getNextStatus(chamado.status);

  return (
    <div className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors">
      {/* Status Icon */}
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          chamado.status === 'aberto' ? 'bg-info-light' :
          chamado.status === 'em_andamento' ? 'bg-warning-light' :
          'bg-success-light'
        }`}>
          {getStatusIcon(chamado.status)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-foreground truncate">{chamado.cliente_nome}</span>
          <Badge className={`${getStatusColor(chamado.status)} text-xs`}>
            {STATUS_LABELS[chamado.status]}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground truncate">{chamado.endereco}</span>
        </div>
        
        <div className="text-sm text-muted-foreground line-clamp-1">{chamado.descricao}</div>
      </div>

      {/* Date and Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(chamado.criado_em)}</span>
        </div>
        
        {/* Status Change Button */}
        {isAdmin && nextStatus && onStatusChange && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(chamado.id, nextStatus)}
            className="text-xs h-8 px-2 touch-target"
          >
            <ArrowRight className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">{STATUS_LABELS[nextStatus]}</span>
            <span className="sm:hidden">
              {nextStatus === 'em_andamento' ? 'Iniciar' : 'Concluir'}
            </span>
          </Button>
        )}
        
        {/* View Details Button for Concluded */}
        {chamado.status === 'concluido' && onViewDetails && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onViewDetails}
            className="h-8 px-2 touch-target"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
        
        {isAdmin && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(chamado)}
              className="h-8 w-8 hover:bg-muted touch-target"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(chamado.id)}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive touch-target"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
