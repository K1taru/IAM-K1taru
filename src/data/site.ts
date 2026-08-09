export const site = {
  name: 'John Michael Garcia',
  handle: 'K1taru',
  degree: 'Computer Engineering, specializing in Data Science',
  school: 'Technological Institute of the Philippines',
  location: 'Philippines',
  primaryRole: 'Applied ML Engineer',
  roleTargets: [
    'Applied ML Engineer Intern',
    'Machine Learning Engineer Intern',
    'Data Scientist Intern',
    'Software Engineer — AI/ML'
  ],
  positioning:
    'I build and self-host full-stack and machine-learning systems—from edge computer vision to secure operational platforms.',
  email: import.meta.env.CONTACT_EMAIL || 'jmgarcia.main@gmail.com',
  github: 'https://github.com/K1taru',
  linkedin: 'https://ph.linkedin.com/in/jmgarcia-main',
  url: import.meta.env.SITE_URL || 'https://k1taru.github.io/IAM-K1taru',
  repository: 'https://github.com/K1taru/IAM-K1taru'
} as const;

export const skillGroups = [
  {
    label: 'Applied machine learning',
    description: 'Computer vision, deep learning, model evaluation, dataset preparation, and edge inference.',
    skills: ['Python', 'PyTorch', 'YOLO', 'ONNX', 'Jupyter']
  },
  {
    label: 'Product engineering',
    description: 'Web and mobile systems built around practical workflows, data, and measurable user needs.',
    skills: ['TypeScript', 'JavaScript', 'React', 'Django', 'Node.js', 'GraphQL']
  },
  {
    label: 'Data and infrastructure',
    description: 'Reliable persistence, deployment, monitoring, and secure access on resource-conscious hardware.',
    skills: ['PostgreSQL', 'Redis', 'Docker', 'Linux', 'Raspberry Pi', 'Cloudflare']
  }
] as const;

export interface Certification {
  title: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
}

// Add verified certifications here. The portfolio renders the preview entries
// below until this array contains real certification data.
export const certifications: Certification[] = [];

export const certificationTemplate: Certification[] = [
  {
    title: 'Certification title',
    issuer: 'Issuing organization',
    issued: 'Month YYYY',
    credentialId: 'Credential ID (optional)',
    skills: ['Primary skill', 'Supporting skill']
  },
  {
    title: 'Certification title',
    issuer: 'Issuing organization',
    issued: 'Month YYYY',
    credentialId: 'Credential ID (optional)',
    skills: ['Core competency', 'Platform or tool']
  },
  {
    title: 'Certification title',
    issuer: 'Issuing organization',
    issued: 'Month YYYY',
    credentialId: 'Credential ID (optional)',
    skills: ['Technical area', 'Applied practice']
  }
];
