---
title: "Raspy Monitor"
domain: infrastructure
map:
  position: [742, 350]
  connections: [cookeat]
summary: "A live dashboard I built to monitor and manage the Raspberry Pi that runs my self-hosted services."
problem: "I needed a quick way to check my Pi and its services remotely while keeping access to the dashboard private."
role: "Full-stack developer"
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
gallery:
  - {"src":"/media/projects/raspy-monitor/login.webp","alt":"Raspy Monitor login screen with secure access, real-time monitoring, and remote control features","width":1920,"height":1080}
  - {"src":"/media/projects/raspy-monitor/overview.webp","alt":"Raspy Monitor overview showing Raspberry Pi uptime, CPU, memory, disk, and network metrics","width":1920,"height":1080}
  - {"src":"/media/projects/raspy-monitor/charts.webp","alt":"Raspy Monitor performance chart showing CPU usage over a 24-hour period","width":1920,"height":1080}
  - {"src":"/media/projects/raspy-monitor/processes.webp","alt":"Raspy Monitor process view listing active services and their resource usage","width":1920,"height":1080}
  - {"src":"/media/projects/raspy-monitor/cpu-governor.webp","alt":"Raspy Monitor CPU control view with selectable performance governors","width":1920,"height":1080}
  - {"src":"/media/projects/raspy-monitor/fan-control.webp","alt":"Raspy Monitor fan control view with speed modes and a temperature curve","width":1920,"height":1080}
preview: {"src":"/media/projects/raspy-monitor/login.webp","alt":"Raspy Monitor login screen with secure access, real-time monitoring, and remote control features","caption":"Raspy Monitor login"}
architecture: ["Linux system metrics", "Monitoring service", "Authenticated dashboard", "Cloudflare-proxied access"]
security:
  - "Dashboard access requires a login. Internal metrics and controls stay behind that boundary."
  - "I keep access to the monitoring service separate from the public portfolio."
outcomes:
  - "I can check the health of the Pi that hosts my projects from one dashboard."
lessons:
  - "A dashboard is useful when it shows what I need to operate the machine and keeps that information private."
---
