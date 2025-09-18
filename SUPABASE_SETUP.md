# 🚀 Configuração do Supabase - Sistema de Assistência Técnica

Este guia mostrará como configurar o Supabase para o sistema de controle de chamados da assistência técnica.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (gratuita)
- Projeto Lovable conectado ao Supabase

## 🔗 1. Conectar Lovable ao Supabase

1. **No seu projeto Lovable**, clique no botão verde **"Supabase"** no canto superior direito
2. Siga as instruções para conectar sua conta Supabase
3. Crie um novo projeto ou selecione um existente

## 🗄️ 2. Criar as Tabelas no Banco de Dados

Acesse o **SQL Editor** no painel do Supabase e execute os comandos abaixo:

### Tabela de Usuários
```sql
-- Criar tabela de usuários
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('admin', 'visualizador')) DEFAULT 'visualizador',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir usuário admin padrão
INSERT INTO usuarios (nome, email, tipo) VALUES 
('Admin', 'admin@sistema.com', 'admin');
```

### Tabela de Chamados
```sql
-- Criar tabela de chamados
CREATE TABLE chamados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('aberto', 'em_andamento', 'concluido')) DEFAULT 'aberto',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar automaticamente o campo atualizado_em
CREATE TRIGGER update_chamados_updated_at 
    BEFORE UPDATE ON chamados 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 3. Configurar Row Level Security (RLS)

Execute no SQL Editor para configurar as políticas de segurança:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamados ENABLE ROW LEVEL SECURITY;

-- Política para usuários (todos podem ler)
CREATE POLICY "Usuários podem ser lidos por todos" 
ON usuarios FOR SELECT 
USING (true);

-- Política para chamados (todos podem ler)
CREATE POLICY "Chamados podem ser lidos por todos" 
ON chamados FOR SELECT 
USING (true);

-- Política para chamados (apenas admins podem inserir/atualizar/deletar)
CREATE POLICY "Apenas admins podem modificar chamados" 
ON chamados FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE usuarios.email = auth.jwt() ->> 'email' 
    AND usuarios.tipo = 'admin'
  )
);
```

## 🔑 4. Configurar Autenticação

1. No painel do Supabase, vá em **Authentication > Settings**
2. Configure as seguintes opções:
   - **Enable email confirmations**: Desabilite para simplicidade
   - **Enable secure email change**: Mantenha habilitado

### Usuários de Teste
Crie alguns usuários de teste no painel **Authentication > Users**:

**Admin:**
- Email: `admin@sistema.com`
- Senha: `123456`
- Metadata: `{"tipo": "admin"}`

**Visualizador:**
- Email: `user@sistema.com`
- Senha: `123456`
- Metadata: `{"tipo": "visualizador"}`

## 📊 5. Dados de Exemplo (Opcional)

Execute no SQL Editor para criar chamados de exemplo:

```sql
INSERT INTO chamados (cliente_nome, endereco, descricao, status) VALUES 
('João Silva', 'Rua das Flores, 123 - Centro', 'Problema na impressora HP LaserJet', 'aberto'),
('Maria Santos', 'Av. Principal, 456 - Bairro Novo', 'Computador não liga após queda de energia', 'em_andamento'),
('Pedro Costa', 'Rua da Paz, 789 - Vila Esperança', 'Instalação de novo sistema operacional', 'concluido');
```

## 🔧 6. Variáveis de Ambiente

O Lovable configurará automaticamente as variáveis necessárias quando conectado ao Supabase:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## ✅ 7. Verificar Configuração

1. **Teste a conexão**: Vá ao seu projeto Lovable e verifique se o login funciona
2. **Teste admin**: Faça login com `admin@sistema.com` e verifique se consegue criar/editar chamados
3. **Teste visualizador**: Faça login com `user@sistema.com` e verifique se só consegue visualizar

## 🆘 Solução de Problemas

### Erro de Autenticação
- Verifique se os usuários foram criados corretamente
- Confirme se as políticas RLS estão ativas

### Erro de Permissão
- Verifique se o campo `tipo` está correto na tabela `usuarios`
- Confirme se as políticas RLS permitem as operações necessárias

### Dados não Aparecem
- Verifique se as tabelas foram criadas corretamente
- Confirme se há dados de exemplo inseridos

## 📚 Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Lovable + Supabase Integration](https://docs.lovable.dev/integrations/supabase/)

---

🎉 **Pronto!** Seu sistema de assistência técnica está configurado e pronto para uso.