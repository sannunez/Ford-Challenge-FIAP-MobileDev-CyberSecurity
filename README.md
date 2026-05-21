# Challenge Mobile - FIAP 2026

Aplicativo mobile desenvolvido como parte do desafio da FIAP 2026, em parceria com a Ford. O app permite explorar e consultar informações técnicas de veículos (carros e caminhonetes) consumindo uma API REST desenvolvida em Java com Spring Boot.

---

## Sobre o Projeto

O aplicativo foi desenvolvido em React Native com Expo e oferece três funcionalidades principais:

- **Lista de veículos**: navegação paginada com rolagem infinita e filtro por fabricante
- **Detalhes do veículo**: especificações completas divididas em desempenho, mecânica, configurações e outros
- **Lançamentos**: conteúdo promocional sobre o novo Ford Ranger Raptor

A interface é inteiramente em português (pt-BR) e utiliza tema escuro.

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Framework mobile | React Native + Expo |
| Linguagem | TypeScript (modo estrito) |
| Navegação | React Navigation (Bottom Tabs + Stack) |
| Requisições HTTP | Axios |
| Gerenciamento de dados | TanStack React Query (paginação infinita) |
| Tipografia | Google Fonts - Montserrat |
| Backend | Java + Spring Boot (API REST) |

---

## Estrutura do Projeto

```
Challenge-App/
├── App.tsx                    # Componente raiz com providers globais
├── assets/                    # Imagens, logos e GIFs
├── components/
│   └── truckCard.tsx          # Card de veículo (memoizado)
├── context/
│   └── CarProvider.tsx        # Contexto global para ID do veículo selecionado
├── hooks/
│   ├── getCarTruckData.ts     # Hook de listagem paginada com filtro
│   └── getCarDetail.ts        # Hook de detalhes com validação de ID
├── interface/                 # DTOs e tipos da API
├── routes/
│   └── AppRoutes.tsx          # Configuração das abas de navegação
├── screens/
│   ├── carList/               # Tela de lista de veículos
│   ├── details/               # Tela de detalhes do veículo
│   └── ReleaseScreen/         # Tela de lançamentos
└── types/
    └── navigation.ts          # Tipos de navegação TypeScript
```

---

## Navegação

```
Abas principais
├── Lançamentos    - Conteúdo promocional com animações
├── Veículos       - Lista paginada com filtro por fabricante (tela inicial)
│   └── [Selecionar veículo] -> navega para Detalhes
└── Detalhes       - Especificações técnicas do veículo selecionado
```

A comunicação entre a tela de lista e a de detalhes é feita via `CarProvider` (React Context), evitando o repasse de props entre telas.

---

## Integração com a API

A API backend é desenvolvida em Java com Spring Boot e exposta localmente na porta `8080`.

| Endpoint | Descrição |
|----------|-----------|
| `GET /cars?page={n}&make={fabricante}` | Lista paginada com filtro opcional por fabricante |
| `GET /cars/{id}` | Detalhes completos de um veículo pelo ID |

A paginação retorna metadados de navegação (`next`, `prev`, `pages`, `total`) encapsulados no objeto `CollectionDTO`.

---

## Segurança

### Medidas implementadas

**Validação de entrada na camada de dados**

O hook `getCarDetail.ts` valida o ID antes de disparar qualquer requisição à API:

```typescript
const isValidId = Number.isInteger(id) && id > 0;
return useQuery({
    queryFn: () => fetchCarDetails(id),
    enabled: isValidId,
});
```

Isso evita chamadas malformadas com IDs negativos, decimais, nulos ou indefinidos.

**Tratamento genérico de erros**

Erros retornados pela API não são expostos diretamente ao usuário. As telas exibem mensagens genéricas:

- Lista de veículos: `"Não foi possível carregar os veículos."`
- Detalhes: `"Não foi possível carregar os detalhes."`

Isso previne vazamento de informações internas da API ou do servidor para o usuário final.

**Remoção de logs de interação do usuário**

Chamadas a `console.log` que registravam dados de interação do usuário foram removidas, evitando o vazamento de informações nos logs do dispositivo.

**TypeScript em modo estrito**

O arquivo `tsconfig.json` utiliza `"strict": true`, o que garante tipagem rigorosa em todo o projeto e previne erros de tipo em tempo de execução.

**Isolamento de estado via Context API**

O ID do veículo selecionado é armazenado exclusivamente no React Context (client-side), sem persistência ou exposição externa.

### Considerações de segurança para produção

- Substituir `http://10.0.2.2:8080` por HTTPS em ambiente de produção
- Implementar autenticação e autorização na API
- Adicionar rate limiting no cliente para evitar abuso de requisições
- Configurar cabeçalhos de segurança no backend (CORS restritivo, HSTS, etc.)

---

## Como Executar

### Pré-requisitos

- Node.js
- Expo CLI (`npm install -g expo-cli`)
- Android Studio ou dispositivo físico com Expo Go
- Backend Java rodando localmente na porta `8080`

### Instalação

```bash
cd Challenge-App
npm install
npx expo start
```

Abra o app no emulador Android ou escaneie o QR code com o Expo Go.

---

## Equipe

Projeto desenvolvido por alunos da FIAP como parte do Challenge 2026 em parceria com a Ford.
