---
title: "MDSystem"
domain: applications
map:
  position: [438, 238]
  connections: [moskita, gymms, ayudirect]
summary: "A digital records system for the medical and dental clinics at T.I.P.’s Manila and Quezon City campuses."
problem: "Students had to fill out forms and update their records as part of the clinic visit. The team wanted to move that paperwork online so clinic time could go toward the tests that needed to be done in person."
role: "Frontend lead, version control, and DevOps"
team: "Cyber-Six collaborative project"
contributions:
  - "Led frontend work and handled version control and DevOps for the Cyber-Six team."
  - "Worked on MDS-Chatbot as a full-stack and AI integration developer."
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
preview: {"src":"/media/projects/mdsystem/preview.webp","alt":"MDSystem role editor with permission toggles for patient search","caption":"Role permissions · application screenshot"}
architecture: ["React and Expo clients", "GraphQL and Node.js services", "PostgreSQL and Redis", "Real-time communication and exports"]
security:
  - "Repository-documented RBAC, OAuth, two-factor authentication, consent flows, and rate limiting."
  - "The chatbot is presented as a scoped subsystem rather than an authority for medical decisions."
outcomes:
  - "Students can complete forms and update their records online. Clinic staff can review and validate them before the in-person tests."
lessons:
  - "When several apps share the same services, it helps to make permissions and real-time updates explicit."
---

## Working in a shared codebase

I worked on MDSystem with Cyber-Six. The portals and mobile app share a service layer, so the interfaces had to fit the same rules around access and data. The chatbot is a separate service within the larger project.
