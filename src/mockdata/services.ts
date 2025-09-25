import { Service, ServicesData } from '@/types/services';

export const mockServices: Service[] = [
  {
    _id: 'service-1',
    name: 'Web Development',
    description:
      'Full-stack web development using modern technologies like React, Node.js, and cloud platforms',
  },
  {
    _id: 'service-2',
    name: 'Mobile App Development',
    description:
      'Native and cross-platform mobile app development for iOS and Android',
  },
  {
    _id: 'service-3',
    name: 'Digital Marketing',
    description:
      'Complete digital marketing solutions including SEO, social media, and content marketing',
  },
  {
    _id: 'service-4',
    name: 'UI/UX Design',
    description:
      'User interface and user experience design for web and mobile applications',
  },
  {
    _id: 'service-5',
    name: 'Business Consulting',
    description:
      'Strategic business consulting and digital transformation guidance',
  },
];

export const mockServicesData: ServicesData[] = [
  {
    name: 'Web Development',
    description: 'Full-stack web development using modern technologies',
    Profile: {
      _id: 'profile-1',
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: '',
      numServices: 3,
    },
  },
  {
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile app development',
    Profile: {
      _id: 'profile-2',
      firstName: 'Sarah',
      lastName: 'Wilson',
      profilePicture: '',
      numServices: 2,
    },
  },
  {
    name: 'Digital Marketing',
    description: 'Complete digital marketing solutions',
    Profile: {
      _id: 'profile-3',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      profilePicture: '',
      numServices: 4,
    },
  },
  {
    name: 'UI/UX Design',
    description: 'User interface and user experience design',
    Profile: {
      _id: 'profile-4',
      firstName: 'Marie',
      lastName: 'Dubois',
      profilePicture: '',
      numServices: 2,
    },
  },
];
