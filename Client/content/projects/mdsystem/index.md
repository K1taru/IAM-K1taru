---
title: "MDSystem"
slug: "mdsystem"
summary: "A team project for medical and dental clinics, with web portals for staff and patients and a mobile app."
problem: "When appointments, records, inventory, and messages live in separate tools, clinic staff have more places to check and more sets of permissions to manage."
role: "Team contributor"
team: "Cyber-Six collaborative project"
contributions:
  - "Contributed to the shared codebase for staff and patient portals, the mobile app, and the services behind them."
  - "Helped connect the portals and chatbot to the wider clinic workflow."
skills: ["React", "React Native", "Node.js", "GraphQL", "PostgreSQL", "Redis", "Socket.IO"]
repository: "https://github.com/Cyber-Six/MDSystem"
draft: false
year: 2026
evidence:
  - label: "Surfaces"
    value: "Staff web, patient web, and Expo mobile"
  - label: "Connected subsystem"
    value: "Safety-oriented MDS-Chatbot service"
metrics: []
gallery: []
architecture: ["React and Expo clients", "GraphQL and Node.js services", "PostgreSQL and Redis", "Real-time communication and exports"]
security:
  - "Repository-documented RBAC, OAuth, two-factor authentication, consent flows, and rate limiting."
  - "The chatbot is presented as a scoped subsystem rather than an authority for medical decisions."
outcomes:
  - "Our team brought records, communication, inventory, and reporting together in one platform."
lessons:
  - "When several apps share the same services, it helps to make permissions and real-time updates explicit."
---

## Working in a shared codebase

I worked on MDSystem with Cyber-Six. The portals and mobile app share a service layer, so the interfaces had to fit the same rules around access and data. The chatbot is a separate service within the larger project.
