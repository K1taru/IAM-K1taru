---
title: "MosKita"
domain: machine-learning
map:
  position: [205, 125]
  connections: [traffic-sign-classifier, raspy-monitor]
summary: "A computer vision project that flags containers where dengue mosquitoes could breed, using photos and live camera feeds."
problem: "Checking containers one by one takes time. I wanted to see whether a low-cost camera could help people decide where to look first."
role: "Researcher, full-stack developer, and ML developer"
team: "Independently maintained K1taru project"
contributions:
  - "Collected and organized local images of containers for the training dataset."
  - "Set up YOLO training, exported the model to ONNX, and built a browser interface that runs it."
  - "Designed the setup for a Raspberry Pi 5 with a camera module."
  - "Wrote chapters of the research paper and the guide for collecting and labeling training images."
  - "Reviewed more than 30 existing patents as part of the research."
skills: ["Python", "YOLO", "ONNX", "Computer vision", "React", "Raspberry Pi"]
repository: "https://github.com/K1taru/MosKita"
draft: false
year: 2026
evidence:
  - label: "Local dataset"
    value: "1,245 curated images and 1,725 annotations documented in the repository"
  - label: "Edge target"
    value: "Raspberry Pi 5 with camera module"
metrics:
  - value: "8"
    label: "documented detection classes"
    qualifier: "Repository-defined V1 scope"
gallery:
  - {"src":"/media/projects/moskita/moskita.webp","alt":"MosKita browser dashboard for running mosquito breeding-site detection","width":816,"height":416}
preview: {"src":"/media/projects/moskita/moskita.webp","alt":"MosKita browser dashboard for running mosquito breeding-site detection","caption":"MosKita inference dashboard"}
architecture: ["Curated and external datasets", "YOLO training pipeline", "ONNX model export", "Browser and Raspberry Pi inference"]
security:
  - "Inference accepts sample or visitor-selected media in the browser without adding a public portfolio upload endpoint."
outcomes:
  - "I built a workflow that takes locally collected images through model training and runs the exported detector in the browser."
lessons:
  - "It matters which containers and local conditions show up in the training data. A model can only learn from the examples it sees."
---

## What the camera can help with

The detector flags containers for follow-up. A person still needs to inspect the container to confirm whether it’s a breeding site.
