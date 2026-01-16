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
- **Tailwind CSS**: Estilização responsiva.
- **Recharts**: Visualização de dados (Gráfico de histórico de preços).

### Infraestrutura & Deploy

- **Render**: Hospedagem do Backend (Docker Container).
- **Vercel**: Hospedagem do Frontend.
- **Neon**: Banco de dados Postgres Serverless.

## ⚙️ Arquitetura e Funcionalidades

1. **Cadastro Inteligente:** O usuário insere apenas o link da Steam. O Backend faz o scrape, extrai título, imagem, ID e preço atual e salva no banco.
2. **Monitoramento Contínuo:** Um Job agendado (`@Scheduled`) roda em background periodicamente, verificando se houve alteração de preços nos jogos monitorados.
3. **Histórico de Preços:** Cada variação é salva em uma tabela de histórico, permitindo a geração de gráficos de tendência.

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

Este projeto está em evolução constante. As próximas features planejadas são:

- [ ] **Sistema de Alertas:** Integração com Discord Webhooks para avisar quando um preço cair.
- [ ] **Autenticação:** Login de usuários para listas de desejos privadas.
- [ ] **Comparador de Lojas:** Suporte para Epic Games e Nuuvem.
- [ ] **Dashboard:** Estatísticas avançadas de economia.

## 🤝 Contribuição

Sugestões e pull requests são bem-vindos! Sinta-se à vontade para abrir uma issue se encontrar algum bug ou tiver ideias de melhoria.

---

Desenvolvido por [Paulo Roberto](https://github.com/paulorag)
