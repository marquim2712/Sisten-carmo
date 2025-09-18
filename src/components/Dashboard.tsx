import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chamadosService } from '../services/chamadosService';
import { Chamado, STATUS_LABELS } from '../types';
import { ChamadoCard } from './ChamadoCard';
import { ChamadoListItem } from './ChamadoListItem';
import { ChamadoForm } from './ChamadoForm';
import { ChamadoDetails } from './ChamadoDetails';
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
  const [viewingChamado, setViewingChamado] = useState<Chamado | null>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted mobile-scroll">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Assistência Técnica</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Sistema de Controle</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-sm font-bold text-foreground">Assistência</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.nome}</span>
                <Badge variant={isAdmin ? 'default' : 'secondary'}>
                  {isAdmin ? 'Admin' : 'Visualizador'}
                </Badge>
              </div>
              
              <div className="flex sm:hidden items-center gap-1">
                <User className="w-4 h-4 text-muted-foreground" />
                <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs px-1.5 py-0.5">
                  {isAdmin ? 'A' : 'V'}
                </Badge>
              </div>
              
              <Button variant="ghost" size="sm" onClick={logout} className="h-9 sm:h-9 px-3 sm:px-3 touch-target">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8">
        {/* Actions Bar */}
        <div className="flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar chamados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 sm:h-11 touch-target"
                />
              </div>
            </div>
            
            {isAdmin && (
              <Button onClick={() => setIsFormOpen(true)} className="shrink-0 h-11 sm:h-11 px-4 sm:px-4 touch-target">
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Novo Chamado</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 min-w-[320px] h-11 sm:h-11">
              <TabsTrigger value="todos" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">Todos</span>
                <span className="sm:hidden">Todos</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {getStatusCount('todos')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="aberto" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">Abertos</span>
                <span className="sm:hidden">Abertos</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {getStatusCount('aberto')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="em_andamento" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">Em Andamento</span>
                <span className="sm:hidden">Andamento</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {getStatusCount('em_andamento')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="concluido" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">Concluídos</span>
                <span className="sm:hidden">Concluídos</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {getStatusCount('concluido')}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

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
              <div className="space-y-2">
                {filteredChamados.map((chamado) => (
                  <ChamadoListItem
                    key={chamado.id}
                    chamado={chamado}
                    onEdit={isAdmin ? openEditForm : undefined}
                    onDelete={isAdmin ? handleDeleteChamado : undefined}
                    onStatusChange={isAdmin ? handleStatusChange : undefined}
                    onViewDetails={chamado.status === 'concluido' ? () => setViewingChamado(chamado) : undefined}
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

      {/* Details Modal */}
      <ChamadoDetails
        chamado={viewingChamado}
        isOpen={!!viewingChamado}
        onClose={() => setViewingChamado(null)}
      />
    </div>
  );
};