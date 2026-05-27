'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LanguageProvider';
import { FAQ_TRANSLATIONS } from '@/lib/i18n/dictionaries';

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

export default function Faq({ faqs }: { faqs: FaqItem[] }) {
  const { t, locale } = useT();
  const [openId, setOpenId] = useState<number | null>(null);

  const translations = FAQ_TRANSLATIONS[locale];

  return (
    <section id="faq" className="section-faq">
      <div className="section-inner">
        <div className="section-header">
          <p className="section-label">{t.faq.label}</p>
          <h2 className="section-title">{t.faq.title}</h2>
        </div>
        <div className="faq-container">
          {faqs.map((f, idx) => {
            const isOpen = openId === f.id;
            // 같은 인덱스의 locale 번역이 있으면 우선 사용
            const tr = translations?.[idx];
            const question = tr?.question ?? f.question;
            const answer = tr?.answer ?? f.answer;
            return (
              <div key={f.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <div
                  className="faq-question"
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                >
                  <span className="faq-num">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="faq-q-text">{question}</span>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">{answer}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
