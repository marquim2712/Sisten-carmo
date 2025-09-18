import { useState, useEffect } from 'react';
import { Chamado } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '../hooks/use-toast';

interface ChamadoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Chamado, 'id' | 'criado_em' | 'atualizado_em'>) => void;
  chamado?: Chamado | null;
}

export const ChamadoForm = ({ isOpen, onClose, onSubmit, chamado }: ChamadoFormProps) => {
  const [formData, setFormData] = useState({
    cliente_nome: '',
    endereco: '',
    descricao: '',
    status: 'aberto' as Chamado['status']
  });
  const { toast } = useToast();

  useEffect(() => {
    if (chamado) {
      setFormData({
        cliente_nome: chamado.cliente_nome,
        endereco: chamado.endereco,
        descricao: chamado.descricao,
        status: chamado.status
      });
    } else {
      setFormData({
        cliente_nome: '',
        endereco: '',
        descricao: '',
        status: 'aberto'
      });
    }
  }, [chamado, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente_nome.trim() || !formData.endereco.trim() || !formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    onClose();
    
    toast({
      title: "Sucesso",
      description: chamado ? "Chamado atualizado com sucesso!" : "Chamado criado com sucesso!",
    });
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {chamado ? 'Editar Chamado' : 'Novo Chamado'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente_nome">Nome do Cliente *</Label>
            <Input
              id="cliente_nome"
              value={formData.cliente_nome}
              onChange={(e) => handleChange('cliente_nome', e.target.value)}
              placeholder="Digite o nome do cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              placeholder="Digite o endereço completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Problema *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Descreva detalhadamente o problema relatado"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {chamado ? 'Atualizar' : 'Criar'} Chamado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};