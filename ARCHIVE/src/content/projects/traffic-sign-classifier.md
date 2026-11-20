---
title: "Traffic Sign Classifier"
slug: "traffic-sign-classifier"
summary: "A PyTorch image-classification workflow for the GTSRB dataset with transfer learning, class balancing, augmentation, and reproducible model evaluation."
problem: "Traffic-sign recognition must handle many visually similar classes, imbalanced examples, varying image quality, and the need for reliable evaluation before deployment."
role: "ML engineer and repository maintainer"
team: "Independently maintained K1taru project"
contributions:
  - "Implemented ResNet50 and EfficientNet-B3 transfer-learning workflows in PyTorch."
  - "Added region-of-interest cropping, data augmentation, class-imbalance handling, checkpointing, and multi-metric tracking."
  - "Documented reproducible training and inference workflows for the GTSRB dataset."
skills: ["Python", "PyTorch", "ResNet50", "EfficientNet", "Transfer learning", "Jupyter"]
repository: "https://github.com/K1taru/Traffic-Sign-Classifier"
featured: true
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
  - "Created a reusable training and evaluation workflow with documented model alternatives and saved checkpoints."
lessons:
  - "Evaluation context, class balance, and reproducibility are essential when accuracy figures are used to compare models."
---

## Evaluation is part of the model

This project focuses on more than choosing a neural-network architecture. It documents preprocessing, augmentation, class imbalance, checkpoint management, and multiple metrics so that reported performance has an understandable training context.

