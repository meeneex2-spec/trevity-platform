'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LanguageProvider';

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

export default function Faq({ faqs }: { faqs: FaqItem[] }) {
  const { t } = useT();
  const [openId, setOpenId] = useState<number | null>(null);

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
            return (
              <div key={f.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <div
                  className="faq-question"
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                >
                  <span className="faq-num">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="faq-q-text">{f.question}</span>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">{f.answer}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
