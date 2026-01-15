// Type definitions for e-museum.kz

export interface MenuItem {
  label: string;
  href: string;
  isAnchor?: boolean;
  children?: MenuItem[];
}

export interface FooterMenuItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'whatsapp' | 'twitter';
  url: string;
  ariaLabel: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  href: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
}

