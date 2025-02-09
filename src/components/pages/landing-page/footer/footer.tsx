import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import React from 'react';

import EnvolopIcon from '@/components/icons/envolop-icon';
import HandshakeIcon from '@/components/icons/handshake-icon';
import PersonHeadset from '@/components/icons/person-headset';
import SpinetLogo from '@/components/icons/spinet-logo';
import useTranslate from '@/hooks/use-translate';

type Props = {
  locale: string;
};
//
async function Footer({ locale }: Props) {
  const { t } = await useTranslate(locale);
  const contacts = [
    {
      icon: <PersonHeadset />,
      title: 'contact-us',
      text: '+123-456-7890',
    },
    {
      icon: <EnvolopIcon />,
      title: 'get-in-touch',
      text: 'support@spinetnfc.com',
    },
    {
      icon: <HandshakeIcon />,
      title: 'work-with-us',
      text: '23 Spinet Ave, Tech City, TX',
    },
  ];
  return (
    <div className="flex flex-col gap-5 p-4 text-[#1A3B8E] dark:text-white lg:gap-8 lg:px-16 lg:py-12">
      <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-4 dark:border-neutral-800">
        <SpinetLogo className="hover:cursor-pointer" width={151} height={31} />
        <div className="flex items-center justify-center gap-5">
          <span>{t('follow-us')}</span>
          <div className="flex gap-2">
            <Linkedin
              size={24}
              className="hover:cursor-pointer hover:text-[#1A3B8E]/80 dark:hover:text-white/80"
            />
            <Facebook
              size={24}
              className="hover:cursor-pointer hover:text-[#1A3B8E]/80 dark:hover:text-white/80"
            />
            <Twitter
              size={24}
              className="hover:cursor-pointer hover:text-[#1A3B8E]/80 dark:hover:text-white/80"
            />
            <Instagram
              size={24}
              className="hover:cursor-pointer hover:text-[#1A3B8E]/80 dark:hover:text-white/80"
            />
            <Youtube
              size={24}
              className="hover:cursor-pointer hover:text-[#1A3B8E]/80 dark:hover:text-white/80"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 border-b-2 border-neutral-200 pb-4 dark:border-neutral-800 lg:flex-row lg:items-end  lg:gap-8">
        {contacts.map((c, i) => (
          <div className="flex flex-col items-center gap-2" key={i}>
            {c.icon}
            <span className="text-lg font-semibold">{t(c.title)}</span>
            <span>{c.text}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 border-b-2 border-neutral-200 pb-4 dark:border-neutral-800 lg:flex-row lg:gap-8 ">
        <span className="text-sm hover:cursor-pointer">{t('about-us')}</span>
        <span className="text-sm hover:cursor-pointer">{t('blog')}</span>
        <span className="text-sm hover:cursor-pointer">{t('demo')}</span>
        <span className="text-sm hover:cursor-pointer">{t('store')}</span>
      </div>

      <span className="text-center text-sm hover:cursor-pointer">
        {t('terms-of-service-and-privacy-policy')}
      </span>
    </div>
  );
}

export default Footer;
