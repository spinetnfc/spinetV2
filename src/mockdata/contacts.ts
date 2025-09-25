import { Contact } from '@/types/contact';

export const mockContacts: Contact[] = [
  {
    _id: 'contact-1',
    name: 'John Doe',
    description: 'Tech entrepreneur and startup founder',
    type: 'manual',
    Profile: {
      _id: 'profile-1',
      fullName: 'John Doe',
      companyName: 'TechStart Inc.',
      position: 'CEO & Founder',
      links: [
        { title: 'LinkedIn', link: 'https://linkedin.com/in/johndoe' },
        { title: 'Twitter', link: 'https://twitter.com/johndoe' },
      ],
    },
    leadCaptions: {
      metIn: 'Tech Conference 2024',
      tags: ['entrepreneur', 'tech', 'startup'],
      nextAction: 'Follow up on partnership proposal',
      dateOfNextAction: '2024-12-20',
      notes: 'Very interested in our SaaS platform. Potential major client.',
    },
  },
  {
    _id: 'contact-2',
    name: 'Sarah Wilson',
    description: 'Marketing director at a Fortune 500 company',
    type: 'exchange',
    Profile: {
      _id: 'profile-2',
      fullName: 'Sarah Wilson',
      companyName: 'Global Corp',
      position: 'Marketing Director',
      links: [
        { title: 'LinkedIn', link: 'https://linkedin.com/in/sarahwilson' },
        { title: 'Company Website', link: 'https://globalcorp.com' },
      ],
    },
    leadCaptions: {
      metIn: 'Marketing Summit',
      tags: ['marketing', 'enterprise', 'b2b'],
      nextAction: 'Schedule demo call',
      dateOfNextAction: '2024-12-18',
      notes: 'Looking for marketing automation tools. Budget approved for Q1.',
    },
  },
  {
    _id: 'contact-3',
    name: 'Ahmed Hassan',
    description: 'Software developer and consultant',
    type: 'scan',
    Profile: {
      _id: 'profile-3',
      fullName: 'Ahmed Hassan',
      companyName: 'DevConsult',
      position: 'Senior Developer',
      links: [
        { title: 'GitHub', link: 'https://github.com/ahmedhassan' },
        { title: 'Portfolio', link: 'https://ahmedhassan.dev' },
      ],
    },
    leadCaptions: {
      metIn: 'Developer Meetup',
      tags: ['developer', 'consultant', 'javascript'],
      nextAction: 'Discuss collaboration opportunities',
      dateOfNextAction: '2024-12-22',
      notes: 'Expert in React and Node.js. Could be a great technical partner.',
    },
  },
  {
    _id: 'contact-4',
    name: 'Marie Dubois',
    description: 'Business development manager',
    type: 'spinet',
    Profile: {
      _id: 'profile-4',
      fullName: 'Marie Dubois',
      companyName: 'Innovation Hub',
      position: 'Business Development Manager',
      links: [
        { title: 'LinkedIn', link: 'https://linkedin.com/in/mariedubois' },
        { title: 'Email', link: 'mailto:marie@innovationhub.fr' },
      ],
    },
    leadCaptions: {
      metIn: 'Business Network Event',
      tags: ['business-development', 'partnership', 'innovation'],
      nextAction: 'Send partnership proposal',
      dateOfNextAction: '2024-12-25',
      notes:
        'Interested in strategic partnerships. Very well connected in the industry.',
    },
  },
];
