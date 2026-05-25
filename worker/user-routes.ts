import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProductEntity, BranchEntity, SaleEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // BRANCHES
  app.get('/api/branches', async (c) => {
    await BranchEntity.ensureSeed(c.env);
    const page = await BranchEntity.list(c.env);
    return ok(c, page.items);
  });
  // PRODUCTS
  app.get('/api/products', async (c) => {
    await ProductEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ProductEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : 50);
    return ok(c, page);
  });
  app.get('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const product = new ProductEntity(c.env, id);
    if (!await product.exists()) return notFound(c, 'Product not found');
    return ok(c, await product.getState());
  });
  app.post('/api/products', async (c) => {
    const data = await c.req.json();
    if (!data.name || !data.sku) return bad(c, 'name and sku required');
    const product = await ProductEntity.create(c.env, { 
      ...data, 
      id: data.id || crypto.randomUUID() 
    });
    return ok(c, product);
  });
  // SALES
  app.get('/api/sales', async (c) => {
    await SaleEntity.ensureSeed(c.env);
    const page = await SaleEntity.list(c.env);
    // Sort by latest first
    const sorted = page.items.sort((a, b) => b.timestamp - a.timestamp);
    return ok(c, { ...page, items: sorted });
  });
  app.post('/api/sales', async (c) => {
    const data = await c.req.json();
    if (!data.items?.length) return bad(c, 'items required');
    // Create sale record
    const sale = await SaleEntity.create(c.env, {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    });
    // Simple stock decrement (in a real app, this would be atomic per product)
    for (const item of data.items) {
      const prod = new ProductEntity(c.env, item.productId);
      if (await prod.exists()) {
        await prod.mutate(s => ({
          ...s,
          totalStock: Math.max(0, s.totalStock - item.quantity)
        }));
      }
    }
    return ok(c, sale);
  });
}