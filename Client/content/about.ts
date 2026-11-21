type Milestone = {
  year: number
  summary: (string | { slug: string; label: string })[]
}

export const about = {
  intro: 'I’ve led frontend work on team projects and built full-stack apps, AI assistants, and computer vision tools.',
  homeOverview: [
    'I study computer engineering at T.I.P. Manila, where I specialize in data science. I’m especially interested in what a small device can do with a camera and a trained model.',
    'Outside the lab, I served as our department’s student council treasurer. At the Grundfos Data & AI Inclusion Hackathon, I worked on the interface and document search for our team’s assistant, MARIO.',
  ],
  interests: 'I’m interested in computer vision, edge AI, embedded systems, and competitive robotics. I like working on projects that bring software and hardware together.',
}

export const milestones: Milestone[] = [
  {
    year: 2026,
    summary: [
      'Led frontend work on ',
      { slug: 'mdsystem', label: 'MDSystem' },
      ', researched and developed ',
      { slug: 'moskita', label: 'MosKita' },
      ', and built ',
      { slug: 'pi-monitor', label: 'Pi Monitor' },
      '. I also worked on the frontend and document retrieval for MARIO at the Grundfos Data & AI Inclusion Hackathon.',
    ],
  },
  {
    year: 2025,
    summary: [
      'Built ',
      { slug: 'gymms', label: 'GyMMS' },
      ' for a gym client, led frontend work on ',
      { slug: 'cookeat', label: 'CookEat' },
      ', and wrote smart contracts for ',
      { slug: 'growquest', label: 'GrowQuest' },
      '.',
    ],
  },
]

export const leadership = [
  { title: 'Treasurer, UGNAY', details: 'T.I.P. Manila Career Center, 2026–present' },
  { title: 'Event host, Co-Work, Co-Exist', details: 'T.I.P. Manila Career Center with Alliance Software, October 2026' },
  { title: 'Treasurer, Computer Engineering Department Student Council', details: 'T.I.P. Manila, academic year 2024–2025' },
]
