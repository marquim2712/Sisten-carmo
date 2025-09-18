import { Chamado, STATUS_LABELS } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ChamadoDetailsProps {
  chamado: Chamado | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ChamadoDetails = ({ chamado, isOpen, onClose }: ChamadoDetailsProps) => {
  if (!chamado) return null;

  const getStatusColor = (status: Chamado['status']) => {
    const colorMap = {
      aberto: 'bg-info-light text-info border-info/20',
      em_andamento: 'bg-warning-light text-warning border-warning/20',
      concluido: 'bg-success-light text-success border-success/20'
    };
    return colorMap[status];
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[600px] h-[90vh] sm:h-auto max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              chamado.status === 'aberto' ? 'bg-info-light' :
              chamado.status === 'em_andamento' ? 'bg-warning-light' :
              'bg-success-light'
            }`}>
              {getStatusIcon(chamado.status)}
            </div>
            Detalhes do Chamado
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge className={`${getStatusColor(chamado.status)} text-sm px-4 py-2`}>
              {getStatusIcon(chamado.status)}
              <span className="ml-2">{STATUS_LABELS[chamado.status]}</span>
            </Badge>
          </div>

          {/* Client Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Informações do Cliente</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium text-foreground">{chamado.cliente_nome}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium text-foreground">{chamado.endereco}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Descrição do Problema</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {chamado.descricao}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Datas</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Criado em</p>
                  <p className="font-medium text-foreground">{formatDate(chamado.criado_em)}</p>
                </div>
              </div>
              
              {chamado.atualizado_em && chamado.atualizado_em !== chamado.criado_em && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Última atualização</p>
                    <p className="font-medium text-foreground">{formatDate(chamado.atualizado_em)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t flex-shrink-0">
          <Button onClick={onClose} className="h-11 touch-target">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
