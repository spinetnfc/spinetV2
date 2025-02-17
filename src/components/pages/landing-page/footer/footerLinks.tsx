'use client';

import React from 'react';

type FooterLinksProps = {
    links: { icon: React.ReactNode; url: string }[];
};

const FooterLinks: React.FC<FooterLinksProps> = ({ links }) => {
    return (
        <div className="flex gap-2">
            {links.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:cursor-pointer hover:text-[#1A3B8E]/80 dark:hover:text-white/80"
                >
                    {link.icon}
                </a>
            ))}
        </div>
    );
};

export default FooterLinks;
