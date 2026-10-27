import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Box, Calculator, ChevronLeft, ChevronRight, Clock3, ImagePlus, Loader2, LogOut, Menu, MessageCircle, PackageSearch, Pencil, Plus, Search, ShieldCheck, Sparkles, Trash2, Truck, X } from 'lucide-react';
import './official-site.css';
import './product-gallery.css';
import { PrinterAnimation, VisionLogo } from './BrandAssets';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  delivery_time?: string | null;
  image_url?: string | null;
  weight: number;
  width: number;
  height: number;
  length: number;
  active: number;
  images: Array<{ id: number; url: string }>;
};

type Quote = { id: number; name: string; company: string; price: string; deliveryTime: number };
type ProductDraft = Omit<Product, 'id' | 'images'>;

const CONTACT = {
  whatsapp: 'https://wa.me/5511987148362',
};

const EMPTY_PRODUCT: ProductDraft = {
  name: '', description: '', price: 0, delivery_time: '', image_url: '',
  weight: 0.3, width: 15, height: 10, length: 20, active: 1,
};

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('A API local não está ativa. Use npm run dev:full para acessar o catálogo.');
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Não foi possível concluir a operação.');
  return body as T;
}

async function uploadImages(productId: number, files: File[]) {
  if (!files.length) return;
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  const response = await fetch(`/api/admin/products/${productId}/images`, { method: 'POST', body: formData, credentials: 'same-origin' });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Não foi possível enviar as imagens.');
}

function Brand() {
  return <a className="official-brand" href="/site" aria-label="Vision3D"><VisionLogo compact /></a>;
}

export default function OfficialSite() {
  const isAdminRoute = window.location.pathname === '/admin' || window.location.hash === '#admin';
  return isAdminRoute ? <Admin /> : <Storefront />;
}

function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api<{ products: Product[] }>('/api/products')
      .then(data => setProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const filtered = useMemo(() => products.filter(product =>
    `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase())
  ), [products, search]);

  return (
    <div className="official-shell">
      <header className="official-header">
        <div className="official-container official-nav">
          <Brand />
          <nav id="main-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Navegação principal">
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
            <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a>
            <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
          </nav>
          <a className="nav-whatsapp" href={`${CONTACT.whatsapp}?text=Ol%C3%A1%20Vision3D!%20Gostaria%20de%20fazer%20um%20or%C3%A7amento.`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Orçamento</a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="main-navigation">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>
      {menuOpen && <button className="menu-scrim" type="button" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <main>
        <section className="official-hero" id="inicio">
          <div className="official-container hero-grid">
            <div className="hero-copy">
              <span className="official-kicker"><Sparkles size={15} /> Criamos o que você imagina</span>
              <h1>Suas ideias ganham <em>forma.</em></h1>
              <p>Peças personalizadas, protótipos e colecionáveis produzidos em impressão 3D com precisão e acabamento.</p>
              <div className="hero-actions"><a className="primary-button" href={`${CONTACT.whatsapp}?text=Ol%C3%A1%20Vision3D!%20Quero%20pedir%20um%20or%C3%A7amento%20para%20um%20projeto%203D%20personalizado.`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Pedir orçamento</a><a className="secondary-button" href="#catalogo">Ver projetos</a></div>
              <div className="hero-trust"><span><ShieldCheck /> Produção cuidadosa</span><span><Truck /> Envio para todo Brasil</span></div>
            </div>
            <div className="hero-visual"><PrinterAnimation /></div>
          </div>
        </section>

        <section className="catalog-section" id="catalogo">
          <div className="official-container">
            <div className="catalog-heading"><div><span className="official-kicker">Nosso catálogo</span><h2>Explore nossas criações</h2></div><label className="search-box"><Search size={19} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..." /></label></div>
            {loading ? <div className="catalog-state"><Loader2 className="spin" /> Carregando catálogo...</div> : filtered.length === 0 ? <div className="catalog-state"><PackageSearch size={34} /><strong>{search ? 'Nenhum produto encontrado' : 'Catálogo em preparação'}</strong><span>{search ? 'Tente buscar por outro nome.' : 'Em breve teremos novas criações por aqui.'}</span></div> : <div className="product-grid">{filtered.map(product => <ProductCard product={product} onOpen={() => setSelected(product)} key={product.id} />)}</div>}
          </div>
        </section>

        <section className="contact-strip" id="contato"><div className="official-container"><div><span className="official-kicker">Projeto personalizado?</span><h2>Vamos transformar sua ideia em realidade.</h2></div><a className="primary-button" href={`${CONTACT.whatsapp}?text=Ol%C3%A1%20Vision3D!%20Tenho%20uma%20ideia%20para%20um%20projeto%203D.`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Falar no WhatsApp</a></div></section>
      </main>
      <footer className="official-footer"><div className="official-container"><Brand /><p>© 2026 Vision3D. Impressão 3D com criatividade e precisão.</p><a href="/admin" aria-label="Área administrativa"><ShieldCheck size={16} /></a></div></footer>
      <a className="floating-whatsapp" href={`${CONTACT.whatsapp}?text=Ol%C3%A1%20Vision3D!%20Vim%20pelo%20site%20e%20gostaria%20de%20falar%20sobre%20um%20projeto%203D.`} target="_blank" rel="noreferrer" aria-label="Pedir orçamento pelo WhatsApp"><MessageCircle size={24} /><span>Orçamento</span></a>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const cover = product.images?.[0]?.url || product.image_url;
  return <article className="product-card" onClick={onOpen}>
    <div className="product-image">{cover ? <img src={cover} alt={product.name} /> : <Box size={48} strokeWidth={1.1} />}<span>Ver detalhes</span></div>
    <div className="product-info"><h3>{product.name}</h3><p>{product.description}</p><div><strong>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>{product.delivery_time && <small><Clock3 size={13} /> {product.delivery_time}</small>}</div></div>
  </article>;
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [cep, setCep] = useState(''); const [quotes, setQuotes] = useState<Quote[]>([]); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const gallery = product.images?.length ? product.images.map(image => image.url) : product.image_url ? [product.image_url] : [];
  async function quote(event: FormEvent) { event.preventDefault(); setError(''); setLoading(true); try { const data = await api<{ quotes: Quote[] }>('/api/shipping/quote', { method: 'POST', body: JSON.stringify({ productId: product.id, cep: cep.replace(/\D/g, '') }) }); setQuotes(data.quotes); } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao calcular frete.'); } finally { setLoading(false); } }
  const orderText = encodeURIComponent(`Olá Vision3D! Tenho interesse no produto: ${product.name} (${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}).`);
  return <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}><div className="product-modal"><button className="modal-close" onClick={onClose}><X /></button><div className="modal-gallery"><div className="modal-product-image">{gallery.length ? <img src={gallery[imageIndex]} alt={`${product.name} — imagem ${imageIndex + 1}`} /> : <Box size={72} />}{gallery.length > 1 && <><button className="gallery-arrow gallery-arrow--left" onClick={() => setImageIndex((imageIndex - 1 + gallery.length) % gallery.length)}><ChevronLeft /></button><button className="gallery-arrow gallery-arrow--right" onClick={() => setImageIndex((imageIndex + 1) % gallery.length)}><ChevronRight /></button><span className="gallery-count">{imageIndex + 1} / {gallery.length}</span></>}</div>{gallery.length > 1 && <div className="gallery-thumbs">{gallery.map((url, index) => <button className={index === imageIndex ? "is-active" : ""} onClick={() => setImageIndex(index)} key={url}><img src={url} alt="" /></button>)}</div>}</div><div className="modal-content"><span className="official-kicker">Impressão 3D</span><h2>{product.name}</h2><p>{product.description}</p><strong className="modal-price">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>{product.delivery_time && <span className="production-time"><Clock3 size={15} /> Produção: {product.delivery_time}</span>}<form className="shipping-form" onSubmit={quote}><label><span>Calcule o frete e prazo</span><div><input inputMode="numeric" value={cep} onChange={e => setCep(e.target.value)} placeholder="Digite seu CEP" maxLength={9} required /><button disabled={loading}>{loading ? <Loader2 className="spin" /> : <Calculator size={18} />} Calcular</button></div></label></form>{error && <p className="form-error">{error}</p>}{quotes.length > 0 && <div className="quote-list">{quotes.map(item => <div key={item.id}><span><strong>{item.company}</strong><small>{item.name}</small></span><span><strong>R$ {item.price}</strong><small>{item.deliveryTime} dias úteis</small></span></div>)}</div>}<a className="primary-button full-button" href={`${CONTACT.whatsapp}?text=${orderText}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Pedir pelo WhatsApp</a></div></div></div>;
}

function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null); const [products, setProducts] = useState<Product[]>([]); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [editing, setEditing] = useState<Product | null | 'new'>(null); const [busy, setBusy] = useState(false);
  const loadProducts = () => api<{ products: Product[] }>('/api/admin/products').then(data => { setProducts(data.products); setAuthenticated(true); }).catch(() => setAuthenticated(false));
  useEffect(() => { loadProducts(); }, []);
  async function login(event: FormEvent) { event.preventDefault(); setBusy(true); setError(''); try { await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) }); await loadProducts(); setPassword(''); } catch (err) { setError(err instanceof Error ? err.message : 'Acesso negado.'); } finally { setBusy(false); } }
  async function logout() { await api('/api/auth/logout', { method: 'POST' }); setAuthenticated(false); }
  async function remove(product: Product) { if (!confirm(`Excluir “${product.name}”?`)) return; await api(`/api/admin/products/${product.id}`, { method: 'DELETE' }); await loadProducts(); }
  if (authenticated === null) return <div className="admin-loading"><Loader2 className="spin" /></div>;
  if (!authenticated) return <div className="admin-shell admin-login"><form onSubmit={login}><Brand /><span className="admin-badge"><ShieldCheck size={15} /> Área protegida</span><h1>Painel administrativo</h1><p>Entre com a senha configurada no servidor.</p><label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus required /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={busy}>{busy && <Loader2 className="spin" />} Entrar</button><a href="/site"><ArrowLeft size={16} /> Voltar ao catálogo</a></form></div>;
  return <div className="admin-shell"><header className="admin-header"><Brand /><div><a href="/site">Ver catálogo</a><button onClick={logout}><LogOut size={17} /> Sair</button></div></header><main className="admin-main"><div className="admin-title"><div><span className="admin-badge"><ShieldCheck size={14} /> Administrador</span><h1>Produtos</h1><p>{products.length} produtos cadastrados</p></div><button className="primary-button" onClick={() => setEditing('new')}><Plus size={18} /> Novo produto</button></div><div className="admin-table-wrap"><table><thead><tr><th>Produto</th><th>Preço</th><th>Prazo</th><th>Status</th><th /></tr></thead><tbody>{products.map(product => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.description}</small></td><td>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td>{product.delivery_time || '—'}</td><td><span className={product.active ? 'active-status' : 'inactive-status'}>{product.active ? 'Ativo' : 'Oculto'}</span></td><td><button onClick={() => setEditing(product)} aria-label="Editar"><Pencil size={17} /></button><button onClick={() => remove(product)} aria-label="Excluir"><Trash2 size={17} /></button></td></tr>)}</tbody></table>{products.length === 0 && <div className="empty-admin"><PackageSearch /><p>Nenhum produto cadastrado.</p></div>}</div></main>{editing && <ProductForm product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await loadProducts(); }} />}</div>;
}

function ProductForm({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<ProductDraft>(product ? { ...product } : EMPTY_PRODUCT); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(() => files.map(file => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(() => () => previews.forEach(preview => URL.revokeObjectURL(preview.url)), [previews]);
  const update = (key: keyof ProductDraft, value: string | number) => setForm(current => ({ ...current, [key]: value }));
  function selectFiles(selected: FileList | null) {
    const next = Array.from(selected || []);
    if ((product?.images?.length || 0) + files.length + next.length > 8) return setError('Cada produto pode ter no máximo 8 imagens.');
    if (next.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) return setError('Use JPG, PNG ou WEBP com até 5 MB por imagem.');
    setError(''); setFiles(current => [...current, ...next]);
  }
  async function removeExisting(imageId: number) {
    if (!product || !confirm('Remover esta imagem?')) return;
    try { await api(`/api/admin/products/${product.id}/images/${imageId}`, { method: 'DELETE' }); product.images = product.images.filter(image => image.id !== imageId); setForm(current => ({ ...current })); } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível remover a imagem.'); }
  }
  async function save(event: FormEvent) { event.preventDefault(); setBusy(true); setError(''); try { const result = await api<{ id?: number }>(product ? `/api/admin/products/${product.id}` : '/api/admin/products', { method: product ? 'PUT' : 'POST', body: JSON.stringify(form) }); const productId = product?.id ?? result.id; if (!productId) throw new Error('Produto criado sem identificador.'); await uploadImages(productId, files); await onSaved(); } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível salvar.'); } finally { setBusy(false); } }
  return <div className="modal-backdrop"><form className="admin-form" onSubmit={save}><button type="button" className="modal-close" onClick={onClose}><X /></button><span className="admin-badge">{product ? 'Editar produto' : 'Novo produto'}</span><h2>{product ? product.name : 'Cadastrar produto'}</h2><div className="form-grid"><label className="wide">Nome*<input value={form.name} onChange={e => update('name', e.target.value)} required /></label><label className="wide">Descrição*<textarea rows={4} value={form.description} onChange={e => update('description', e.target.value)} required /></label><label>Preço (R$)*<input type="number" min="0" step="0.01" value={form.price} onChange={e => update('price', Number(e.target.value))} required /></label><label>Prazo de produção<input value={form.delivery_time || ''} onChange={e => update('delivery_time', e.target.value)} placeholder="Ex.: 5 a 8 dias" /></label><div className="wide image-manager"><span>Imagens do produto</span><div className="image-preview-grid">{product?.images?.map((image, index) => <div className="image-preview" key={image.id}><img src={image.url} alt="" />{index === 0 && <small>Capa</small>}<button type="button" onClick={() => removeExisting(image.id)} aria-label="Remover imagem"><X size={15} /></button></div>)}{previews.map((preview, index) => <div className="image-preview is-new" key={preview.url}><img src={preview.url} alt="" /><small>Nova</small><button type="button" onClick={() => setFiles(current => current.filter((_, fileIndex) => fileIndex !== index))} aria-label="Remover imagem selecionada"><X size={15} /></button></div>)}{((product?.images?.length || 0) + files.length < 8) && <label className="image-upload"><ImagePlus size={25} /><strong>Adicionar imagens</strong><small>JPG, PNG ou WEBP · até 5 MB</small><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => { selectFiles(event.target.files); event.target.value = ""; }} /></label>}</div><small className="image-help">A primeira imagem será usada como capa. Máximo de 8 imagens por produto.</small></div><fieldset className="wide"><legend>Dados para cálculo do frete</legend><div><label>Peso (kg)<input type="number" min="0.01" step="0.01" value={form.weight} onChange={e => update('weight', Number(e.target.value))} /></label><label>Largura (cm)<input type="number" min="1" value={form.width} onChange={e => update('width', Number(e.target.value))} /></label><label>Altura (cm)<input type="number" min="1" value={form.height} onChange={e => update('height', Number(e.target.value))} /></label><label>Comprimento (cm)<input type="number" min="1" value={form.length} onChange={e => update('length', Number(e.target.value))} /></label></div></fieldset><label className="checkbox wide"><input type="checkbox" checked={Boolean(form.active)} onChange={e => update('active', e.target.checked ? 1 : 0)} /> Produto visível no catálogo</label></div>{error && <p className="form-error">{error}</p>}<div className="form-actions"><button type="button" onClick={onClose}>Cancelar</button><button className="primary-button" disabled={busy}>{busy && <Loader2 className="spin" />} Salvar produto</button></div></form></div>;
}
