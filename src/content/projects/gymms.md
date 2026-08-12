---
title: "GyMMS"
slug: "gymms"
summary: "A gym membership management system for member records, payments, attendance, reporting, and operational analytics, deployed on a Raspberry Pi."
problem: "Small gym operations can lose time and accuracy when membership status, renewals, payments, check-ins, and reports are maintained through disconnected manual records."
role: "Repository maintainer and full-stack developer"
team: "K1taru-maintained project"
contributions:
  - "Built membership, payment, check-in, reporting, and role-aware operational workflows with Django."
  - "Containerized the application and documented a small self-hosted deployment model."
  - "Structured the system around PostgreSQL-backed records and operational analytics."
skills: ["Django", "PostgreSQL", "JavaScript", "Docker", "Cloudflare Tunnel", "Raspberry Pi"]
repository: "https://github.com/K1taru/GyMMS"
featured: true
draft: false
year: 2026
evidence:
  - label: "Deployment"
    value: "Docker Compose on Raspberry Pi 5"
  - label: "Operational scope"
    value: "Memberships, payments, check-ins, reports, and analytics"
metrics: []
gallery: []
architecture: ["Django application", "PostgreSQL database", "Docker Compose services", "Cloudflare Tunnel ingress"]
security:
  - "Role-based owner and staff access is documented in the project."
  - "The deployment avoids directly exposing a local service port."
outcomes:
  - "Combined core gym operations into a self-hosted management workflow designed for a small deployment footprint."
lessons:
  - "Operational software needs clear permissions, dependable records, and deployment documentation—not only feature breadth."
---

## A practical self-hosted operations system

GyMMS demonstrates the product and infrastructure sides of John’s work. The application models real membership operations while the deployment uses hardware he can own, observe, and maintain directly.
