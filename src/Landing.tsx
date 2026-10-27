import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy, Globe2, Instagram, MessageCircle, QrCode } from 'lucide-react';
import { VisionLogo } from './BrandAssets';
import './landing.css';

const CONTACT = {
  instagram: 'https://www.instagram.com/vision3d.gh?xtok=MWh0OXhsMDZxczR4cA==',
  whatsapp: 'https://wa.me/5511987148362?text=Ol%C3%A1%20Vision3D!%20Gostaria%20de%20fazer%20um%20or%C3%A7amento.',
  website: '/site',
  pixKey: '11987148362',
};

const links = [
  { title: 'Acessar site oficial', description: 'Conheça a Vision3D completa', href: CONTACT.website, icon: Globe2, className: 'link-card--website' },
  { title: 'Ver nosso Instagram', description: 'Projetos, bastidores e novidades', href: CONTACT.instagram, icon: Instagram, className: 'link-card--instagram' },
  { title: 'Chamar no WhatsApp', description: 'Orçamentos e atendimento rápido', href: CONTACT.whatsapp, icon: MessageCircle, className: 'link-card--whatsapp' },
];

export default function Landing() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(CONTACT.pixKey);
      setCopied(true);
    } catch {
      window.prompt('Copie a chave PIX:', CONTACT.pixKey);
    }
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient--one" /><div className="ambient ambient--two" />
      <section className="landing landing--minimal" aria-label="Links da Vision3D">
        <header className="topbar">
          <div className="landing-brand">
            <a className="brand" href="#inicio" aria-label="Vision3D — início">
              <VisionLogo compact />
            </a>
            <p>Impressão 3D personalizada, protótipos e colecionáveis.</p>
          </div>
        </header>

        <section className="actions" id="inicio" aria-label="Links de contato">
          <div className="link-list">
            {links.map(({ title, description, href, icon: Icon, className }) => (
              <a className={`link-card ${className}`} href={href} target={href.startsWith('/') ? undefined : '_blank'} rel={href.startsWith('/') ? undefined : 'noreferrer'} key={title}>
                <span className="link-icon"><Icon size={23} /></span>
                <span className="link-copy"><strong>{title}</strong><small>{description}</small></span>
                <ArrowUpRight className="link-arrow" size={21} />
              </a>
            ))}
            <button className={`pix-card ${copied ? 'is-copied' : ''}`} type="button" onClick={copyPix}>
              <span className="link-icon"><QrCode size={23} /></span>
              <span className="link-copy"><strong>{copied ? 'Chave PIX copiada!' : 'Copiar chave PIX'}</strong><small>{copied ? 'Agora é só colar no seu banco' : CONTACT.pixKey}</small></span>
              <span className="copy-action">{copied ? <Check size={20} /> : <Copy size={20} />}</span>
            </button>
          </div>
        </section>

      </section>
    </main>
  );
}
