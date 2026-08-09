---
title: "MDSystem"
slug: "mdsystem"
summary: "An integrated medical and dental platform connecting staff and patient web portals, an Expo mobile app, records workflows, communication, inventory, and analytics."
problem: "Medical and dental operations often split appointments, records, inventory, communication, and reporting across disconnected tools, creating duplicated work and inconsistent access controls."
role: "Team contributor"
team: "Cyber-Six collaborative project"
contributions:
  - "Contributed within a shared codebase spanning staff, patient, mobile, and service-layer experiences."
  - "Helped develop an integrated workflow rather than presenting the chatbot or portals as isolated demonstrations."
skills: ["React", "React Native", "Node.js", "GraphQL", "PostgreSQL", "Redis", "Socket.IO"]
repository: "https://github.com/Cyber-Six/MDSystem"
demo: "https://www.mdsystemtip.space/"
featured: true
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
  - "Unified a broad set of healthcare-adjacent operational workflows into one team-maintained platform."
lessons:
  - "Large product surfaces need shared packages, explicit capability boundaries, and carefully scoped real-time behavior."
---

## A connected operational platform

MDSystem is the broadest team system in this portfolio. It brings together patient-facing and staff-facing experiences with a mobile application, data services, notifications, records, inventory, and exports.

The case study deliberately describes the shared system and John’s team participation conservatively. More granular ownership will be added only when it can be attributed precisely.

## MDS-Chatbot as a subsystem

The related chatbot repository is shown here because its value comes from its connection to MDSystem. Its documented design uses a separate Node.js service and local LLaMA runtime, with patient and staff routes separated behind backend-validated identity context.

