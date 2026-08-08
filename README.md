# SmartBot

<div align="center">

**A modern AI Assistant SaaS application built with Django, powered by Groq and Meta Llama models, following production-oriented software engineering practices.**

![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge\&logo=python)
![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge\&logo=django)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Groq](https://img.shields.io/badge/AI-Groq-orange?style=for-the-badge)
![Tavily](https://img.shields.io/badge/Web%20Search-Tavily-6C47FF?style=for-the-badge)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge\&logo=sqlite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Planned-336791?style=for-the-badge\&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)


</div>

---

# Overview

SmartBot is a full-stack AI Assistant developed using Django that combines conversational AI with modern web application engineering. It integrates the Groq API with Meta Llama models to provide intelligent, context-aware conversations while maintaining a clean, responsive, and intuitive user experience.

The project goes beyond a traditional chatbot by incorporating persistent conversation history, AI-powered conversation titles, long-context summarization, prompt engineering, secure authentication, conversation management, markdown rendering, syntax-highlighted code blocks, and a modular architecture designed for maintainability and future scalability.

The primary objective of SmartBot is to demonstrate how modern AI applications can be engineered using industry-standard software development practices, including separation of concerns, modular frontend architecture, secure authentication workflows, reusable backend components, and scalable AI integration.

SmartBot is being developed incrementally through well-defined engineering milestones, with each milestone focusing on a specific aspect of the application—from foundational architecture and AI integration to production engineering and deployment.

---

# Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)
* [System Architecture](#system-architecture)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Application Workflow](#application-workflow)
* [AI Processing Pipeline](#ai-processing-pipeline)
* [Authentication Flow](#authentication-flow)
* [Future Improvements](#future-improvements)
* [License](#license)
* [Author](#author)

---

# Key Features

SmartBot combines conversational AI with modern web application engineering to provide a seamless, intelligent, and production-oriented user experience. The application has been developed incrementally through multiple engineering milestones, with each milestone introducing a cohesive set of features that improve usability, maintainability, and scalability.

## AI Intelligence

* Context-aware conversations powered by the Groq API using Meta Llama models.
* Professionally engineered system prompt for consistent assistant behavior.
* AI-generated conversation titles that summarize the discussion instead of relying on the user's first message.
* Conversation summarization for efficient long-context memory while preserving all original messages.
* Adaptive response generation based on the complexity of the user's request.
* Support for programming, technical discussions, writing assistance, learning, productivity, and general conversations.
* Structured Markdown responses with intelligent formatting for improved readability.

---

## Conversation Experience

* Persistent conversations with complete chat history.
* Dynamic welcome screen with rotating suggestion cards.
* Real-time AJAX messaging without page reloads.
* Typing indicator while AI responses are being generated.
* Smooth message rendering and scrolling behavior.
* Automatic scroll-to-bottom controls for lengthy conversations.
* Conversation history preserved across browser sessions.

---

## Rich Content Rendering

* Full Markdown rendering.
* Syntax-highlighted code blocks using Highlight.js.
* One-click code copy functionality with visual feedback.
* Responsive tables for structured information.
* Blockquotes, headings, lists, links, and inline code rendering.
* Clean presentation of technical responses.

---

## Conversation Management

* Create and manage multiple conversations.
* AI-powered conversation title generation.
* Inline conversation renaming.
* Secure conversation deletion with confirmation.
* Instant sidebar search with live filtering.
* Automatic conversation ordering based on recent activity.
* Dynamic "Today" and "Previous" conversation grouping.
* Sidebar updates without requiring page refreshes.

---

## Authentication & Security

* Custom user model.
* Email-based authentication.
* Secure registration and login workflows.
* Email verification before account activation.
* Password reset using Django's secure token system.
* "Remember Me" session support.
* Protected routes for authenticated users.
* Ownership validation for user-specific resources.
* CSRF-protected state-changing requests.

---

## User Experience

* Responsive premium dark interface.
* Modular component-based layout.
* Smooth animations and transitions.
* Empty states for conversations and search results.
* Dynamic profile information.
* Modern sidebar navigation.
* Clean and distraction-free chat interface.

---

## Software Engineering

* Modular Django application architecture.
* Separation of business logic from presentation logic.
* Dedicated AI module for language model interactions.
* Dedicated prompt management module.
* Modular JavaScript architecture with feature-based organization.
* Modular CSS architecture for maintainability.
* Reusable frontend components.
* Clean AJAX communication layer.
* Scalable project organization designed for future production deployment.

---

# System Architecture

SmartBot follows a layered architecture that separates responsibilities across the frontend, backend, AI integration, and persistence layers. This separation keeps the codebase modular, maintainable, and easier to extend as new features are introduced.

At a high level, every user interaction follows a predictable request-response lifecycle. The frontend is responsible for user interaction and rendering, Django orchestrates business logic, the AI layer handles communication with the language model, and the database persists application state.

```text
                                                        SmartBot Architecture

                            ┌────────────────────────────────────────────────────────────────────┐
                            │                           Client (Browser)                         │
                            │                                                                    │
                            │  HTML Templates • CSS • JavaScript • AJAX (Fetch API)              │
                            └───────────────────────────────┬────────────────────────────────────┘
                                                            │
                                                            │ HTTP / JSON
                                                            ▼
                            ┌────────────────────────────────────────────────────────────────────┐
                            │                         Django Application                         │
                            │                                                                    │
                            │  URL Routing                                                       │
                            │        │                                                           │
                            │        ▼                                                           │
                            │  Views                                                             │
                            │        │                                                           │
                            │        ▼                                                           │
                            │  Business Logic                                                    │
                            │        │                                                           │
                            │        ├───────────────► Authentication                            │
                            │        ├───────────────► Conversation Management                   │
                            │        └───────────────► AI Services                               │
                            └───────────────────────────────┬────────────────────────────────────┘
                                                            │
                                        ┌───────────────────┼────────────────────┐
                                        │                   │                    │
                                        ▼                   ▼                    ▼
                            ┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
                            │   SQLite Database    │ │    Groq API      │ │   Tavily Search API  │
                            │                      │ │                  │ │                      │
                            │ Conversations        │ │ Meta Llama       │ │ Web Search           │
                            │ Messages             │ │ Models           │ │ Real-Time Retrieval  │
                            │ Users                │ │ AI Responses     │ │ Search Results       │
                            │ Conversation         │ │ Prompt           │ │ Current Information  │
                            │ Summaries            │ │ Engineering      │ │ Web Sources          │
                            └──────────────────────┘ │ Title Generation │ └──────────────────────┘
                                                     │ Summarization    │
                                                     └──────────────────┘
                                                            ▲
                                                            │
                                                            │ Retrieved web
                                                            │ context
                                                            │
                                                     ┌──────┴───────┐
                                                     │ AI Response  │
                                                     │ Generation   │
                                                     └──────────────┘
```

## Architectural Principles

The project has been developed around several software engineering principles that improve maintainability and long-term scalability.

### Separation of Concerns

Each layer of the application has a clearly defined responsibility.

* The frontend is responsible for presentation and user interaction.
* Django views coordinate incoming requests and responses.
* AI-related functionality is isolated into dedicated modules.
* Database models represent application data without containing presentation logic.

Keeping responsibilities separate makes features easier to modify and reduces coupling between different parts of the application.

---

### Modular Design

Rather than concentrating functionality in a few large files, SmartBot is divided into small, focused modules.

Examples include:

* Dedicated AI utilities
* Prompt management
* Authentication application
* Chat application
* Modular JavaScript files
* Modular CSS stylesheets

This organization improves readability, testing, and future extensibility.

---

### State Persistence

Application state is stored in the database rather than relying on browser memory.

This includes:

* User accounts
* Conversation history
* Conversation summaries
* AI-generated conversation titles
* Authentication state

Persisting state ensures that users can resume conversations across sessions without losing context.

---

### AI-Centric Architecture

The AI layer is designed as an independent service rather than being tightly coupled to the Django views.

Responsibilities of the AI layer include:

* Building conversation context
* Applying system prompts
* Generating AI responses
* Creating conversation titles
* Producing conversation summaries

This separation allows AI capabilities to evolve independently without requiring significant changes to the application's request handling logic.

---

### Scalability Considerations

Although SmartBot currently uses SQLite during development, the overall architecture has been designed to support future production deployment with PostgreSQL and additional infrastructure.

Business logic, AI services, frontend modules, and authentication workflows have all been organized with future growth and maintainability in mind rather than short-term implementation convenience.

---

# Technology Stack

SmartBot is built using a combination of backend, frontend, database, and AI technologies selected to provide a maintainable foundation for a modern conversational AI application.

| Layer               | Technology                   | Purpose                                                                  |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| Backend             | Python                       | Core application programming language                                    |
| Web Framework       | Django                       | Request handling, authentication, routing, ORM, and backend architecture |
| Frontend            | HTML5                        | Application structure and semantic markup                                |
| Styling             | CSS3                         | Custom UI styling, responsive layouts, animations, and design system     |
| UI Utilities        | Bootstrap                    | Responsive utilities and supporting UI components                        |
| Client-side Logic   | JavaScript (ES6+)            | Dynamic interactions, chat behavior, DOM updates, and application state  |
| Communication       | Fetch API / AJAX             | Asynchronous communication between frontend and Django                   |
| Database            | SQLite                       | Development database                                                     |
| Production Database | PostgreSQL                   | Planned production database                                              |
| AI Provider         | Groq API                     | High-performance LLM inference                                           |
| AI Model            | Meta Llama                   | Conversational language generation                                       |
| Web Search          | Tavily Search API            | Retrieves current information from the web for time-sensitive queries    |
| Markdown            | Marked.js                    | Rendering AI-generated Markdown responses                                |
| Syntax Highlighting | Highlight.js                 | Syntax highlighting for generated code                                   |
| Authentication      | Django Authentication System | User authentication, sessions, password management, and authorization    |
| Email               | Gmail SMTP                   | Account verification and password-reset emails                           |
| Configuration       | Environment Variables        | Secure management of API keys and application secrets                    |

## Backend

### Python

Python is used as the primary backend programming language because of its mature ecosystem, readability, and strong support for web development and AI integrations.

### Django

Django provides the core application framework and is responsible for:

* URL routing
* Request and response handling
* Database interaction through the Django ORM
* Authentication and authorization
* Form validation
* Session management
* CSRF protection
* Template rendering
* Application structure

The project is divided into Django applications according to functional responsibilities rather than placing the entire application into a single module.

---

## Frontend

### HTML5

HTML provides the structural foundation of the application, including:

* Application layout
* Chat interface
* Sidebar
* Authentication pages
* Conversation controls
* Composer interface

### CSS3

SmartBot uses a modular CSS architecture rather than a single stylesheet.

The styling system handles:

* Design tokens
* Theme variables
* Layout
* Components
* Chat-specific styling
* Responsive behavior
* Animations
* Markdown presentation

### Bootstrap

Bootstrap is used primarily for responsive utilities and layout support while the application's visual identity is controlled through custom CSS.

### JavaScript

Modern JavaScript is responsible for the interactive client-side experience.

The frontend handles:

* AJAX communication
* Message rendering
* Conversation switching
* Sidebar updates
* Search
* Rename and delete interactions
* Typing indicators
* Scroll behavior
* Code-copy interactions
* Dynamic suggestion cards

JavaScript is organized into feature-specific modules to prevent the frontend from becoming dependent on a single large script.

---

## AI Layer

### Groq API

Groq provides the inference layer used by SmartBot for conversational AI.

It is responsible for generating:

- Normal assistant responses
- Conversation titles
- Conversation summaries
- Final responses based on retrieved web information

### Meta Llama

Meta Llama models are used as the underlying language models through the Groq inference platform.

### Tavily Search API

Tavily provides SmartBot's real-time web retrieval capability.

It is used when a user's request requires information that may have changed recently, such as:

- Current events
- Latest technology releases
- Recent AI developments
- Current documentation
- Recent news
- Other time-sensitive information

Tavily retrieves relevant web sources, while Groq uses those retrieved results to generate the final response.

The two services therefore have separate responsibilities:

Tavily → Retrieve current information

Groq → Understand, reason over, and generate the final response

### Meta Llama

Meta Llama models are used as the underlying language models through the Groq inference platform.

SmartBot builds structured context before sending requests to the model, combining the system prompt, conversation summary, recent messages, and current user input.

---

## Content Rendering

### Marked.js

Marked.js converts Markdown generated by the AI into HTML for display inside the chat interface.

SmartBot supports Markdown features including:

* Headings
* Lists
* Bold and emphasis
* Links
* Tables
* Blockquotes
* Inline code
* Fenced code blocks

### Highlight.js

Highlight.js provides syntax highlighting for code generated by the AI.

Language-specific code blocks are detected and rendered with appropriate syntax highlighting to improve readability for technical conversations.

---

## Database

### SQLite

SQLite is currently used during development because it provides a lightweight relational database with minimal configuration.

Application data includes:

* Users
* Conversations
* Messages
* Conversation summaries
* Conversation metadata

### PostgreSQL

PostgreSQL is planned for production deployment.

The application uses Django's ORM to keep database access abstracted from business logic, making the eventual migration from SQLite to PostgreSQL straightforward.

---

## Authentication and Email

SmartBot uses Django's authentication infrastructure together with a custom user model.

The authentication system supports:

* Email-based login
* User registration
* Email verification
* Session management
* Remember Me
* Password reset
* Protected resources

Gmail SMTP is used during development for transactional authentication emails such as verification and password-reset messages.

---

## Configuration and Secrets

Sensitive configuration values are kept outside the source code using environment variables.

Examples include:

* Groq API credentials
* SMTP credentials
* Django secret configuration
* Database configuration for deployment

This prevents credentials and environment-specific configuration from being hard-coded into the application source.

---

# Project Structure

SmartBot follows a modular project structure where application responsibilities are separated into dedicated Django apps, frontend modules, templates, and configuration layers.

A simplified representation of the project is shown below:

```text
                                                        SmartBot/
                                                        │
                                                        ├── apps/
                                                        │   │
                                                        │   ├── authentication/
                                                        │   │   ├── migrations/
                                                        │   │   ├── templates/
                                                        │   │   ├── admin.py
                                                        │   │   ├── apps.py
                                                        │   │   ├── backends.py
                                                        │   │   ├── forms.py
                                                        │   │   ├── models.py
                                                        │   │   ├── urls.py
                                                        │   │   └── views.py
                                                        │   │
                                                        │   ├── chat/
                                                        │   │   ├── migrations/
                                                        │   │   ├── ai.py
                                                        │   │   ├── models.py
                                                        │   │   ├── prompts.py
                                                        │   │   ├── urls.py
                                                        │   │   └── views.py
                                                        │   │
                                                        │   └── core/
                                                        │       ├── migrations/
                                                        │       ├── apps.py
                                                        │       ├── urls.py
                                                        │       └── views.py
                                                        │
                                                        ├── smartbot/
                                                        │   ├── settings.py
                                                        │   ├── urls.py
                                                        │   ├── asgi.py
                                                        │   └── wsgi.py
                                                        │
                                                        ├── static/
                                                        │   │
                                                        │   ├── css/
                                                        │   │   ├── variables.css
                                                        │   │   ├── base.css
                                                        │   │   ├── components.css
                                                        │   │   ├── chat.css
                                                        │   │   └── responsive.css
                                                        │   │
                                                        │   └── js/
                                                        │       ├── config.js
                                                        │       ├── chat.js
                                                        │       ├── conversation.js
                                                        │       ├── markdown.js
                                                        │       └── ui.js
                                                        │
                                                        ├── templates/
                                                        │   ├── base.html
                                                        │   ├── core/
                                                        │   ├── authentication/
                                                        │   └── ...
                                                        │
                                                        ├── media/
                                                        │
                                                        ├── .env
                                                        ├── .gitignore
                                                        ├── manage.py
                                                        ├── requirements.txt
                                                        └── README.md
```

## Application Responsibilities

### `apps/authentication/`

Contains all user authentication and account-management functionality.

Responsibilities include:

* Custom user model
* Registration
* Login
* Logout
* Email verification
* Password reset
* Authentication forms
* Email authentication backend
* Authentication views and URLs

---

### `apps/chat/`

Contains the core conversational functionality and AI integration.

Responsibilities include:

* Conversation model
* Message model
* Conversation summaries
* Chat views
* AI communication
* AI-generated titles
* Conversation summarization
* System prompts
* Chat-related URLs

Important modules include:

**`ai.py`**

Encapsulates communication with the Groq API and AI-specific operations.

**`prompts.py`**

Contains reusable system, title-generation, and summary-generation prompts.

**`models.py`**

Defines the persistent conversation and message data structures.

**`views.py`**

Coordinates chat requests, conversation operations, persistence, and responses to the frontend.

---

### `apps/core/`

Contains application-wide pages and functionality that do not belong exclusively to authentication or chat.

The primary responsibility currently includes the main application/home interface.

---

## Frontend Architecture

SmartBot's frontend is deliberately divided into focused JavaScript modules.

### `config.js`

Centralizes shared frontend configuration and commonly accessed DOM/application state.

### `chat.js`

Responsible for the core messaging workflow, including:

* Sending messages
* AJAX communication
* Send-state management
* Enter-to-send behavior

### `conversation.js`

Handles conversation-related interactions such as:

* Creating conversations
* Switching conversations
* Rename interactions
* Delete interactions
* Conversation sidebar behavior

### `markdown.js`

Responsible for:

* Markdown conversion
* Code block processing
* Syntax highlighting

### `ui.js`

Contains reusable interface behavior such as:

* Typing indicator
* Scroll behavior
* Scroll-to-bottom button
* Rate-limit UI
* UI state helpers

This separation prevents unrelated frontend responsibilities from being concentrated inside one large JavaScript file.

---

## CSS Architecture

The stylesheet is similarly divided according to responsibility.

### `variables.css`

Contains design tokens such as:

* Colors
* Typography
* Spacing
* Borders
* Radii
* Shadows

### `base.css`

Contains foundational styles including:

* Reset styles
* Global layout
* Application shell
* Base animations

### `components.css`

Contains reusable interface components such as:

* Sidebar
* Topbar
* Buttons
* Composer
* Icons
* Scrollbars

### `chat.css`

Contains chat-specific styling including:

* Welcome screen
* Message bubbles
* AI responses
* User responses
* Markdown content
* Code blocks
* Suggestion cards
* Rate-limit interface

### `responsive.css`

Contains responsive rules and media queries, keeping device-specific behavior separate from the primary component styles.

---

## Design Principle

The project structure follows a simple rule:

> **A module should have a clear reason to change.**

Authentication changes should primarily remain within the authentication application. AI provider changes should primarily affect the AI layer. Frontend interaction changes should remain within the relevant JavaScript module.

This reduces coupling between unrelated parts of the system and provides a cleaner foundation for future development.

---

# Application Workflow

SmartBot follows a request-driven architecture in which the browser communicates with Django through asynchronous HTTP requests, while Django coordinates persistence, AI processing, and external services.

The following workflow represents the typical lifecycle of a user message.

```text
                                                    User
                                                    │
                                                    │ Enter message
                                                    ▼
                                                    Browser
                                                    │
                                                    │ Fetch / AJAX
                                                    ▼
                                                    Django Chat Endpoint
                                                    │
                                                    ├── Validate request
                                                    │
                                                    ├── Identify conversation
                                                    │
                                                    ├── Save user message
                                                    │
                                                    ├── Build conversation context
                                                    │
                                                    └── Process AI request
                                                            │
                                                            ├── Normal request
                                                            │       │
                                                            │       ▼
                                                            │     Groq
                                                            │
                                                            └── Current-information request
                                                                    │
                                                                    ▼
                                                                Tavily
                                                                    │
                                                                    ▼
                                                            Retrieved Context
                                                                    │
                                                                    ▼
                                                                Groq
                                                                    │
                                                                    ▼
                                                            AI Response
                                                                    │
                                                                    ▼
                                                            Save AI Response
                                                            │
                                                            ├── Update conversation activity
                                                            ├── Update conversation metadata
                                                            └── Return JSON response
                                                                    │
                                                                    ▼
                                                            Browser
                                                            │
                                                            ├── Render AI response
                                                            ├── Render Markdown
                                                            ├── Highlight code
                                                            ├── Update sidebar
                                                            └── Update chat state
```

## Request Lifecycle

### 1. User Input

The user enters a message through the chat composer.

The frontend validates the input and prevents empty or whitespace-only submissions.

### 2. Asynchronous Request

The JavaScript chat module sends the message to Django using the Fetch API.

The page does not need to reload, allowing the conversation to remain interactive while the request is processed.

### 3. Backend Processing

Django receives the request and performs the required validation and conversation lookup.

The user's message is persisted before AI processing so that the conversation remains durable even while the AI request is being processed.

### 4. Context Construction

The backend constructs the context required by the AI layer.

Depending on the conversation state, this can include:

* System instructions
* Conversation summary
* Recent messages
* Current user input

For requests requiring current information, web results retrieved through Tavily are also incorporated into the AI context.

### 5. AI Generation

Groq provides the LLM inference layer.

For normal requests, the conversation context is sent directly to Groq.

For current-information requests, Tavily first retrieves relevant web information, which is then provided to Groq so the model can generate the final response.

### 6. Persistence

The generated AI response is stored in the corresponding conversation.

Conversation activity metadata is also updated so that recently active conversations can be correctly ordered in the sidebar.

### 7. JSON Response

Django returns the result to the browser as JSON.

The response contains the information required by the frontend to update the current conversation and relevant UI state.

### 8. Client-Side Rendering

The frontend receives the response and updates the interface without a full page reload.

The response is processed through the existing rendering pipeline, including Markdown conversion and syntax highlighting where applicable.

The sidebar and conversation state are also updated to reflect the latest activity.

## Design Principle

The workflow keeps responsibilities separated:

* **Browser** handles presentation and interaction.
* **Django** handles application orchestration and persistence.
* **Tavily** handles real-time information retrieval.
* **Groq** handles language-model inference and response generation.
* **Database** provides persistent application state.

This separation allows individual components to evolve without tightly coupling the entire application to a single service.

---

# AI Processing Pipeline

SmartBot separates information retrieval from language generation. Groq is responsible for generating responses using Meta Llama models, while Tavily provides real-time web retrieval when a request requires current information.

This separation allows the application to combine persistent conversational context with fresh external information without coupling the AI generation layer to the retrieval provider.

## Context Construction

Before generating a response, SmartBot constructs the relevant conversational context.

The context can contain:

* System instructions
* Conversation summary
* Recent conversation messages
* Current user message
* Retrieved web information when required

Older conversation history can be represented through the stored conversation summary, while recent messages preserve the immediate conversational context.

Original messages remain stored in the database and are never deleted as part of context optimization.

## Retrieval Decision

Not every user request requires a web search.

SmartBot first determines whether the request requires information that may have changed recently.

### Standard Request

For questions that can be answered using the model's existing knowledge and the conversation context:

```text
User Message
      │
      ▼
Context Construction
      │
      ▼
Groq / Meta Llama
      │
      ▼
AI Response
```

### Current-Information Request

When the request requires fresh information:

```text
User Message
      │
      ▼
Context / Query Analysis
      │
      ▼
Tavily Search API
      │
      ▼
Relevant Web Results
      │
      ▼
Retrieved Web Context
      │
      ▼
Groq / Meta Llama
      │
      ▼
Final AI Response
```

Tavily is therefore used as a retrieval layer rather than as the response-generation engine.

## Retrieval-Augmented Generation

For current-information requests, SmartBot follows a retrieval-augmented generation approach.

```text
                         ┌─────────────────────┐
                         │      User Query     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Context / Query     │
                         │ Analysis             │
                         └──────────┬──────────┘
                                    │
                          Fresh information?
                              /           \
                            No             Yes
                            │               │
                            ▼               ▼
                    ┌──────────────┐  ┌──────────────┐
                    │    Groq      │  │    Tavily    │
                    │   / Llama    │  │    Search    │
                    └──────┬───────┘  └──────┬───────┘
                           │                  │
                           │                  ▼
                           │          Web Search Results
                           │                  │
                           │                  ▼
                           │          Retrieved Context
                           │                  │
                           └──────────┬───────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │    Groq      │
                              │   / Llama    │
                              │              │
                              │ Final Answer │
                              └──────┬───────┘
                                     │
                                     ▼
                              Stored Response
```

The retrieval process provides external evidence to the language model, while Groq remains responsible for interpreting the information and producing the final response.

## Conversation Memory

SmartBot maintains conversational continuity using persistent database messages and conversation summaries.

The effective context is structured as:

```text
System Instructions
        +
Conversation Summary
        +
Recent Messages
        +
Current User Message
        +
Retrieved Web Context (when required)
```

This approach allows SmartBot to maintain relevant historical context without continually sending the entire conversation to the model.

## AI-Generated Conversation Titles

New conversations can receive an AI-generated title based on the initial interaction.

The title-generation process is separate from normal response generation.

```text
First User Message
        │
        ▼
AI Response
        │
        ▼
Title Generation
        │
        ▼
Conversation Title
        │
        ▼
Database
```

Titles are generated only when a conversation still has its initial title, preventing subsequent messages from repeatedly changing the conversation name.

## Conversation Summarization

Long conversations can accumulate significant amounts of message history.

SmartBot uses conversation summaries to preserve important historical context while reducing the amount of older raw conversation data that must be included in every AI request.

The summary prioritizes information such as:

* User goals
* Important technical details
* Decisions made during the conversation
* Relevant constraints
* Important contextual information

Unnecessary greetings, repetition, and conversational noise are excluded from the summary.

## Separation of Responsibilities

The AI architecture follows a clear separation of concerns:

| Component          | Responsibility                                 |
| ------------------ | ---------------------------------------------- |
| Django             | Application orchestration and request handling |
| Conversation Layer | Persistent conversation state                  |
| Summary System     | Compressing relevant historical context        |
| Tavily             | Real-time web information retrieval            |
| Groq               | LLM inference and response generation          |
| Meta Llama         | Underlying language model                      |
| Frontend           | Response rendering and user interaction        |

This architecture allows the retrieval provider, language model, and application layer to evolve independently.

## Failure Handling

External AI services are treated as unreliable dependencies.

The application therefore handles service-level failures without allowing an external API failure to compromise the overall application state.

Examples include:

* AI provider rate limits
* Temporary retrieval failures
* Empty search results
* Network failures
* Invalid API credentials
* AI service availability changes

The backend remains responsible for determining the appropriate fallback or user-facing state while keeping API credentials and external service communication server-side.

---

# Authentication Flow

SmartBot uses Django's authentication framework with a custom user model and email-based authentication.

The authentication system protects user conversations and ensures that conversation data remains associated with the authenticated account.

```text id="a7k3p2"
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                    Login / Register
                             │
                             ▼
                    ┌─────────────────┐
                    │ Django Auth     │
                    │ System          │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
              Register                 Login
                 │                       │
                 ▼                       ▼
          Create Account          Validate Credentials
                 │                       │
                 ▼                       ▼
        Email Verification       Authentication Backend
                 │                       │
                 ▼                       ▼
          Activate Account       Create Authenticated Session
                 │                       │
                 └───────────┬───────────┘
                             │
                             ▼
                       SmartBot Chat
                             │
                             ▼
                  User-specific Conversations
```

## Key Security Measures

* Custom user model with unique email addresses.
* Email verification before account activation.
* Passwords handled through Django's secure password hashing.
* Email-based authentication with case-insensitive lookup.
* CSRF protection for state-changing requests.
* POST-only logout and destructive operations.
* Protected conversation access using the authenticated user.
* Secure password-reset tokens provided by Django.
* Environment variables used for sensitive credentials.

Once authenticated, each conversation is associated with its owner, ensuring that users can access only their own conversation data.
