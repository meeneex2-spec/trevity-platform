'use client';

import Nav from './Nav';
import Hero from './Hero';
import WhatIsTrevity from './WhatIsTrevity';
import Regions from './Regions';
import Campaigns from './Campaigns';
import HowItWorks from './HowItWorks';
import Benefits from './Benefits';
import Reels from './Reels';
import Faq from './Faq';
import FinalCta from './FinalCta';
import Footer from './Footer';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import type { Locale } from '@/lib/i18n/dictionaries';

type Props = {
  countries: any[];
  categories: any[];
  faqs: any[];
  reels: any[];
  ctaUrls: Partial<Record<Locale, string>>;
};

export default function LandingShell({ countries, categories, faqs, reels, ctaUrls }: Props) {
  return (
    <LanguageProvider ctaUrls={ctaUrls}>
      <Nav />
      <Hero />
      <WhatIsTrevity />
      <Regions countries={countries} />
      <Campaigns categories={categories} />
      <HowItWorks />
      <Benefits />
      <Reels reels={reels} />
      <Faq faqs={faqs} />
      <FinalCta />
      <Footer />
    </LanguageProvider>
  );
}
