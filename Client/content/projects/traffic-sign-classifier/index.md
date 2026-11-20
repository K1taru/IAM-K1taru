---
title: "Traffic Sign Classifier"
slug: "traffic-sign-classifier"
summary: "A PyTorch project that trains and evaluates models on the German Traffic Sign Recognition Benchmark (GTSRB)."
problem: "Many traffic signs look alike, and some classes have fewer examples than others. I wanted a repeatable way to compare models under those conditions."
role: "ML engineer and repository maintainer"
team: "Independently maintained K1taru project"
contributions:
  - "Fine-tuned ResNet50 and EfficientNet-B3 in PyTorch."
  - "Added cropping, augmentation, class-imbalance handling, checkpoints, and several evaluation metrics."
  - "Documented how to repeat training and run inference on GTSRB images."
skills: ["Python", "PyTorch", "ResNet50", "EfficientNet", "Transfer learning", "Jupyter"]
repository: "https://github.com/K1taru/Traffic-Sign-Classifier"
draft: false
year: 2025
evidence:
  - label: "Dataset"
    value: "German Traffic Sign Recognition Benchmark"
  - label: "Architectures"
    value: "ResNet50 and EfficientNet-B3"
metrics:
  - value: "95–99%"
    label: "reported validation accuracy range"
    qualifier: "Repository-reported; varies by architecture and run"
gallery: []
architecture: ["GTSRB images", "ROI and augmentation pipeline", "Transfer-learned classifier", "Evaluation and inference"]
security:
  - "The public portfolio links to the repository and does not expose a server-side image-upload or inference endpoint."
outcomes:
  - "The repository includes a repeatable training and evaluation workflow, two model options, and saved checkpoints."
lessons:
  - "I check which classes a model misses and how the run was set up before comparing accuracy numbers."
---

## Comparing the runs

The repository records how images were cropped and augmented and how class imbalance was handled. That context helps explain why accuracy can vary between runs.
