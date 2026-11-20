---
title: "GyMMS"
slug: "gymms"
summary: "A Django app I built to track gym memberships, payments, and check-ins on a Raspberry Pi."
problem: "A small gym needs to know who can check in, which payments have cleared, and which memberships are due for renewal. It’s easy to miss something when those records are kept apart."
role: "Repository maintainer and full-stack developer"
team: "K1taru-maintained project"
contributions:
  - "Built the membership, payment, check-in, and reporting workflows in Django."
  - "Packaged the app in Docker and documented how to run it on a Raspberry Pi."
  - "Used PostgreSQL for the records behind the reports and analytics."
skills: ["Django", "PostgreSQL", "JavaScript", "Docker", "Cloudflare Tunnel", "Raspberry Pi"]
repository: "https://github.com/K1taru/GyMMS"
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
  - "The app brings memberships, payments, attendance, and reports into one place and runs on a Raspberry Pi 5."
lessons:
  - "Clear staff permissions, dependable records, and setup instructions matter as much as the screens people use."
---

## Running it on a Pi

I used Docker Compose to run the Django app and PostgreSQL together. Cloudflare Tunnel gives the deployment a way in without opening a service port on the Pi.
