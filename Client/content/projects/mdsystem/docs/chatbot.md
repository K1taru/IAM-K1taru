---
title: "MDS-Chatbot subsystem"
---

The chatbot is one part of MDSystem. It runs as a separate Node.js service and uses a local LLaMA runtime.

Patient and staff requests take different routes. The backend checks the caller’s identity before sending the request along the appropriate route.
