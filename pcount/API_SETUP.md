# Configuração da API - PCOUNT

## Visão Geral


- 🔌 **Com API**: Usa dados reais do backend quando disponível
- 📱 **Sem API**: Usa dados mock automaticamente como fallback

## Estrutura Criada

### Serviços API
```
src/services/
├── api.ts              # Serviço base para HTTP requests
├── authService.ts      # Autenticação e login
├── contractService.ts  # Gestão de contratos  
├── productionLineService.ts # Linhas de produção
└── productionService.ts     # Produções e estatísticas
```

### Hooks Personalizados
```
src/hooks/
├── useApi.ts          # Hook genérico para chamadas API
└── useProductions.ts  # Hooks específicos para produção
```

### Componentes de UI
```
src/components/
├── LoadingSpinner.tsx # Indicador de carregamento
└── ErrorMessage.tsx   # Mensagens de erro com retry
```

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure sua URL da API no `.env`:

```env
EXPO_PUBLIC_API_URL=https://sua-api.com/api
```

### 2. Estrutura da API Esperada

#### Autenticação
```
POST /api/auth/login
{
  "email": "string",
  "password": "string"
}
→ { "user": {...}, "token": "..." }

GET /api/auth/me
→ { "user": {...} }

POST /api/auth/logout
```

#### Contratos
```
GET /api/contracts
→ { "contracts": [...] }

GET /api/contracts/:id
→ { "contract": {...} }
```

#### Linhas de Produção
```
GET /api/production-lines
→ { "lines": [...] }

GET /api/production-lines?contractId=123
→ { "lines": [...] }

PUT /api/production-lines/:id/status
{ "status": "produzindo" | "aguardando" | "iniciando" }
```

#### Produções
```
GET /api/productions
→ { "productions": [...] }

GET /api/productions/stats
→ { "stats": {...} }

POST /api/productions
{ ...dadosProducao }
```

## Como Usar

### Autenticação com API
```typescript
const { login, loading, error } = useAuth();

const handleLogin = async () => {
  const success = await login(email, password);
  
};
```

### Dados de Produção
```typescript
import { useProductions, useProductionLines } from '../hooks/useProductions';

function MyComponent() {
  const { data: productions, loading, error } = useProductions();
  const { data: lines } = useProductionLines(contractId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return <ProductionList data={productions} />;
}
```

### Operações Manuais
```typescript
import { useProductionOperations } from '../hooks/useProductions';

function ProductionControl() {
  const { createProduction, loading } = useProductionOperations();
  
  const handleCreate = async () => {
    await createProduction({
      lineId: '1',
      productCode: 'ABC123',
      // ...outros dados
    });
  };
}
```

## Fallback Automático

A aplicação continua funcionando **normalmente** mesmo sem API:

1. ✅ **Login**: Usa credenciais mock (Admin/Admin)
2. ✅ **Contratos**: Dados estáticos predefinidos  
3. ✅ **Produções**: Estatísticas de exemplo
4. ✅ **Interface**: Sem mudanças visuais

## Estados de Loading

Todas as telas agora mostram:

- 🔄 **Loading**: Spinner durante carregamento
- ❌ **Erro**: Mensagem com botão "Tentar novamente"
- ✅ **Sucesso**: Dados carregados normalmente
