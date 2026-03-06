-- Promise Organics — Supabase PostgreSQL Schema
-- ===========================================================


-- STEP 1: Drop policies
-- ============================================================
DROP POLICY IF EXISTS "users: select own row"             ON users;
DROP POLICY IF EXISTS "users: update own row"             ON users;
DROP POLICY IF EXISTS "products: public read"             ON products;
DROP POLICY IF EXISTS "cart_items: manage own rows"       ON cart_items;
DROP POLICY IF EXISTS "wishlist_items: manage own rows"   ON wishlist_items;
DROP POLICY IF EXISTS "billing_info: manage own rows"     ON billing_info;
DROP POLICY IF EXISTS "orders: select own rows"           ON orders;
DROP POLICY IF EXISTS "orders: insert own rows"           ON orders;
DROP POLICY IF EXISTS "order_items: select via own orders" ON order_items;
DROP POLICY IF EXISTS "payments: select own rows"         ON payments;


-- STEP 2: Drop triggers
-- ============================================================
DROP TRIGGER IF EXISTS trg_users_updated_at        ON users;
DROP TRIGGER IF EXISTS trg_products_updated_at     ON products;
DROP TRIGGER IF EXISTS trg_cart_items_updated_at   ON cart_items;
DROP TRIGGER IF EXISTS trg_billing_info_updated_at ON billing_info;
DROP TRIGGER IF EXISTS trg_orders_updated_at       ON orders;
DROP TRIGGER IF EXISTS trg_payments_updated_at     ON payments;


-- STEP 3: Drop tables in reverse dependency order
-- ============================================================
DROP TABLE IF EXISTS payments       CASCADE;
DROP TABLE IF EXISTS order_items    CASCADE;
DROP TABLE IF EXISTS orders         CASCADE;
DROP TABLE IF EXISTS billing_info   CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS cart_items     CASCADE;
DROP TABLE IF EXISTS products       CASCADE;
DROP TABLE IF EXISTS users          CASCADE;


-- STEP 4: Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



-- TABLE: users
-- ============================================================
CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT        UNIQUE NOT NULL,
  full_name     TEXT        NOT NULL,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: select own row"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users: update own row"
  ON users FOR UPDATE
  USING (auth.uid() = id);


-- TABLE: products
-- ============================================================
CREATE TABLE products (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT           NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock       INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url   TEXT
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products: public read"
  ON products FOR SELECT
  USING (true);


-- TABLE: cart_items
-- ============================================================
CREATE TABLE cart_items (
  id         UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID    NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),

  CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_items: manage own rows"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- TABLE: wishlist_items
-- ============================================================
CREATE TABLE wishlist_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  CONSTRAINT wishlist_items_user_product_unique UNIQUE (user_id, product_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlist_items: manage own rows"
  ON wishlist_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- TABLE: billing_info
-- ============================================================
CREATE TABLE billing_info (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  address     TEXT NOT NULL,
  city        TEXT NOT NULL,
  province    TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  phone       TEXT
);

ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "billing_info: manage own rows"
  ON billing_info FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- TABLE: orders
-- ============================================================
CREATE TABLE orders (
  id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID           REFERENCES users(id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status       TEXT           NOT NULL DEFAULT 'pending'
                              CHECK (status IN (
                                'pending', 'paid', 'processing',
                                'shipped', 'delivered', 'cancelled', 'refunded'
                              )),
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders: select own rows"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders: insert own rows"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- TABLE: order_items
-- ============================================================
CREATE TABLE order_items (
  id         UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID           NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id UUID                    REFERENCES products(id) ON DELETE SET NULL,
  quantity   INTEGER        NOT NULL CHECK (quantity > 0),
  price      NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items: select via own orders"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );


-- TABLE: payments
-- ============================================================
CREATE TABLE payments (
  id                 UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id           UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payfast_payment_id TEXT,
  status             TEXT        NOT NULL DEFAULT 'pending'
                                 CHECK (status IN (
                                   'pending', 'complete', 'failed', 'cancelled'
                                 )),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments: select own rows"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id
        AND orders.user_id = auth.uid()
    )
  );


-- INDEXES
-- ============================================================
CREATE INDEX idx_cart_items_user_id     ON cart_items(user_id);
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_orders_user_id         ON orders(user_id);
CREATE INDEX idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX idx_payments_order_id      ON payments(order_id);


-- SEED: products
-- ============================================================
INSERT INTO products (name, description, price, stock)
VALUES
  ('Promise Organics Butter',     'Natural hair butter infused with avocado and rosemary for deep nourishment.',        180.00, 50),
  ('Promise Organics Hair Oil',   'Lightweight organic oil blend that promotes hair growth and adds shine.',             150.00, 50),
  ('Promise Organics Shampoo',    'Sulphate-free shampoo that cleanses without stripping your hair''s natural oils.',   170.00, 50),
  ('Promise Organics Conditioner','Rich moisturising conditioner that softens and detangles for manageable hair.',      170.00, 50);
