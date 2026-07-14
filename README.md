# 🚚 Monitoramento de Entregas API

API REST desenvolvida em Java com Spring Boot para gerenciamento e monitoramento de entregas em tempo real.

O projeto permite cadastrar pedidos, entregadores e entregas, registrar o histórico de localizações e acompanhar a posição do entregador utilizando WebSocket (STOMP).

> ⚠️ Projeto em desenvolvimento. Novas funcionalidades estão sendo adicionadas continuamente.

---

## ✨ Funcionalidades

### 📦 Pedidos
- Criar pedido
- Listar pedidos
- Buscar pedido por ID
- Atualizar pedido
- Excluir pedido

### 🚴 Entregadores
- Criar entregador
- Listar entregadores
- Buscar entregador por ID
- Atualizar entregador
- Excluir entregador

### 🚚 Entregas
- Criar entrega
- Iniciar entrega
- Concluir entrega
- Cancelar entrega
- Registrar falha da entrega
- Listar entregas
- Buscar entrega por ID

### 📍 Localizações
- Registrar localização via REST
- Registrar localização via WebSocket
- Buscar localização por ID
- Listar localizações
- Listar localizações por entrega

### ⚡ Comunicação em Tempo Real
- WebSocket com STOMP
- Publicação de localização em tempo real
- Histórico de localizações
- Salas individuais por entrega (`/topic/entregas/{id}`)

---

# 🏗 Arquitetura

```
Controller
     │
     ▼
 Service
     │
     ▼
Repository
     │
     ▼
PostgreSQL
```

### Fluxo WebSocket

```
Entregador
      │
      ▼
WebSocket (/app)
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
PostgreSQL
      │
      ▼
SimpMessagingTemplate
      │
      ▼
/topic/entregas/{id}
      │
      ▼
Cliente acompanha em tempo real
```

---

# 🛠 Tecnologias

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring WebSocket (STOMP)
- SockJS
- PostgreSQL
- Maven

---

# 📁 Estrutura do Projeto

```
src
 ├── controller
 ├── websocket
 ├── dto
 ├── model
 ├── repository
 ├── service
 ├── config
 └── exception
```

---

# 🚀 Como executar

### Clone o projeto

```bash
git clone https://github.com/SEU-USUARIO/monitoramento-entregas-api.git
```

### Acesse a pasta

```bash
cd monitoramento-entregas-api
```

### Configure o banco PostgreSQL

Atualize o arquivo:

```
application.properties
```

com suas credenciais.

### Execute

```bash
mvn spring-boot:run
```

A API ficará disponível em:

```
http://localhost:8080
```

---

# 📡 WebSocket

Conexão:

```
/ws
```

Enviar localização:

```
/app/entregas/{id}/localizacao
```

Receber localização:

```
/topic/entregas/{id}
```

---

# 📌 Próximas implementações

- [x] CRUD de Pedidos
- [x] CRUD de Entregadores
- [x] CRUD de Entregas
- [x] Histórico de Localizações
- [x] WebSocket em tempo real

### Em desenvolvimento

- [ ] Bean Validation
- [ ] ControllerAdvice
- [ ] Exceções customizadas
- [ ] Spring Security + JWT
- [ ] Autorização no WebSocket
- [ ] Swagger/OpenAPI
- [ ] Docker
- [ ] Deploy
- [ ] Leaflet + OpenStreetMap
- [ ] Geolocalização automática
- [ ] Rastreamento em mapa

---

# 🎯 Objetivo

Desenvolver uma API moderna para gerenciamento e monitoramento de entregas em tempo real, aplicando boas práticas de arquitetura, comunicação assíncrona com WebSocket e persistência de dados utilizando o ecossistema Spring.

---

# 👨‍💻 Autor

**Alexsander Santos**

- LinkedIn: www.linkedin.com/in/alexsander-santos-b010051b5