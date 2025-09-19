import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import React from 'react';

import EnvolopIcon from '@/components/icons/envolop-icon';
import HandshakeIcon from '@/components/icons/handshake-icon';
import PersonHeadset from '@/components/icons/person-headset';
import SpinetLogo from '@/components/icons/spinet-logo';
import FooterLinks from './footerLinks'; // Import the client component
import useTranslate from '@/hooks/use-translate';

type Props = {
  locale: string;
};

async function Footer({ locale }: Props) {
  const { t } = await useTranslate(locale);

  const contacts = [
    { icon: <PersonHeadset />, title: 'contact-us', text: '+123-456-7890' },
    { icon: <EnvolopIcon />, title: 'get-in-touch', text: 'support@spinetnfc.com' },
    { icon: <HandshakeIcon />, title: 'work-with-us', text: '23 Spinet Ave, Tech City, TX' },
  ];

  // social media links
  const socialLinks = [
    { icon: <Linkedin size={24} />, url: 'https://www.linkedin.com/company/sarl-spinet-nfc' },
    { icon: <Facebook size={24} />, url: 'https://facebook.com/spinetnfc' },
    { icon: <Twitter size={24} />, url: 'https://twitter.com' },
    { icon: <Instagram size={24} />, url: 'https://www.instagram.com/spinet.nfc' },
    { icon: <Youtube size={24} />, url: 'https://www.youtube.com/@spinet6515' },
  ];

  return (
    <div className="flex flex-col px-4 bg-main text-white lg:px-16 pt-8 lg:pt-16">
      <div className="flex items-center justify-between border-b-2 pb-8 border-blue-950">
        <SpinetLogo className="hover:cursor-pointer" width={151} height={31} />
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <span className="hidden sm:block">{t('follow-us')}</span>
          <FooterLinks links={socialLinks} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-evenly gap-8 py-8 border-b-2 border-blue-950 md:flex-row lg:items-end">
        {contacts.map((c, i) => (
          <div className="md:w-3/10 flex flex-col items-center gap-3" key={i}>
            {c.icon}
            <span className="text-lg font-semibold">{t(c.title)}</span>
            <span className='text-[#EEF6FF]/80'>{c.text}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-6 py-8 border-b-2 border-blue-950 md:flex-row lg:gap-8">
        <span className="text-sm hover:cursor-pointer">{t('about-us')}</span>
        <span className="text-sm hover:cursor-pointer">{t('blog')}</span>
        <span className="text-sm hover:cursor-pointer">{t('demo')}</span>
        <span className="text-sm hover:cursor-pointer">{t('store')}</span>
      </div>

      <div className="py-3">
        <span className="text-center text-sm hover:cursor-pointer text-[#EEF6FF]/80 block">
          {t('terms-of-service-and-privacy-policy')}
        </span>
      </div>
    </div>
  );
}

export default Footer;
