import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Unlock, 
  Instagram, 
  MessageCircle, 
  Clock, 
  Sparkles, 
  X, 
  CheckCircle, 
  SlidersHorizontal,
  UploadCloud,
  Eye,
  ShieldCheck,
  Cpu,
  Box,
  Award
} from 'lucide-react';

// Custom Vision3D Metallic Logo Component
const Vision3DLogo = ({ className = "w-10 h-10", textSize = "text-2xl" }: { className?: string; textSize?: string }) => (
  <div className="flex items-center gap-3 select-none group">
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md group-hover:bg-amber-400/30 transition-all duration-500" />
      {/* Circular Emblem with spotlight gradient */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-b from-zinc-700 via-zinc-900 to-black border border-amber-500/30 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
        {/* Top spotlight reflection */}
        <div className="absolute -top-6 inset-x-0 h-10 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-sm pointer-events-none" />
        
        {/* Custom SVG duplicating the curved metallic arcs from the logo */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {/* Top Gold Arc */}
          <path 
            d="M 22 42 A 38 38 0 0 1 78 30" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
          />
          {/* Bottom Gold Arc */}
          <path 
            d="M 22 58 A 38 38 0 0 0 78 70" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
          />
          {/* SVG Gradient definitions */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1B0" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          <text x="23" y="57" fill="url(#silverGradient)" fontSize="20" fontWeight="900" fontFamily="sans-serif">V</text>
          <text x="62" y="57" fill="url(#goldGradient)" fontSize="18" fontWeight="900" fontFamily="sans-serif">3D</text>
        </svg>
      </div>
    </div>
    <div className="flex flex-col">
      <div className={`font-black tracking-tight leading-none ${textSize}`}>
        <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Vision</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] ml-1">3D</span>
      </div>
      <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400/80 font-bold mt-0.5">
        Impressão & Modelagem
      </span>
    </div>
  </div>
);

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  deliveryDays: string;
  material: string;
  image: string;
  description: string;
  featured: boolean;
}

// INITIAL PRODUCTS DATA (Nenhum produto cadastrado previamente)
const INITIAL_PRODUCTS: Product[] = [];

const CATEGORIES = ['Todos', 'Colecionáveis', 'Protótipos', 'Decoração', 'Acessórios', 'Cosplay'];

export default function App() {
  // State for products & localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vision3d_gold_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Modal & Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [showSTLModal, setShowSTLModal] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('vision3d_gold_products', JSON.stringify(products));
  }, [products]);

  // Listener para verificação da rota/link de acesso ADM (#admin ou ?admin=true)
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#admin' || search.includes('admin=true')) {
        setShowAdminLoginModal(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin123') {
      setIsAdminLoggedIn(true);
      setShowAdminLoginModal(false);
      setAdminPasswordInput('');
      setLoginError('');
      setViewMode('admin');
      showToast('Bem-vindo! Modo Administrador ativado com sucesso.');
    } else {
      setLoginError('Senha incorreta. Utilize: admin123');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setViewMode('store');
    showToast('Sessão administrativa encerrada.');
  };

  const handleClearCatalog = () => {
    if (window.confirm('Deseja limpar todos os produtos do catálogo?')) {
      setProducts([]);
      showToast('Catálogo limpo com sucesso!');
    }
  };

  // CRUD Handlers
  const handleSaveProduct = (formData: Omit<Product, 'id'>) => {
    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? { ...formData, id: currentProduct.id } : p));
      showToast('Produto atualizado com sucesso!');
    } else {
      const newProduct: Product = {
        ...formData,
        id: Date.now().toString(),
      };
      setProducts([newProduct, ...products]);
      showToast('Novo produto cadastrado com sucesso!');
    }
    setShowProductModal(false);
    setCurrentProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este item do catálogo?')) {
      setProducts(products.filter(p => p.id !== id));
      showToast('Item excluído com sucesso!');
    }
  };

  // WhatsApp Order Link Builder
  const getWhatsAppOrderLink = (productName: string, price: number, material: string) => {
    const phoneNumber = '5511999999999';
    const text = encodeURIComponent(
      `Olá Vision3D! Gostaria de encomendar a impressão 3D do produto:

` +
      `📦 *${productName}*
` +
      `💰 *Valor:* R$ ${Number(price).toFixed(2)}
` +
      `🧪 *Material:* ${material || 'PLA/Resina'}

` +
      `Poderiam me informar as opções de frete e prazos para o meu CEP?`
    );
    return `https://wa.me/${phoneNumber}?text=${text}`;
  };

  const getWhatsAppSTLQuoteLink = () => {
    const phoneNumber = '5511999999999';
    const text = encodeURIComponent(
      `Olá equipe Vision3D! Tenho um arquivo 3D (.STL / .OBJ) personalizado e gostaria de solicitar um orçamento de impressão.

Poderiam me instruir como enviar o arquivo?`
    );
    return `https://wa.me/${phoneNumber}?text=${text}`;
  };

  // Filtered & Sorted list
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.material && product.material.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-amber-500/50 text-white px-5 py-3.5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR / HEADER */}
      <header className="sticky top-0 z-40 bg-[#0D0D0F]/90 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div onClick={() => setViewMode('store')} className="cursor-pointer">
            <Vision3DLogo className="w-11 h-11" textSize="text-2xl" />
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <a href="#inicio" onClick={() => setViewMode('store')} className="hover:text-amber-400 transition-colors">Início</a>
            <a href="#cartao-visita" onClick={() => setViewMode('store')} className="hover:text-amber-400 transition-colors">Cartão Digital</a>
            <a href="#catalogo" onClick={() => setViewMode('store')} className="hover:text-amber-400 transition-colors">Catálogo 3D</a>
            <a href="#servicos" onClick={() => setViewMode('store')} className="hover:text-amber-400 transition-colors">Serviços</a>
          </nav>

          {/* Alternador de visualização exclusivo se o administrador já estiver logado */}
          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'store' ? 'admin' : 'store')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all font-semibold text-xs uppercase tracking-wider"
                >
                  {viewMode === 'store' ? <ShieldCheck className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
                  {viewMode === 'store' ? 'Painel ADM' : 'Ver Loja'}
                </button>
                <button
                  onClick={handleLogout}
                  title="Encerrar Sessão ADM"
                  className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Unlock className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* VIEW: LOJA PÚBLICA */}
      {viewMode === 'store' && (
        <main className="pb-24">
          
          {/* HERO SECTION */}
          <section id="inicio" className="relative overflow-hidden pt-16 pb-20 border-b border-amber-500/10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/50 via-[#0D0D0F] to-[#0D0D0F]">
            {/* Top Spotlight Backdrop */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tecnologia FDM & Resina UV 8K
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
                Engenharia & Arte em <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-600 drop-shadow-[0_4px_20px_rgba(245,158,11,0.3)]">
                  Impressão 3D de Alta Precisão
                </span>
              </h1>

              <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Transformamos arquivos digitais em produtos físicos de alta durabilidade. Do protótipo mecânico complexo às action figures raras com acabamento artesanal.
              </p>

              {/* CARTÃO DE VISITA DIGITAL INTERATIVO */}
              <div id="cartao-visita" className="mt-14 max-w-2xl mx-auto">
                <div className="relative p-1 rounded-3xl bg-gradient-to-r from-amber-600/40 via-amber-400/60 to-amber-600/40 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
                  
                  {/* Inner Card Container */}
                  <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-black rounded-[22px] p-6 sm:p-8 relative overflow-hidden text-left border border-white/5">
                    
                    {/* Top ambient glare */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-amber-500/20">
                      <Vision3DLogo className="w-14 h-14" textSize="text-3xl" />
                      
                      <div className="text-right sm:text-right">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                          ● Atendimento Online Ativo
                        </span>
                        <p className="text-xs text-zinc-400 mt-1">
                          São Paulo - SP | Envios para todo o Brasil
                        </p>
                      </div>
                    </div>

                    <p className="text-zinc-300 text-xs sm:text-sm mt-4 leading-relaxed font-light">
                      🎴 <strong className="text-white font-semibold">Cartão de Visita Digital:</strong> Clique nos botões abaixo para entrar em contato imediato, conferir nossas redes ou enviar o seu projeto 3D em arquivo (.STL / .OBJ).
                    </p>

                    {/* Action Links Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
                      
                      {/* WhatsApp Button */}
                      <a
                        href="https://wa.me/5511999999999"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(16,185,129,0.25)] hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Falar no WhatsApp</span>
                      </a>

                      {/* Instagram Button */}
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(225,29,72,0.25)] hover:scale-[1.02]"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>Siga no Instagram</span>
                      </a>

                      {/* Enviar Arquivo STL */}
                      <button
                        onClick={() => setShowSTLModal(true)}
                        className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Orçamento via STL / OBJ</span>
                      </button>

                      {/* Catálogo Direct */}
                      <a
                        href="#catalogo"
                        className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02]"
                      >
                        <Box className="w-4 h-4 text-amber-400" />
                        <span>Explorar Catálogo</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* CATALOG SECTION */}
          <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            
            {/* Catalog Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-amber-500/20">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
                  Nossas Criações
                </span>
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  Catálogo de Impressões 3D
                </h2>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Search Bar */}
                <div className="relative sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Buscar peça, material..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto bg-zinc-900 border border-amber-500/20 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-400 transition-all appearance-none cursor-pointer pr-8 font-medium"
                  >
                    <option value="default">Ordenar: Destaques</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                    <option value="name">Nome (A-Z)</option>
                  </select>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 hover:border-amber-500/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* PRODUCT GRID OU ESTADO VAZIO */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-amber-500/10 my-6 max-w-2xl mx-auto px-4">
                <Box className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Nenhum produto cadastrado no momento</h3>
                <p className="text-zinc-400 text-xs mt-2 max-w-md mx-auto leading-relaxed">
                  Nossa loja está pronta para receber novas impressões. Se você precisa de uma peça ou projeto personalizado, solicite um orçamento direto pelo WhatsApp!
                </p>
                <a
                  href={getWhatsAppSTLQuoteLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:scale-105 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Solicitar Orçamento no WhatsApp</span>
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/20 hover:border-amber-400 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:-translate-y-1"
                  >
                    {/* Image Header */}
                    <div className="relative aspect-square overflow-hidden bg-black/60">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider text-amber-300 shadow-md">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="px-3 py-1 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        
                        {/* Material Info Tag */}
                        {product.material && (
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium mt-1.5">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>{product.material}</span>
                          </div>
                        )}

                        <p className="text-zinc-400 text-xs mt-3 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-6 pt-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between text-xs text-zinc-400 mb-4">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            Produção: <strong className="text-zinc-200">{product.deliveryDays}</strong>
                          </span>
                        </div>

                        {/* Price & Action Button */}
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] text-zinc-500 block uppercase font-bold">A partir de</span>
                            <span className="text-2xl font-black text-white">
                              R$ {Number(product.price).toFixed(2)}
                            </span>
                          </div>

                          <a
                            href={getWhatsAppOrderLink(product.name, product.price, product.material)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Encomendar
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SERVICES SUMMARY SECTION */}
          <section id="servicos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-amber-500/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              <div className="max-w-3xl">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
                  Soluções Sob Medida
                </span>
                <h2 className="text-3xl font-black text-white leading-tight">
                  Precisa de um Projeto Especial ou Produção em Lote?
                </h2>
                <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                  Trabalhamos com prototipagem rápida para engenharia, peças automotivas de reposição, action figures colecionáveis em alta resolução e maquetes arquitetônicas.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Resina UV 8K</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Detalhes micrométricos perfeitos para miniaturas.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">FDM Técnico</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Impressões em ABS, PETG Carbono e PLA+.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Pós-Processamento</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Lixamento, primer e pintura artesanal profissional.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* VIEW: PAINEL ADMINISTRATIVO (CRUD) */}
      {viewMode === 'admin' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Painel do Administrador
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Gerenciador do Catálogo</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearCatalog}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-all"
                  title="Limpar todos os produtos"
                >
                  <Trash2 className="w-4 h-4 text-red-400" /> Limpar Catálogo
                </button>

                <button
                  onClick={() => {
                    setCurrentProduct(null);
                    setShowProductModal(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:opacity-95 transition-all"
                >
                  <Plus className="w-4 h-4" /> Novo Produto
                </button>
              </div>
            </div>

            {/* Products CRUD Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-black/60 text-zinc-400 uppercase text-[11px] font-bold tracking-wider border-b border-amber-500/20">
                  <tr>
                    <th className="py-4 px-4">Item</th>
                    <th className="py-4 px-4">Categoria</th>
                    <th className="py-4 px-4">Material</th>
                    <th className="py-4 px-4">Preço (R$)</th>
                    <th className="py-4 px-4">Prazo</th>
                    <th className="py-4 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                        Nenhum produto cadastrado no banco de dados. Clique em "Novo Produto" para adicionar.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-amber-500/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover bg-black border border-amber-500/20"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800';
                              }}
                            />
                            <div>
                              <span className="font-bold text-white block">{product.name}</span>
                              <span className="text-xs text-zinc-500 line-clamp-1">{product.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-300">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-amber-400 font-medium">
                          {product.material || 'N/A'}
                        </td>
                        <td className="py-4 px-4 font-bold text-white">
                          R$ {Number(product.price).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-xs text-zinc-400">
                          {product.deliveryDays}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setCurrentProduct(product);
                                setShowProductModal(true);
                              }}
                              className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all"
                              title="Editar Produto"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                              title="Excluir Produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-amber-500/20 bg-black/80 py-12 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Vision3DLogo className="w-8 h-8" textSize="text-xl" />
          
          <p className="text-center md:text-left">
            © 2026 <strong className="text-zinc-300">Vision3D Impressões 3D</strong>. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* MODAL: ADMIN LOGIN (OCULTO - ACESSÍVEL VIA #admin OU ?admin=true NA URL) */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAdminLoginModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <Vision3DLogo className="w-12 h-12 mx-auto mb-4" textSize="text-2xl" />
              <h3 className="text-xl font-bold text-white">Acesso do Administrador</h3>
              <p className="text-xs text-zinc-400 mt-1">Informe a senha secreta para gerenciar o catálogo.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-2">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Senha (Padrão: admin123)"
                  className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:opacity-95 transition-all"
              >
                Acessar Painel ADM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SOLICITAÇÃO ORÇAMENTO STL */}
      {showSTLModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSTLModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <UploadCloud className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white">Enviar Projeto (.STL / .OBJ)</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Você tem um modelo 3D próprio? Enviamos o orçamento detalhado analisando peso em gramas, tempo de impressão e tipo de resina/filamento necessário.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={getWhatsAppSTLQuoteLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar via WhatsApp
              </a>
              <button
                onClick={() => setShowSTLModal(false)}
                className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CRIAR / EDITAR PRODUTO (CRUD) */}
      {showProductModal && (
        <ProductFormModal
          product={currentProduct}
          onClose={() => {
            setShowProductModal(false);
            setCurrentProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

    </div>
  );
}


// FORM MODAL FOR CREATE & EDIT
function ProductFormModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (data: Omit<Product, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'Colecionáveis',
    material: product?.material || 'Resina UV 8K',
    price: product?.price ?? ('' as string | number),
    deliveryDays: product?.deliveryDays || '3 a 5 dias úteis',
    image: product?.image || '',
    description: product?.description || '',
    featured: product?.featured || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    onSave({
      ...formData,
      price: parseFloat(formData.price as string)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {product ? <Edit2 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-amber-400" />}
          {product ? 'Editar Produto' : 'Cadastrar Novo Item 3D'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Nome da Peça / Produto</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Action Figure Batman 25cm"
              className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                  <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="199.90"
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Material Utilizado</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="Ex: PLA+, Resina UV, ABS"
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Prazo de Produção</label>
              <input
                type="text"
                value={formData.deliveryDays}
                onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
                placeholder="Ex: 3 a 5 dias úteis"
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">URL da Imagem</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Descrição do Produto</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva detalhes como dimensões, peso aproximado, acabamento e recomendações de uso."
              className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded bg-black border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="featured" className="text-xs text-zinc-300 font-medium cursor-pointer">
              Destacar este item na página principal
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:opacity-95"
            >
              {product ? 'Salvar Alterações' : 'Cadastrar Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
