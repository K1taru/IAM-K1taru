---
title: "CookEat"
domain: applications
map:
  position: [620, 455]
summary: "A recipe-sharing app I helped build for people to document and share culinary traditions."
problem: "Recipe posts are easier to use when the ingredients and instructions are easy to find. A general social feed doesn’t give that information much structure."
role: "Frontend lead, version control, and DevOps"
team: "Collaborative project credited to jaygarciaaa and K1taru"
contributions:
  - "Led frontend work and handled version control and DevOps for our recipe-sharing app."
  - "Worked on a React frontend backed by a Node.js API and PostgreSQL."
  - "Worked on a way to host it on a Raspberry Pi with Cloudflare Tunnel."
skills: ["React", "Node.js", "Express", "PostgreSQL", "REST APIs", "Raspberry Pi"]
repository: "https://github.com/K1taru/CookEat"
draft: false
year: 2025
evidence:
  - label: "Product type"
    value: "Culinary social network"
  - label: "Deployment target"
    value: "Raspberry Pi 4"
metrics: []
gallery:
  - {"src":"/media/projects/cookeat/login.webp","alt":"CookEat login screen with email and password fields","width":1152,"height":707}
  - {"src":"/media/projects/cookeat/registration.webp","alt":"CookEat account registration screen","width":954,"height":649}
  - {"src":"/media/projects/cookeat/help-center.webp","alt":"CookEat help and support page with account and posting guides","width":1907,"height":917}
  - {"src":"/media/projects/cookeat/feed-loading.webp","alt":"CookEat recipe feed while posts are loading","width":1920,"height":893}
  - {"src":"/media/projects/cookeat/recipe-post.webp","alt":"CookEat recipe post with a Filipino pares dish, ingredients, and cooking instructions","width":871,"height":883}
preview: {"src":"/media/projects/cookeat/login.webp","alt":"CookEat login screen with email and password fields","caption":"CookEat login"}
architecture: ["React client", "Express REST API", "PostgreSQL data", "Raspberry Pi deployment"]
security:
  - "Administrative operations are documented as server-side tasks rather than a public web-admin surface."
outcomes:
  - "We built the recipe-sharing app from the interface through the API and database, with a plan for hosting it on a Pi."
lessons:
  - "Decide early who can change or remove a post and which admin tasks should stay on the server."
---
