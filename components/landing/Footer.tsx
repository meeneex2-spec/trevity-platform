'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="trv-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">trevity</div>
          <div className="footer-tagline">{t.footer.tagline}</div>
        </div>
        <div className="footer-links">
          <a href="#">{t.footer.l1}</a>
          <a href="#">{t.footer.l2}</a>
          <a href="#">{t.footer.l3}</a>
          <a href="#">{t.footer.l4}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">{t.footer.copy}</span>
        <div className="footer-social">
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
          <a href="#">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
