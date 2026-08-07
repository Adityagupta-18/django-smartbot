# SmartBot

<div align="center">

**A modern AI Assistant SaaS application built with Django, powered by Groq and Meta Llama models, following production-oriented software engineering practices.**

![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge\&logo=python)
![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge\&logo=django)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Groq](https://img.shields.io/badge/AI-Groq-orange?style=for-the-badge)
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
             ┌───────────────────┴───────────────────┐
             │                                       │
             ▼                                       ▼
 ┌──────────────────────────┐           ┌───────────────────────────┐
 │      SQLite Database     │           │      Groq API             │
 │                          │           │                           │
 │ Conversations            │           │ Meta Llama Models         │
 │ Messages                 │           │ Prompt Engineering        │
 │ Users                    │           │ Title Generation          │
 │ Conversation Summaries   │           │ Conversation Summaries    │
 └──────────────────────────┘           └───────────────────────────┘
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
