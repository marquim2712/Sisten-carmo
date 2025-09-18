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
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">{chamado.cliente_nome}</span>
            </div>
            <Badge className={getStatusColor(chamado.status)}>
              {getStatusIcon(chamado.status)}
              <span className="ml-1">{STATUS_LABELS[chamado.status]}</span>
            </Badge>
          </div>
          
          {isAdmin && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(chamado)}
                className="h-8 w-8 hover:bg-muted"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(chamado.id)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{chamado.endereco}</span>
          </div>
          
          <div className="text-sm leading-relaxed">{chamado.descricao}</div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Criado em {formatDate(chamado.criado_em)}</span>
          </div>

          {isAdmin && nextStatus && onStatusChange && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(chamado.id, nextStatus)}
              className="text-xs"
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              {STATUS_LABELS[nextStatus]}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};