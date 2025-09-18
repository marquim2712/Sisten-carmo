import { Chamado, STATUS_LABELS, STATUS_COLORS } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  MapPin, 
  User, 
  Edit, 
  Trash2, 
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ChamadoCardProps {
  chamado: Chamado;
  onEdit?: (chamado: Chamado) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Chamado['status']) => void;
}

export const ChamadoCard = ({ chamado, onEdit, onDelete, onStatusChange }: ChamadoCardProps) => {
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
    <Card className="shadow-card hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="font-semibold text-foreground truncate">{chamado.cliente_nome}</span>
            </div>
            <Badge className={`${getStatusColor(chamado.status)} text-xs`}>
              {getStatusIcon(chamado.status)}
              <span className="ml-1 hidden sm:inline">{STATUS_LABELS[chamado.status]}</span>
              <span className="ml-1 sm:hidden">
                {chamado.status === 'aberto' ? 'Aberto' : 
                 chamado.status === 'em_andamento' ? 'Andamento' : 'Concluído'}
              </span>
            </Badge>
          </div>
          
          {isAdmin && (
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(chamado)}
                className="h-8 w-8 sm:h-8 sm:w-8 hover:bg-muted touch-target"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(chamado.id)}
                className="h-8 w-8 sm:h-8 sm:w-8 hover:bg-destructive/10 hover:text-destructive touch-target"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-sm text-muted-foreground leading-relaxed">{chamado.endereco}</span>
          </div>
          
          <div className="text-sm leading-relaxed line-clamp-3">{chamado.descricao}</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">Criado em {formatDate(chamado.criado_em)}</span>
          </div>

          {isAdmin && nextStatus && onStatusChange && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(chamado.id, nextStatus)}
              className="text-xs h-9 w-full sm:w-auto touch-target"
            >
              <ArrowRight className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{STATUS_LABELS[nextStatus]}</span>
              <span className="sm:hidden">
                {nextStatus === 'em_andamento' ? 'Iniciar' : 'Concluir'}
              </span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};