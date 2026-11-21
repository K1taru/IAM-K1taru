import { statSync } from 'node:fs'
import path from 'node:path'

export function getCertificateImage(slug: string) {
  const file = `/media/certifications/${slug}.webp`
  return statSync(path.join(process.cwd(), 'public', file), { throwIfNoEntry: false })?.isFile() ? file : undefined
}

type Credential = {
  slug: string
  title: string
  issuer: string
  date: string
}

type CredentialGroup = {
  id: string
  title: string
  credentials: Credential[]
}

const tip = 'Technological Institute of the Philippines'
const netacad = 'Cisco Networking Academy and T.I.P. Manila'

export const credentialGroups: CredentialGroup[] = [
  {
    id: 'training',
    title: 'Technical training',
    credentials: [
      {
        slug: 'django-ecommerce',
        title: 'Python Django: Build a Complex Multivendor Ecommerce System',
        issuer: 'Udemy',
        date: 'July 12, 2026',
      },
      {
        slug: 'full-stack-web-development',
        title: 'The Complete Full-Stack Web Development Bootcamp',
        issuer: 'Udemy',
        date: 'July 6, 2026',
      },
      {
        slug: 'ccna-switching-routing-wireless',
        title: 'CCNA: Switching, Routing, and Wireless Essentials',
        issuer: netacad,
        date: 'December 12, 2025',
      },
      {
        slug: 'ccna-introduction-to-networks',
        title: 'CCNA: Introduction to Networks',
        issuer: netacad,
        date: 'August 5, 2025',
      },
      {
        slug: 'python-development-essentials',
        title: 'Python Development Essentials',
        issuer: 'Udemy',
        date: 'June 1, 2025',
      },
    ],
  },
  {
    id: 'language',
    title: 'Language proficiency',
    credentials: [
      {
        slug: 'ef-set',
        title: 'EF SET English Certificate (C2 Proficient, 85/100)',
        issuer: 'EF SET',
        date: 'November 2026',
      },
    ],
  },
  {
    id: 'recognition',
    title: 'Academic recognition and leadership',
    credentials: [
      {
        slug: 'deans-list-2025-2026',
        title: 'Dean’s List, First Semester 2025–2026',
        issuer: tip,
        date: 'March 2026',
      },
      {
        slug: 'student-council-treasurer',
        title: 'Student Council Treasurer, Certificate of Appreciation',
        issuer: 'T.I.P. Manila Computer Engineering Department Student Council',
        date: 'October 2025',
      },
      {
        slug: 'deans-list-2024-2025',
        title: 'Dean’s List, Second Semester 2024–2025',
        issuer: tip,
        date: 'October 2025',
      },
      {
        slug: 'gawad-tip-leadership',
        title: 'Gawad T.I.P. Recognition for Student Council Leadership',
        issuer: tip,
        date: 'May 2025',
      },
      {
        slug: 'coess-membership',
        title: 'Computer Engineering Student Society Membership',
        issuer: 'Computer Engineering Student Society',
        date: 'October 2024',
      },
      {
        slug: 'leadership-convergence',
        title: 'Leadership Convergence 2024',
        issuer: 'T.I.P. Student Affairs and Services',
        date: 'October 2024',
      },
    ],
  },
  {
    id: 'participation',
    title: 'Events and community',
    credentials: [
      {
        slug: 'co-work-co-exist',
        title: 'Co-Work, Co-Exist: Dealing with Our Colleagues in the Workplace',
        issuer: 'T.I.P. Career Center and Alliance Software',
        date: 'October 14, 2026',
      },
      {
        slug: 'one-commerce-career-session',
        title: 'ONE-dering What’s Next? Let’s Talk Careers!',
        issuer: 'T.I.P. Career Center and One Commerce',
        date: 'October 8, 2026',
      },
      {
        slug: 'vxi-career-session',
        title: 'The Professional Edge: Ethics, Resilience, and Accountability in Action',
        issuer: 'T.I.P. Career Center and VXI Global Solutions',
        date: 'September 30, 2026',
      },
      {
        slug: 'robotics-skills-competition',
        title: 'Robotics Skills Competition',
        issuer: 'Mechatronics and Robotics Society of the Philippines',
        date: 'June 2026',
      },
      {
        slug: 'data-ai-inclusion-hackathon',
        title: 'Data & AI Inclusion Hackathon 2026',
        issuer: 'Grundfos and T.I.P. TechnoCoRe',
        date: 'February 2026',
      },
      {
        slug: 'community-outreach',
        title: 'Community Outreach Project',
        issuer: 'T.I.P. Manila, Civic Welfare Training Service',
        date: 'May 2024',
      },
      {
        slug: 'blockchain-campus-conference',
        title: 'Blockchain Campus Conference 2023',
        issuer: 'Blockchain Campus Conference',
        date: 'November 2023',
      },
    ],
  },
]
