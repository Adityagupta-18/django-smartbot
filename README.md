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
* [Conversation Management Flow](#conversation-management-flow)
* [Installation and Setup](#installation-and-setup)
* [Environment Configuration](#environment-configuration)
* [Engineering Decisions](#engineering-decisions)
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

SmartBot follows a request-driven architecture in which the browser handles user interaction, Django coordinates application logic, the database maintains persistent state, and the AI layer handles language generation.

The application is designed so that a user interaction can move through the system without requiring a full page reload. AJAX requests are used for chat operations, while Django remains responsible for authentication, authorization, persistence, and business logic.

## End-to-End Request Flow

The following diagram represents the general lifecycle of a chat request:

```text
                                                        ┌──────────────────────┐
                                                        │        User          │
                                                        │  Enters a message    │
                                                        └──────────┬───────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │      Frontend        │
                                                        │ HTML + JavaScript    │
                                                        │ Fetch API / AJAX     │
                                                        └──────────┬───────────┘
                                                                   │
                                                                   │ HTTP POST
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │    Django View       │
                                                        │ Authentication       │
                                                        │ Validation           │
                                                        │ Conversation Lookup  │
                                                        └──────────┬───────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │      Database        │
                                                        │ Save User Message    │
                                                        └──────────┬───────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │    AI Context        │
                                                        │                      │
                                                        │ System Prompt        │
                                                        │ Conversation Summary │
                                                        │ Recent Messages      │
                                                        │ Current Message      │
                                                        └──────────┬───────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │      AI Module       │
                                                        │                      │
                                                        │ Context / Query      │
                                                        │ Analysis             │
                                                        └──────────┬───────────┘
                                                                   │
                                                    Requires current information?
                                                         /                   \
                                                        No                   Yes
                                                        │                     │
                                                        ▼                     ▼
                                                ┌────────────────┐    ┌──────────────────────┐
                                                │    Groq /      │    │   Tavily Search API  │
                                                │    Llama       │    │                      │
                                                │                │    │ Real-Time Web Search │
                                                │ AI Generation  │    │ Search Results       │
                                                └───────┬────────┘    └──────────┬───────────┘
                                                        │                        │
                                                        │                        │ Retrieved
                                                        │                        │ Web Context
                                                        │                        ▼
                                                        │                 ┌────────────────┐
                                                        │                 │  Groq / Llama  │
                                                        │                 │                │
                                                        │                 │ Final Response │
                                                        │                 └───────┬────────┘
                                                        │                         │
                                                        └────────────┬────────────┘
                                                                     │
                                                                     │ AI Response
                                                                     ▼
                                                        ┌──────────────────────┐
                                                        │      Database        │
                                                        │                      │
                                                        │ Save AI Response     │
                                                        │ Update Conversation  │
                                                        └──────────────────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │     Django JSON      │
                                                        │       Response       │
                                                        └──────────┬───────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │      Frontend        │
                                                        │ Markdown Rendering   │
                                                        │ Syntax Highlighting  │
                                                        │ UI Updates           │
                                                        └──────────────────────┘
```

This flow keeps the frontend responsible for presentation while Django remains the central coordinator of application state and backend operations.

---

## AI Processing Pipeline

SmartBot does not send the entire conversation to the language model indefinitely. Instead, it combines long-term summarized context with recent messages to maintain conversational continuity while controlling the amount of context sent to the model.

```text
                                                        User Message
                                                            │
                                                            ▼
                                                    Save to Database
                                                            │
                                                            ▼
                                                Build Conversation Context
                                                             │
                                                ┌────────────┼────────────┐
                                                │            │            │
                                                ▼            ▼            ▼
                                        System Prompt   Summary    Recent Messages
                                                │            │            │
                                                └────────────┼────────────┘
                                                             │
                                                             ▼
                                                    Current User Message
                                                             │
                                                             ▼
                                                ┌──────────────────────┐
                                                │      AI Module       │
                                                │                      │
                                                │ Query + Context      │
                                                │ Analysis             │
                                                └──────────┬───────────┘
                                                           │
                                                Fresh information needed?
                                                     /               \
                                                    No               Yes
                                                    │                 │
                                                    ▼                 ▼
                                            ┌──────────────┐   ┌─────────────────┐
                                            │ Groq / Llama │   │ Tavily Search   │
                                            │              │   │                 │
                                            │ Generation   │   │ Web Retrieval   │
                                            └──────┬───────┘   └────────┬────────┘
                                                   │                    │
                                                   │                    ▼
                                                   │             Retrieved Context
                                                   │                    │
                                                   │                    ▼
                                                   │            ┌──────────────┐
                                                   └──────────► │ Groq / Llama │
                                                                │              │
                                                                │ Generation   │
                                                                └──────┬───────┘
                                                                       │
                                                                       ▼
                                                                Final AI Response
                                                                        │
                                                            ┌───────────┴───────────┐
                                                            │                       │
                                                            ▼                       ▼
                                                    Save Response          Additional AI Tasks
                                                                                     │
                                                                        ┌────────────┴────────────┐
                                                                        ▼                         ▼
                                                                Generate Title            Generate Summary
                                                                (when required)           (when required)
```

### Context Strategy

The AI context is composed of four logical components:

1. **System Prompt** — Defines SmartBot's identity, behavior, communication style, and formatting rules.
2. **Conversation Summary** — Provides compressed context from earlier parts of a long conversation.
3. **Recent Messages** — Preserves the latest conversational exchanges with their original detail.
4. **Current User Message** — Provides the immediate request being answered.

Original messages remain permanently stored in the database. Summarization is used for context optimization rather than data deletion.

---

## Conversation Lifecycle

A conversation begins when a user creates a new chat and continues as messages are exchanged.

```text
                                                        ┌───────────────┐
                                                        │   New Chat    │
                                                        └───────┬───────┘
                                                                │
                                                                ▼
                                                        ┌────────────────────┐
                                                        │ Create Conversation│
                                                        └────────┬───────────┘
                                                                 │
                                                                 ▼
                                                        ┌────────────────────┐
                                                        │ User Sends Message │
                                                        └────────┬───────────┘
                                                                 │
                                                                 ▼
                                                        ┌────────────────────┐
                                                        │ Generate AI Reply  │
                                                        └────────┬───────────┘
                                                                 │
                                                                 ▼
                                                      ┌─────────────────────────┐
                                                      │ Persist User + AI Data  │
                                                      └──────────┬──────────────┘
                                                                 │
                                                                 ▼
                                                       ┌─────────────────────────┐
                                                       │ Update Conversation     │
                                                       │ Activity / Title /      │
                                                       │ Summary when required   │
                                                       └──────────┬──────────────┘
                                                                  │
                                                                  ▼
                                                        ┌─────────────────────────┐
                                                        │ Continue Conversation   │
                                                        └─────────────────────────┘
```

---

## Authentication Workflow

Authentication is handled by Django using a custom user model and dedicated authentication workflows.

```text
                                                            Registration
                                                                │
                                                                ▼
                                                        Create User Account
                                                                │
                                                                ▼
                                                        Email Verification
                                                                │
                                                        ┌───────┴───────┐
                                                        │               │
                                                    Invalid          Valid
                                                        │               │
                                                        ▼               ▼
                                                Reject Access    Activate Account
                                                                        │
                                                                        ▼
                                                                    Login
                                                                        │
                                                                        ▼
                                                                Authenticated Session
                                                                        │
                                                                        ▼
                                                                Access Protected Areas
```

Users can also recover their accounts through Django's password-reset workflow using secure, time-limited tokens.

---

## Conversation Management Workflow

SmartBot provides conversation management directly from the sidebar without requiring unnecessary page reloads.

```text
                                                      Conversation
                                                           │
                                            ┌──────────────┼──────────────┐
                                            │              │              │
                                            ▼              ▼              ▼
                                         Rename         Search         Delete
                                            │              │              │
                                            ▼              ▼              ▼
                                          Validate       Filter        Confirm
                                            │              │              │
                                            ▼              │              ▼
                                        AJAX Update        │          AJAX Delete
                                            │              │              │
                                            └──────────────┼──────────────┘
                                                           ▼
                                                    Update Sidebar
```

Ownership checks are performed on protected conversation operations so that users can only modify conversations belonging to their own account.

---

## Frontend Rendering Pipeline

AI responses are returned to the browser as structured JSON rather than rendered server-side as complete HTML pages.

The frontend then processes the response through the presentation layer:

```text
                                                        AI Response
                                                            │
                                                            ▼
                                                        JSON Response
                                                            │
                                                            ▼
                                                        JavaScript
                                                            │
                                                            ▼
                                                        Markdown Parser
                                                            │
                                                            ▼
                                                        HTML Rendering
                                                            │
                                                            ▼
                                                        Syntax Highlighting
                                                            │
                                                            ▼
                                                        Code Block Enhancement
                                                            │
                                                            ▼
                                                        Chat Interface
```

This approach allows the interface to update individual components dynamically while keeping the server responsible for data and application state.
