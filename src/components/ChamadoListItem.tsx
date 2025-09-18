import { Chamado, STATUS_LABELS, STATUS_COLORS } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  MapPin, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ChamadoListItemProps {
  chamado: Chamado;
  onEdit?: (chamado: Chamado) => void;
  onDelete?: (id: string) => void;
}

export const ChamadoListItem = ({ chamado, onEdit, onDelete }: ChamadoListItemProps) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors">
      {/* Status Icon */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-success-light rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-success" />
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
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(chamado.criado_em)}</span>
        </div>
        
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
