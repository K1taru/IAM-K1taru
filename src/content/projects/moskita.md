---
title: "MosKita"
slug: "moskita"
summary: "An edge-computer-vision system that identifies potential dengue mosquito breeding containers from images and live camera feeds."
problem: "Manual inspection for dengue breeding sites is time-intensive and difficult to scale, especially when teams need to survey many containers across local environments."
role: "Developer and ML engineer"
team: "Independently maintained K1taru project"
contributions:
  - "Curated and organized a local image dataset for breeding-container detection."
  - "Built a YOLO-based training workflow and a browser inference experience using an exported ONNX model."
  - "Targeted the deployment for Raspberry Pi 5 and camera-assisted edge use."
skills: ["Python", "YOLO", "ONNX", "Computer vision", "React", "Raspberry Pi"]
repository: "https://github.com/K1taru/MosKita"
featured: true
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
gallery: []
architecture: ["Curated and external datasets", "YOLO training pipeline", "ONNX model export", "Browser and Raspberry Pi inference"]
security:
  - "Inference accepts sample or visitor-selected media in the browser without adding a public portfolio upload endpoint."
outcomes:
  - "Produced a working path from local dataset curation to a browser-based, edge-oriented inference experience."
lessons:
  - "Class coverage and representative local data matter as much as architecture choice in practical computer-vision systems."
---

## From local data to edge inference

MosKita connects the full applied-ML loop: gathering and organizing local examples, training an object detector, exporting it, and designing an inference surface that can run close to the camera.

The project’s focus is not a claim that automation replaces public-health professionals. It is an exploration of how low-cost edge systems could help prioritize inspection work.
