## INTEGRANTES

Guilherme Santos Nunes – RM558989 <br/>
Kaique Rodrigues Zaffarani – RM556677 <br/>
Kairo da Silva Silvestre de Carvalho – RM558288 <br/>
Pedro Josué Pereira Almeida – RM554913

<br/>

# Challenge Mobile & Cybersecurity - FIAP 2026

Aplicativo mobile desenvolvido como parte do desafio da FIAP 2026, em parceria com a Ford. O app permite explorar e consultar informações técnicas de veículos (caminhonetes) consumindo uma API REST desenvolvida em Java com Spring Boot.

---

## Sobre o Projeto

O aplicativo foi desenvolvido em React Native com Expo e oferece quatro funcionalidades principais:

- **Lançamentos**: conteúdo promocional sobre o novo Ford Ranger Raptor
- **Lista de veículos**: navegação paginada com rolagem infinita e filtro por fabricante
- **Detalhes do veículo**: especificações completas divididas em desempenho, mecânica, configurações e outros
- **Carros salvos**: favoritos persistidos localmente com AsyncStorage

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
| Persistência local | AsyncStorage |
| Tipografia | Google Fonts - Montserrat |
| Backend | Java 21 + Spring Boot 4 (API REST) |

---

## Estrutura do Projeto

```
Challenge-App/
├── App.tsx                         # Componente raiz com providers globais
├── assets/                         # Imagens, logos e GIFs
├── components/
│   ├── truckCard.tsx               # Card de veículo na listagem (memoizado)
│   └── savedCard.tsx               # Card de veículo salvo (memoizado)
├── context/
│   ├── CarProvider.tsx             # Contexto global: ID do veículo selecionado
│   └── SavedCarsProvider.tsx       # Contexto global: lista de favoritos + AsyncStorage
├── hooks/
│   ├── getCarTruckData.ts          # Hook de listagem paginada com filtro
│   └── getCarDetail.ts             # Hook de detalhes com validação de ID
├── interface/                      # DTOs e tipos da API
├── routes/
│   └── AppRoutes.tsx               # Configuração das abas de navegação
├── screens/
│   ├── ReleaseScreen/              # Tela de lançamentos
│   ├── carList/                    # Tela de lista de veículos
│   ├── details/                    # Tela de detalhes do veículo
│   └── savedCars/                  # Tela de favoritos salvos
├── services/
│   ├── authService.ts              # Gerenciamento do ciclo de vida do JWT (expo-secure-store)
│   ├── axiosInstance.ts            # Instância Axios com interceptors de auth e retry
│   └── savedCarsStorage.ts         # Wrapper AsyncStorage com validação de schema
└── types/
    └── navigation.ts               # Tipos de navegação TypeScript

ChallengeFord/
├── pom.xml                         # Dependências Maven
└── src/main/java/com/example/ChallengeFord/
    ├── ChallengeFordApplication.java
    ├── Controller/
    │   ├── CarApiController.java    # Endpoints REST com validação de entrada
    │   └── AuthController.java      # POST /auth/token — emissão de JWT
    ├── Service/
    │   ├── CarApiService.java       # Lógica de negócio, deduplicação, cache
    │   ├── JwtService.java          # Geração e validação de tokens HMAC-SHA256
    │   └── AuditLogService.java     # Trilha de auditoria estruturada
    ├── Client/
    │   └── CarApiClient.java        # Integração com API externa (carapi.app)
    ├── Config/
    │   ├── SecurityConfig.java      # Spring Security: stateless, CSRF off, rotas protegidas
    │   ├── CorsConfig.java          # CORS restrito a origens autorizadas
    │   ├── RestTemplateConfig.java  # HTTP client com timeouts configurados
    │   └── CacheConfig.java         # Cache em memória para respostas da API
    ├── Security/
    │   ├── JwtAuthFilter.java       # Valida Bearer token em todas as requisições
    │   ├── RateLimitFilter.java     # Rate limiting + detecção de anomalias
    │   └── CorrelationIdFilter.java # Correlation ID por requisição (MDC)
    ├── Exception/
    │   └── GlobalExceptionHandler.java # Tratamento centralizado de erros
    └── Model/                       # DTOs e modelos de dados
```

---

## Navegação

```
Abas principais
├── Lançamentos  — Conteúdo promocional com animações (Ford Ranger Raptor)
├── Veículos     — Lista paginada com filtro por fabricante (tela inicial)
│   └── [Selecionar veículo] → navega para Detalhes
├── Salvos       — Lista de favoritos persistidos localmente
└── (Detalhes)   — Especificações técnicas; acessada a partir de Veículos
```

A comunicação entre a tela de lista e a de detalhes é feita via `CarProvider` (React Context), evitando o repasse de props entre telas. Os favoritos são gerenciados pelo `SavedCarsProvider`, que sincroniza o estado React com o AsyncStorage.

---

## Integração com a API

A API backend é desenvolvida em Java com Spring Boot e exposta localmente na porta `8080`.

| Endpoint | Descrição |
|----------|-----------|
| `GET /cars?page={n}&make={fabricante}` | Lista paginada com filtro opcional por fabricante, modelo e versão |
| `GET /cars/{id}` | Detalhes completos de um veículo pelo ID |

O backend consome dados da API pública [carapi.app](https://carapi.app) e aplica deduplicação, validação e cache antes de entregar ao cliente. A paginação retorna metadados de navegação (`next`, `prev`, `pages`, `total`) encapsulados no objeto `CollectionDTO`.

---

## Cibersegurança

### 1. Segurança de Entrada e Validação de Dados

**Backend — Validação de parâmetros da API**

Todos os parâmetros de filtro passam por Bean Validation antes de atingir a lógica de negócio:

| Parâmetro | Regra | Ataque mitigado |
|-----------|-------|-----------------|
| `make`, `model`, `trim` | `@Pattern(^[a-zA-Z0-9 \-]*$)` + `@Size(max=50)` | **SQL Injection**, **Command Injection**, **Header Injection** — rejeita caracteres especiais antes de qualquer processamento |
| `page` | `@Min(1) @Max(100)` | **Denial of Service por payload** — impede requisições com números de página arbitrários que sobrecarregariam a API externa |
| `{id}` (path) | `@Pattern(^[0-9]+$)` | **Path Traversal**, **SQL Injection** — garante que apenas inteiros cheguem à API externa, bloqueando entradas como `../`, `1 OR 1=1`, etc. |

O `UriComponentsBuilder` codifica automaticamente todos os parâmetros antes do envio à API externa.

> **Previne: URL Injection, Open Redirect** — a codificação automática impede manipulação de query string na chamada à API externa.

**Frontend — Validação client-side**

O hook `getCarDetail.ts` valida o ID antes de disparar qualquer requisição:

```typescript
const isValidId = Number.isInteger(id) && id > 0;
return useQuery({ ..., enabled: isValidId });
```

> **Previne: Path Traversal, Parameter Tampering** — IDs negativos, zero ou não-inteiros nunca chegam à API.

O serviço `savedCarsStorage.ts` valida o schema antes de aceitar dados do AsyncStorage:

```typescript
function isValidCar(item: unknown): item is SavedCar {
    // verifica tipos de todos os campos antes de usar os dados
}
```

> **Previne: Data Tampering** — dados corrompidos ou adulterados no armazenamento local são descartados antes de chegar ao estado da aplicação.

O React Native não possui motor de renderização HTML no contexto de componentes, e o projeto não utiliza `dangerouslySetInnerHTML` nem `WebView` com conteúdo dinâmico.

> **Previne: XSS (Cross-Site Scripting)** — sem superfície de renderização HTML, dados maliciosos retornados pela API não conseguem executar código no cliente.

**Tratamento seguro de erros**

O `GlobalExceptionHandler` centraliza todas as exceções e retorna mensagens genéricas ao cliente:

> **Previne: Information Disclosure** — nenhuma exceção interna, stack trace, nome de classe ou tecnologia utilizada é exposta ao cliente. Isso dificulta o reconhecimento (*reconnaissance*) por parte de um atacante.

| Exceção | Resposta ao cliente | Log no servidor |
|---------|---------------------|-----------------|
| `ConstraintViolationException` | `{"error": "Invalid request parameters"}` | `WARN` com detalhes |
| `RestClientException` | `{"error": "Service temporarily unavailable"}` | `ERROR` com causa |
| `NoResourceFoundException` | `{"error": "Not found"}` | silencioso |
| `Exception` (genérico) | `{"error": "Internal server error"}` | `ERROR` com causa |

O `application.properties` suprime adicionalmente stack traces e nomes de classe nas respostas do Spring:

```properties
server.error.include-message=never
server.error.include-stacktrace=never
server.error.include-exception=false
```

---

### 2. Autenticação e Autorização

**Implementado via JWT (HMAC-SHA256) com fluxo invisível ao usuário.**

O app obtém um token automaticamente na inicialização — sem tela de login, sem interação do usuário.

> **Previne: Acesso Não Autorizado, Token Forgery, Token Replay** — todo endpoint (exceto `/auth/token`) exige um token válido assinado com HMAC-SHA256; a assinatura criptográfica impede a criação de tokens falsos; a expiração de 1 hora limita a janela de uso de tokens interceptados.

**Fluxo de autenticação**

```
App inicia
  └→ initializeAuth() verifica expo-secure-store
       ├─ Token existente → usa diretamente
       └─ Sem token → POST /auth/token  {"appKey": "ford-challenge-2026"}
                         └→ Servidor valida app key → retorna JWT (exp: 1h)
                              └→ Token salvo em expo-secure-store (Keystore/Keychain)

Toda requisição subsequente
  └→ Axios interceptor injeta: Authorization: Bearer <token>
       └→ JwtAuthFilter valida assinatura + expiração
            ├─ Válido → requisição prossegue
            └─ Inválido/expirado → 401 → interceptor busca novo token → retry automático
```

**Backend — `AuthController` + `JwtService` + `JwtAuthFilter`**

| Componente | Responsabilidade |
|------------|-----------------|
| `POST /auth/token` | Valida app key via `@Value("${jwt.app-key}")`; emite JWT assinado |
| `JwtService` | Gera e valida tokens HMAC-SHA256; secret de 32+ bytes via `application.properties` |
| `JwtAuthFilter` | Intercepta todas as requisições exceto `/auth/token`; valida Bearer token antes de atingir controllers |
| `SecurityConfig` | Configura Spring Security: stateless, CSRF desabilitado, `/auth/token` público, demais rotas autenticadas |

Falhas de autenticação são registradas no canal de auditoria:

| Evento | Trigger |
|--------|---------|
| `AUTH_FAILED` | App key inválida na tentativa de obter token |
| `AUTH_SUCCESS` | Token emitido com sucesso |

**Frontend — `authService.ts` + `axiosInstance.ts`**

- Token armazenado em `expo-secure-store` (criptografado pelo Keystore do Android / Keychain do iOS)
- Interceptor de request injeta `Authorization: Bearer` automaticamente
- Interceptor de response trata 401: re-obtém token e reenvia a requisição original com flag `_retry` (evita loop infinito)

**Configuração em `application.properties`**

```properties
jwt.secret=ford-challenge-fiap-2026-secret-key   # mín. 32 chars; gerar com: openssl rand -base64 32
jwt.expiration=3600000                            # 1 hora em ms
jwt.app-key=ford-challenge-2026                   # substituir por valor aleatório em produção
```

---

### 3. Proteção de APIs e Serviços

**Rate Limiting — `RateLimitFilter`**

> **Previne: Brute Force, Credential Stuffing, Denial of Service (DoS)** — um único IP não consegue sobrecarregar a API nem testar credenciais em alta frequência.

- Limite: 60 requisições por minuto por IP
- Janela deslizante resetada automaticamente a cada 60 segundos
- Resposta ao exceder: `HTTP 429` com `{"error": "Too many requests"}`
- Cleanup periódico a cada 2 minutos remove entradas de IPs inativos por mais de 5 minutos, prevenindo memory leak

**Detecção de Anomalias — `RateLimitFilter`**

> **Previne: Enumeration Attack, Scraping** — identifica clientes automatizados que varrem o catálogo de veículos consultando dezenas de IDs sequenciais em pouco tempo, mesmo sem ultrapassar o rate limit.

- Rastreia IDs únicos consultados por IP por minuto
- Ao atingir 30 IDs únicos (threshold), registra alerta no canal de auditoria:
  ```
  event=SEQUENTIAL_SCAN_DETECTED ip=x.x.x.x uniqueIds=31
  ```
- Não bloqueia automaticamente — serve como sinal para escalação manual ou futura automação

**CORS — `CorsConfig`**

```java
.allowedOrigins("http://10.0.2.2", "http://localhost", "http://127.0.0.1")
.allowedMethods("GET", "POST")
.allowedHeaders("Authorization", "Content-Type")
.maxAge(3600)
```

> **Previne: Cross-Origin Data Theft** — apenas origens autorizadas conseguem ler respostas da API. CSRF não se aplica aqui pois a autenticação usa JWT no header `Authorization` (não cookie); um site malicioso não consegue injetar esse header automaticamente. `POST` é necessário para `/auth/token`; demais recursos expõem apenas `GET`. Origens de produção devem ser configuradas antes do deploy.

**Timeouts — `RestTemplateConfig`**

O `RestTemplate` tem timeouts configurados para chamadas à API externa:

- Conexão: 5 segundos
- Leitura: 10 segundos

> **Previne: Slowloris, Slow Read DoS** — impede que threads fiquem presas indefinidamente em caso de falha ou lentidão proposital da API externa, protegendo o pool de threads do servidor.

**HTTPS/TLS**

> **Limitação conhecida (Expo Go):** O Expo Go não permite adicionar CAs customizadas no workflow gerenciado. Certificados autoassinados são rejeitados pelo OkHttp do Android. Por isso, o ambiente de desenvolvimento opera em HTTP.
>
> Para produção: configurar `server.ssl.*` no `application.properties` com certificado válido (Let's Encrypt ou corporativo) e atualizar as URLs no app para `https://`.

**Cache — `CacheConfig`**

Respostas da API externa são cacheadas em memória com `@Cacheable`:

- Cache `trucks`: respostas de listagem (chave: filtros + página)
- Cache `carDetails`: detalhes por ID (chave: ID do veículo)

> **Previne: ataques de amplificação** — requisições repetidas aos mesmos recursos não chegam à API externa, limitando o impacto de scraping lento que opera dentro do rate limit.

---

### 4. Segurança de Dados e Privacidade

**Dados armazenados localmente**

O AsyncStorage persiste apenas dados mínimos do veículo favoritado:

```typescript
{ id: number, make: string, model: string, trim: string, type: string, year: number }
```

Nenhum dado pessoal do usuário é coletado ou armazenado. O schema é validado em leitura para rejeitar estruturas adulteradas. O JWT de autenticação é armazenado separadamente via `expo-secure-store`, que usa o Keystore do Android e o Keychain do iOS para criptografia em repouso.

> **Previne: Token Theft** — o JWT não pode ser lido via `adb backup` ou acesso direto ao sistema de arquivos em dispositivos não-rooteados.

**Proteção contra exposição acidental**

- Logs do servidor contêm apenas parâmetros já validados (make, model, page) e metadados de acesso (IP, contagem)
- Nenhum `console.log` permanece no código frontend — dados não são expostos ao `adb logcat`
- Respostas de erro não revelam stack traces, nomes de classe ou tecnologias utilizadas

> **Previne: Information Disclosure via logs, Data Leakage** — nenhum dado sensível (tokens, respostas brutas da API externa, stack traces) chega a canais de diagnóstico acessíveis externamente.

---

### 5. Monitoramento, Logs e Auditoria

**Correlation ID — `CorrelationIdFilter`**

Cada requisição recebe um identificador único de 8 caracteres (`X-Correlation-ID`):

- Gerado automaticamente se não fornecido pelo cliente
- Injetado no MDC do SLF4J (chave `cid`) — disponível em todos os logs da requisição
- Retornado no header de resposta para rastreamento end-to-end (ex: correlacionar log do servidor com erro no cliente)
- `MDC.remove()` no bloco `finally` previne leak de contexto em pools de threads

Exemplo de saída nos logs:

```
2026-05-23 14:32:01 INFO  [a1b2c3d4] [...] CarApiController - GET /cars | page=1 make=Ford model=null
2026-05-23 14:32:02 WARN  [a1b2c3d4] [...] RateLimitFilter  - Rate limit exceeded | ip=192.168.1.10 count=61
```

**Log de Auditoria — `AuditLogService`**

Eventos de segurança são registrados em canal dedicado (`AUDIT`), separado dos logs operacionais:

| Evento | Trigger |
|--------|---------|
| `RATE_LIMIT_EXCEEDED` | IP ultrapassa 60 req/min |
| `SEQUENTIAL_SCAN_DETECTED` | IP consulta mais de 30 IDs únicos por minuto |

O logger `AUDIT` pode ser redirecionado para arquivo separado, sistema de alertas ou SIEM em produção via configuração do Logback, sem nenhuma mudança de código.

**Formato de log estruturado**

```
%d{yyyy-MM-dd HH:mm:ss} %-5level [%X{cid:---------}] [%thread] %logger{36} - %msg%n
```

Todos os logs incluem timestamp, nível, correlation ID, thread e logger. Nenhum dado sensível (senhas, tokens, PII) é registrado.

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (emulador) ou dispositivo físico com Expo Go
- Java 21
- Maven 3.9+

### Backend (ChallengeFord)

```bash
cd ChallengeFord
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`. Requer conexão com a internet para buscar dados da [carapi.app](https://carapi.app).

### Frontend (Challenge-App)

```bash
cd Challenge-App
npm install
npx expo start
```

Abra no emulador Android ou escaneie o QR code com o Expo Go.

> A URL da API está fixada em `http://10.0.2.2:8080` — endereço especial do emulador Android para o `localhost` da máquina host. Para dispositivo físico ou iOS, substituir pelo IP local da máquina.

---

## Limitações Conhecidas

| Item | Status | Observação |
|------|--------|------------|
| HTTPS/TLS | Não configurado em dev | HTTP no desenvolvimento; obrigatório antes de produção. Expo Go não suporta CAs customizadas |
| URL do backend hardcoded | `http://10.0.2.2:8080` | Funciona apenas no emulador Android. Usar variável de ambiente para outros ambientes |
| Cache sem TTL | In-memory com `ConcurrentMapCacheManager` | Expira com restart do servidor. Para produção, usar Caffeine ou Redis |
| Rate limiter em memória | `ConcurrentHashMap` | Não distribuído; perdido em restart. Para multi-instância, usar Redis + Bucket4j |