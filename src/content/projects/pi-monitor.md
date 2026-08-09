---
title: "Pi Monitor"
slug: "pi-monitor"
summary: "A real-time Raspberry Pi system dashboard for observing hardware and service health through a secured remote interface."
problem: "Self-hosted applications need simple operational visibility, but exposing a server-management surface creates meaningful authentication and network risk."
role: "Developer and self-hosting operator"
team: "Independently maintained K1taru project"
contributions:
  - "Built a real-time system-monitoring dashboard for Raspberry Pi."
  - "Designed a protected interface around authentication, live metrics, and remote operational visibility."
  - "Deployed and maintained the dashboard behind Cloudflare-managed ingress."
skills: ["JavaScript", "Linux", "System monitoring", "Raspberry Pi", "Cloudflare", "Authentication"]
repository: "https://github.com/K1taru/pi-monitor"
demo: "https://raspy.k1taru.space/"
featured: true
draft: false
year: 2026
evidence:
  - label: "Observed system"
    value: "Self-hosted Raspberry Pi services"
  - label: "Interface"
    value: "Real-time web dashboard"
metrics: []
gallery: []
architecture: ["Linux system metrics", "Monitoring service", "Authenticated dashboard", "Cloudflare-proxied access"]
security:
  - "The portfolio links only to the login surface and never exposes credentials, telemetry, private addresses, or control endpoints."
  - "Operational access remains isolated from the public portfolio application."
outcomes:
  - "Created a dedicated operational view for the same self-hosted environment used to publish portfolio projects."
lessons:
  - "A monitoring interface must reveal enough to operate a system without turning internal telemetry into public information."
---

## Infrastructure as a project

Pi Monitor makes the hosting environment visible as engineering work. Its visual system also inspired this portfolio’s navy, cyan, green, and grid-based design language.

