import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chamadosService } from '../services/chamadosService';
import { Chamado, STATUS_LABELS } from '../types';
import { ChamadoCard } from './ChamadoCard';
import { ChamadoForm } from './ChamadoForm';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '../hooks/use-toast';
import { 
  Plus, 
  Search, 
  LogOut, 
  User, 
  BarChart3,
  Filter
} from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [filteredChamados, setFilteredChamados] = useState<Chamado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChamado, setEditingChamado] = useState<Chamado | null>(null);
  const [activeTab, setActiveTab] = useState('todos');

  const isAdmin = user?.tipo === 'admin';

  useEffect(() => {
    loadChamados();
  }, []);

  useEffect(() => {
    filterChamados();
  }, [chamados, searchTerm, activeTab]);

  const loadChamados = async () => {
    const data = await chamadosService.getChamados();
    setChamados(data);
  };

  const filterChamados = () => {
    let filtered = chamados;

    // Filtrar por status (aba)
    if (activeTab !== 'todos') {
      filtered = filtered.filter(chamado => chamado.status === activeTab);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(chamado =>
        chamado.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chamado.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChamados(filtered);
  };

  const handleCreateChamado = async (data: Omit<Chamado, 'id' | 'criado_em' | 'atualizado_em'>) => {
    const result = await chamadosService.createChamado(data);
    if (result) {
      loadChamados();
      toast({
        title: "Sucesso",
        description: "Chamado criado com sucesso"
      });
    }
  };

  const handleEditChamado = async (data: Omit<Chamado, 'id' | 'criado_em' | 'atualizado_em'>) => {
    if (editingChamado) {
      const result = await chamadosService.updateChamado(editingChamado.id, data);
      if (result) {
        loadChamados();
        setEditingChamado(null);
        toast({
          title: "Sucesso",
          description: "Chamado atualizado com sucesso"
        });
      }
    }
  };

  const handleDeleteChamado = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      const success = await chamadosService.deleteChamado(id);
      if (success) {
        loadChamados();
        toast({
          title: "Sucesso",
          description: "Chamado excluído com sucesso!",
        });
      }
    }
  };

  const handleStatusChange = async (id: string, status: Chamado['status']) => {
    const result = await chamadosService.updateStatus(id, status);
    if (result) {
      loadChamados();
      toast({
        title: "Sucesso",
        description: `Status alterado para "${STATUS_LABELS[status]}"`,
      });
    }
  };

  const openEditForm = (chamado: Chamado) => {
    setEditingChamado(chamado);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingChamado(null);
  };

  const getStatusCount = (status: string) => {
    if (status === 'todos') return chamados.length;
    return chamados.filter(c => c.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Assistência Técnica</h1>
                <p className="text-sm text-muted-foreground">Sistema de Controle</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.nome}</span>
                <Badge variant={isAdmin ? 'default' : 'secondary'}>
                  {isAdmin ? 'Admin' : 'Visualizador'}
                </Badge>
              </div>
              
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, endereço ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {isAdmin && (
            <Button onClick={() => setIsFormOpen(true)} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Novo Chamado
            </Button>
          )}
        </div>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos" className="flex items-center gap-2">
              Todos
              <Badge variant="secondary" className="text-xs">
                {getStatusCount('todos')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="aberto" className="flex items-center gap-2">
              Abertos
              <Badge variant="secondary" className="text-xs">
                {getStatusCount('aberto')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="em_andamento" className="flex items-center gap-2">
              Em Andamento
              <Badge variant="secondary" className="text-xs">
                {getStatusCount('em_andamento')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="concluido" className="flex items-center gap-2">
              Concluídos
              <Badge variant="secondary" className="text-xs">
                {getStatusCount('concluido')}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredChamados.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum chamado encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os termos de busca.' : 'Não há chamados nesta categoria.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredChamados.map((chamado) => (
                  <ChamadoCard
                    key={chamado.id}
                    chamado={chamado}
                    onEdit={isAdmin ? openEditForm : undefined}
                    onDelete={isAdmin ? handleDeleteChamado : undefined}
                    onStatusChange={isAdmin ? handleStatusChange : undefined}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Form Modal */}
      <ChamadoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingChamado ? handleEditChamado : handleCreateChamado}
        chamado={editingChamado}
      />
    </div>
  );
};