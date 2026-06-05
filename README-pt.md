# 🎯 Game Deals Radar

[Read this document in English](README.md)

> Monitoramento de preços de jogos da Steam em tempo real com Java Spring Boot e Next.js.

![Status](https://img.shields.io/badge/STATUS-EM_DESENVOLVIMENTO-yellow)
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

## 📸 Preview

<div align="center">
  <img src="./assets/preview-home.png" alt="Tela Inicial" width="800" />
</div>

## 💻 Sobre o Projeto

O **Game Deals Radar** é uma aplicação Full Stack projetada para ajudar gamers a economizar. O sistema permite cadastrar URLs de jogos da Steam, rastrear seus preços atuais via Web Scraping e manter um histórico de variação de valores.

O diferencial técnico é a automação: um **Scheduler** no backend verifica periodicamente todos os jogos cadastrados, atualizando o histórico sem intervenção manual, criando a base para um futuro sistema de alertas de promoção.

## 🚀 Tecnologias Utilizadas

### Backend (API RESTful)

- **Java 21 & Spring Boot 3**: Core da aplicação.
- **Jsoup**: Para Web Scraping dos dados da loja Steam.
- **Spring Scheduler**: Para automação de tarefas recorrentes (atualização de preços).
- **Hibernate/JPA**: Persistência de dados.
- **PostgreSQL**: Banco de dados relacional (Hospedado no Neon/Serverless).
- **Docker**: Containerização da aplicação para deploy.

### Frontend

- **Next.js 15 (React)**: Framework moderno para renderização e rotas.
- **TypeScript**: Tipagem estática para segurança do código.
- **Tailwind CSS**: Estilização responsiva com classes canônicas v4.
- **Recharts**: Visualização de dados (Gráfico de histórico de preços).
- **React Hooks**: Gerenciamento de estado com `useState`, `useEffect`, `useContext`.
- **Componentes Customizados**: Header, Footer, Notificações, Gráficos de Preço, Listas de Jogos.

### Componentes Frontend

- **Header**: Barra de navegação com status de autenticação.
- **Footer**: Informações da marca, links rápidos e integração de redes sociais (GitHub, LinkedIn).
- **Add Game Input**: Formulário para adicionar URLs de jogos da Steam com validação.
- **Game List**: Grade de jogos rastreados com dados de preço.
- **Price Chart**: Gráficos interativos mostrando tendências do histórico de preços.
- **Notificações**: Notificações toast para feedback do usuário (sucesso, erro, aviso).
- **Formulários de Autenticação**: Login e cadastro com gestão de tokens de segurança.
- **Design Responsivo**: Abordagem mobile-first com breakpoints do Tailwind CSS.

### Infraestrutura & Deploy

- **Render**: Hospedagem do Backend (Docker Container).
- **Vercel**: Hospedagem do Frontend.
- **Neon**: Banco de dados Postgres Serverless.

## ⚙️ Arquitetura e Funcionalidades

### Funcionalidades Principais

1. **Cadastro Inteligente:** O usuário insere apenas o link da Steam. O Backend faz o scrape, extrai título, imagem, ID e preço atual e salva no banco.
2. **Monitoramento Contínuo:** Um Job agendado (`@Scheduled`) roda em background periodicamente, verificando se houve alteração de preços nos jogos monitorados.
3. **Histórico de Preços:** Cada variação é salva em uma tabela de histórico, permitindo a geração de gráficos de tendência.
4. **Dashboard do Usuário:** Painel personalizado mostrando todos os jogos rastreados e seus preços atuais.
5. **Seção de Jogos Populares:** Exibe os jogos mais rastreados na plataforma.
6. **Gráficos de Preços em Tempo Real:** Gráficos interativos utilizando Recharts para visualizar tendências de preço ao longo do tempo.

### Funcionalidades de UI/UX

- **Design Responsivo:** Abordagem mobile-first com suporte para todos os tamanhos de tela.
- **Notificações Toast:** Sistema amigável de feedback para todas as ações (adicionar, deletar, erro).
- **Fluxo de Autenticação:** Login/signup seguro com gerenciamento de tokens JWT.
- **Estados de Carregamento:** Skeleton loaders e spinners para melhor experiência do usuário.
- **Botões Interativos:** Efeitos hover e gerenciamento de estado para todos os elementos interativos.
- **Tema Escuro:** Interface moderna com cores de destaque em esmeralda.

## 🛠️ Como Rodar Localmente

### Pré-requisitos

- Java 21+
- Maven
- Node.js 18+
- Docker (Opcional, mas recomendado para o Banco de dados)

### 1. Backend

    # Clone o repositório
    git clone https://github.com/paulorag/gameDealsRadar.git

    # Entre na pasta do backend
    cd radar

    # Configure as variáveis de ambiente no application.properties ou via terminal
    # Exemplo: DB_URL, DB_USERNAME, DB_PASSWORD

    # Execute o projeto
    mvn spring-boot:run

### 2. Frontend

    # Entre na pasta do frontend
    cd web

    # Instale as dependências
    npm install

    # Crie um arquivo .env.local com a URL do backend
    # NEXT_PUBLIC_API_URL=http://localhost:8080

    # Rode o servidor de desenvolvimento
    npm run dev

## 🗺️ Roadmap (Próximos Passos)

### ✅ Funcionalidades Implementadas

- [x] **Sistema de Autenticação:** Login e cadastro de usuários com gerenciamento de tokens JWT.
- [x] **Dashboard do Usuário:** Painel personalizado para rastrear jogos e preços.
- [x] **Gráficos de Histórico de Preços:** Gráficos interativos com Recharts para visualizar tendências.
- [x] **Componente Footer:** Informações da marca, links rápidos e integração de redes sociais.
- [x] **Notificações Toast:** Sistema de feedback em tempo real para ações do usuário.
- [x] **Design Responsivo:** Interface totalmente responsiva com mobile-first usando Tailwind CSS.
- [x] **Seção de Jogos Populares:** Exibição dos jogos mais rastreados na plataforma.

### 🚧 Funcionalidades em Desenvolvimento / Planejadas

- [ ] **Sistema de Alertas:** Integração com Discord Webhooks para avisar quando preços caem.
- [ ] **Notificações por Email:** Sistema alternativo de alertas via e-mail.
- [ ] **Comparador de Lojas:** Suporte para comparação de preços com Epic Games e Nuuvem.
- [ ] **Dashboard Avançado:** Estatísticas detalhadas de economia e insights de gastos.
- [ ] **Compartilhamento de Listas:** Compartilhar listas de desejos com outros usuários.
- [ ] **Predição de Preços:** Previsão de tendências de preço baseada em ML.
- [ ] **Toggle Tema Escuro/Claro:** Preferência do usuário para tema da interface.

Este projeto está em evolução constante. Sugestões e contribuições são bem-vindas!

## 🤝 Contribuição

Sugestões e pull requests são bem-vindos! Sinta-se à vontade para abrir uma issue se encontrar algum bug ou tiver ideias de melhoria.

---

Desenvolvido por [Paulo Roberto](https://github.com/paulorag)
