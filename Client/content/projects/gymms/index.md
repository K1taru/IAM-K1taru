---
title: "GyMMS"
domain: applications
map:
  position: [678, 145]
  connections: [pi-monitor]
summary: "A Django app I built for a gym client to manage renewals, payments, and member check-ins."
problem: "A small gym needs to know who can check in, which payments have cleared, and which memberships are due for renewal. It’s easy to miss something when those records are kept apart."
role: "Full-stack developer"
team: "K1taru-maintained project"
contributions:
  - "Built membership renewals, QR and online payments, member check-ins, and reporting in Django."
  - "Packaged the app in Docker and documented how to run it on a Raspberry Pi."
  - "Used PostgreSQL for the records behind the reports and analytics."
skills: ["Django", "PostgreSQL", "JavaScript", "Docker", "Cloudflare Tunnel", "Raspberry Pi"]
repository: "https://github.com/K1taru/GyMMS"
draft: false
year: 2025
evidence:
  - label: "Deployment"
    value: "Docker Compose on Raspberry Pi 5"
  - label: "Operational scope"
    value: "Membership renewals, QR and online payments, member check-ins, and reporting"
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
