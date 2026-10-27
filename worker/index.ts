interface D1Result<T> { results?: T[]; success: boolean }
interface D1Prepared { bind(...values: unknown[]): D1Prepared; all<T>(): Promise<D1Result<T>>; first<T>(): Promise<T | null>; run(): Promise<{ success: boolean; meta: { last_row_id?: number } }> }
interface D1Database { prepare(query: string): D1Prepared }
interface Fetcher { fetch(request: Request): Promise<Response> }
interface R2ObjectBody { body: ReadableStream; httpMetadata?: { contentType?: string }; writeHttpMetadata(headers: Headers): void }
interface R2Bucket { put(key: string, value: ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> }): Promise<void>; get(key: string): Promise<R2ObjectBody | null>; delete(key: string | string[]): Promise<void> }

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  PRODUCT_IMAGES: R2Bucket;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  MELHOR_ENVIO_TOKEN: string;
  ORIGIN_CEP: string;
  ME_BASE_URL?: string;
}

type ProductInput = { name: string; description: string; price: number; delivery_time?: string; image_url?: string; weight?: number; width?: number; height?: number; length?: number; active?: number };
const encoder = new TextEncoder();
const json = (data: unknown, status = 200, headers: HeadersInit = {}) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
const error = (message: string, status = 400) => json({ error: message }, status);
const cleanCep = (value: unknown) => String(value || '').replace(/\D/g, '');

function base64url(data: ArrayBuffer | Uint8Array | string) {
  const bytes = typeof data === 'string' ? encoder.encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = ''; bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64url(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

async function createSession(secret: string) {
  const payload = base64url(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 }));
  return `${payload}.${await sign(payload, secret)}`;
}

async function validSession(request: Request, secret: string) {
  const token = request.headers.get('Cookie')?.match(/(?:^|;\s*)vision3d_session=([^;]+)/)?.[1];
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || signature !== await sign(payload, secret)) return false;
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized + '='.repeat((4 - normalized.length % 4) % 4)));
    return Number(decoded.exp) > Date.now();
  } catch { return false; }
}

async function samePassword(received: string, expected: string) {
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
  const [a, b] = await Promise.all([digest(received), digest(expected)]);
  let difference = 0; for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}

function validateProduct(input: ProductInput): ProductInput | null {
  const product = {
    name: String(input.name || '').trim(), description: String(input.description || '').trim(),
    price: Number(input.price), delivery_time: String(input.delivery_time || '').trim(), image_url: String(input.image_url || '').trim(),
    weight: Number(input.weight || 0.3), width: Number(input.width || 15), height: Number(input.height || 10), length: Number(input.length || 20), active: input.active ? 1 : 0,
  };
  if (!product.name || !product.description || !Number.isFinite(product.price) || product.price < 0) return null;
  if ([product.weight, product.width, product.height, product.length].some(value => !Number.isFinite(value) || value <= 0)) return null;
  if (product.name.length > 120 || product.description.length > 3000 || product.delivery_time.length > 100 || product.image_url.length > 1000) return null;
  return product;
}

async function attachImages(env: Env, products: Array<Record<string, unknown>>) {
  if (!products.length) return products;
  const ids = products.map(product => Number(product.id));
  const placeholders = ids.map(() => '?').join(',');
  const result = await env.DB.prepare(`SELECT id, product_id, object_key, position FROM product_images WHERE product_id IN (${placeholders}) ORDER BY position, id`).bind(...ids).all<Record<string, unknown>>();
  const images = result.results || [];
  return products.map(product => ({
    ...product,
    images: images.filter(image => Number(image.product_id) === Number(product.id)).map(image => ({ id: image.id, url: `/api/images/${image.object_key}` })),
  }));
}

async function handleApi(request: Request, env: Env) {
  const url = new URL(request.url); const path = url.pathname;
  if (path === '/api/products' && request.method === 'GET') {
    const result = await env.DB.prepare('SELECT id, name, description, price, delivery_time, image_url, weight, width, height, length, active FROM products WHERE active = 1 ORDER BY created_at DESC').all();
    return json({ products: await attachImages(env, (result.results || []) as Array<Record<string, unknown>>) }, 200, { 'Cache-Control': 'public, max-age=60' });
  }
  if (path.startsWith('/api/images/') && request.method === 'GET') {
    const key = decodeURIComponent(path.slice('/api/images/'.length));
    if (!key || key.includes('..')) return error('Imagem inválida.', 400);
    const object = await env.PRODUCT_IMAGES.get(key);
    if (!object) return error('Imagem não encontrada.', 404);
    const headers = new Headers({ 'Cache-Control': 'public, max-age=31536000, immutable' });
    object.writeHttpMetadata(headers);
    return new Response(object.body, { headers });
  }
  if (path === '/api/auth/login' && request.method === 'POST') {
    if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return error('Administrador ainda não configurado.', 503);
    const body = await request.json<{ password?: string }>().catch(() => ({}));
    if (!await samePassword(String(body.password || ''), env.ADMIN_PASSWORD)) return error('Senha incorreta.', 401);
    const session = await createSession(env.SESSION_SECRET);
    return json({ ok: true }, 200, { 'Set-Cookie': `vision3d_session=${session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800` });
  }
  if (path === '/api/auth/logout' && request.method === 'POST') return json({ ok: true }, 200, { 'Set-Cookie': 'vision3d_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0' });
  if (path === '/api/shipping/quote' && request.method === 'POST') return shippingQuote(request, env);
  if (path.startsWith('/api/admin/')) {
    if (!await validSession(request, env.SESSION_SECRET)) return error('Sessão expirada. Entre novamente.', 401);
    if (path === '/api/admin/products' && request.method === 'GET') {
      const result = await env.DB.prepare('SELECT id, name, description, price, delivery_time, image_url, weight, width, height, length, active FROM products ORDER BY created_at DESC').all();
      return json({ products: await attachImages(env, (result.results || []) as Array<Record<string, unknown>>) });
    }
    if (path === '/api/admin/products' && request.method === 'POST') {
      const product = validateProduct(await request.json<ProductInput>()); if (!product) return error('Revise os dados do produto.');
      const result = await env.DB.prepare('INSERT INTO products (name, description, price, delivery_time, image_url, weight, width, height, length, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(product.name, product.description, product.price, product.delivery_time, product.image_url, product.weight, product.width, product.height, product.length, product.active).run();
      return json({ id: result.meta.last_row_id }, 201);
    }
    const uploadMatch = path.match(/^\/api\/admin\/products\/(\d+)\/images$/);
    if (uploadMatch && request.method === 'POST') {
      const productId = Number(uploadMatch[1]);
      const exists = await env.DB.prepare('SELECT id FROM products WHERE id=?').bind(productId).first();
      if (!exists) return error('Produto não encontrado.', 404);
      const current = await env.DB.prepare('SELECT COUNT(*) AS total FROM product_images WHERE product_id=?').bind(productId).first<{ total: number }>();
      const form = await request.formData();
      const files = form.getAll('images').filter((value): value is File => value instanceof File && value.size > 0);
      if (!files.length) return error('Selecione pelo menos uma imagem.');
      if (Number(current?.total || 0) + files.length > 8) return error('Cada produto pode ter no máximo 8 imagens.');
      const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
      for (const file of files) {
        if (!allowed.has(file.type)) return error('Use imagens JPG, PNG ou WEBP.');
        if (file.size > 5 * 1024 * 1024) return error('Cada imagem pode ter no máximo 5 MB.');
      }
      let position = Number(current?.total || 0);
      for (const file of files) {
        const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
        const key = `products/${productId}/${crypto.randomUUID()}.${extension}`;
        await env.PRODUCT_IMAGES.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { originalName: file.name } });
        await env.DB.prepare('INSERT INTO product_images (product_id, object_key, position) VALUES (?, ?, ?)').bind(productId, key, position++).run();
      }
      return json({ ok: true }, 201);
    }
    const imageMatch = path.match(/^\/api\/admin\/products\/(\d+)\/images\/(\d+)$/);
    if (imageMatch && request.method === 'DELETE') {
      const image = await env.DB.prepare('SELECT object_key FROM product_images WHERE id=? AND product_id=?').bind(Number(imageMatch[2]), Number(imageMatch[1])).first<{ object_key: string }>();
      if (!image) return error('Imagem não encontrada.', 404);
      await env.PRODUCT_IMAGES.delete(image.object_key);
      await env.DB.prepare('DELETE FROM product_images WHERE id=?').bind(Number(imageMatch[2])).run();
      return json({ ok: true });
    }
    const match = path.match(/^\/api\/admin\/products\/(\d+)$/); if (!match) return error('Rota não encontrada.', 404);
    const id = Number(match[1]);
    if (request.method === 'PUT') {
      const product = validateProduct(await request.json<ProductInput>()); if (!product) return error('Revise os dados do produto.');
      await env.DB.prepare('UPDATE products SET name=?, description=?, price=?, delivery_time=?, image_url=?, weight=?, width=?, height=?, length=?, active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(product.name, product.description, product.price, product.delivery_time, product.image_url, product.weight, product.width, product.height, product.length, product.active, id).run();
      return json({ ok: true });
    }
    if (request.method === 'DELETE') {
      const images = await env.DB.prepare('SELECT object_key FROM product_images WHERE product_id=?').bind(id).all<{ object_key: string }>();
      const keys = (images.results || []).map(image => image.object_key);
      if (keys.length) await env.PRODUCT_IMAGES.delete(keys);
      await env.DB.prepare('DELETE FROM product_images WHERE product_id=?').bind(id).run();
      await env.DB.prepare('DELETE FROM products WHERE id=?').bind(id).run();
      return json({ ok: true });
    }
  }
  return error('Rota não encontrada.', 404);
}

async function shippingQuote(request: Request, env: Env) {
  if (!env.MELHOR_ENVIO_TOKEN || !env.ORIGIN_CEP) return error('O cálculo de frete ainda não foi configurado.', 503);
  const body = await request.json<{ productId?: number; cep?: string }>().catch(() => ({})); const cep = cleanCep(body.cep);
  if (!/^\d{8}$/.test(cep)) return error('Informe um CEP válido com 8 números.');
  const product = await env.DB.prepare('SELECT id, name, price, weight, width, height, length FROM products WHERE id=? AND active=1').bind(Number(body.productId)).first<Record<string, number | string>>();
  if (!product) return error('Produto não encontrado.', 404);
  const response = await fetch(`${env.ME_BASE_URL || 'https://melhorenvio.com.br'}/api/v2/me/shipment/calculate`, {
    method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${env.MELHOR_ENVIO_TOKEN}`, 'User-Agent': 'Vision3D (contato via vision3d.gh)' },
    body: JSON.stringify({ from: { postal_code: cleanCep(env.ORIGIN_CEP) }, to: { postal_code: cep }, products: [{ id: String(product.id), width: product.width, height: product.height, length: product.length, weight: product.weight, insurance_value: product.price, quantity: 1 }] }),
  });
  const data = await response.json() as Array<Record<string, unknown>> | { message?: string };
  if (!response.ok || !Array.isArray(data)) return error('Não foi possível consultar o frete agora.', 502);
  const quotes = data.filter(item => !item.error && item.price).map(item => ({ id: item.id, name: item.name, company: (item.company as { name?: string })?.name || 'Transportadora', price: item.custom_price || item.price, deliveryTime: item.custom_delivery_time || item.delivery_time })).slice(0, 8);
  return json({ quotes });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) return await handleApi(request, env);
      return env.ASSETS.fetch(request);
    } catch (caught) {
      console.error(caught); return error('Erro interno do servidor.', 500);
    }
  },
};
