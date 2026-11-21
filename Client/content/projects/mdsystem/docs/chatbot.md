---
title: "MDS-Chatbot subsystem"
---

The chatbot is one part of MDSystem. It runs as a separate Node.js service and uses a local LLaMA runtime.

I worked on the chatbot as a full-stack and AI integration developer. It answers users’ questions and hands the conversation to clinic staff when they need to take over. The model runs on local infrastructure so clinic data can stay in-house.

Patient and staff requests take different routes. The backend checks the caller’s identity before sending the request to the appropriate route.
