---
title: "Pi Monitor"
slug: "pi-monitor"
summary: "A live dashboard I use to check the Raspberry Pi that runs my self-hosted services."
problem: "I needed a quick way to check my Pi and its services remotely while keeping access to the dashboard private."
role: "Developer and self-hosting operator"
team: "Independently maintained K1taru project"
contributions:
  - "Built a web dashboard that shows live system metrics from the Pi."
  - "Put the dashboard behind a login so I could check it remotely."
  - "Ran it behind a managed proxy and maintained it alongside my other services."
skills: ["JavaScript", "Linux", "System monitoring", "Raspberry Pi", "Cloudflare", "Authentication"]
repository: "https://github.com/K1taru/pi-monitor"
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
  - "Dashboard access requires a login. Internal metrics and controls stay behind that boundary."
  - "I keep access to the monitoring service separate from the public portfolio."
outcomes:
  - "I can check the health of the Pi that hosts my projects from one dashboard."
lessons:
  - "A dashboard is useful when it shows what I need to operate the machine and keeps that information private."
---
