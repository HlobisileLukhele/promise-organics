// Admin controllers — order management, product CRUD, review moderation, dashboard stats, and email diagnostics.
import { supabase } from '../config/supabase.js';
import nodemailer from 'nodemailer';

const VALID_ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const ALL_ORDER_STATUSES   = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────

// GET /api/admin/orders
export const getOrders = async (req, res) => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id, total_amount, status, created_at,
      users ( id, full_name, email ),
      order_items (
        id, quantity,
        products:product_id ( name )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Admin getOrders error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }

  // Batch-fetch phone numbers from billing_info for all users in one query
  const userIds = [...new Set(orders.map((o) => o.users?.id).filter(Boolean))];
  let billingMap = {};
  if (userIds.length > 0) {
    const { data: billings } = await supabase
      .from('billing_info')
      .select('user_id, phone')
      .in('user_id', userIds);
    billingMap = Object.fromEntries((billings || []).map((b) => [b.user_id, b]));
  }

  const shaped = orders.map((o) => {
    const billing = billingMap[o.users?.id];
    return {
      ...o,
      customer_name:  o.users?.full_name || 'Guest',
      customer_email: o.users?.email     || '—',
      customer_phone: billing?.phone     || '—',
      order_items:    (o.order_items || []).map((i) => ({
        quantity: i.quantity,
        name:     i.products?.name || 'Unknown product',
      })),
      users: undefined,
    };
  });

  res.json({ success: true, orders: shaped });
};

// GET /api/admin/orders/:id
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id, total_amount, status, created_at, shipping_address, notes,
      users ( id, full_name, email ),
      order_items (
        id, quantity, price,
        products:product_id ( id, name, image_url )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Fetch billing_info for address details and phone (email comes from users table)
  let billing = null;
  if (order.users?.id) {
    const { data: billingData } = await supabase
      .from('billing_info')
      .select('address, city, province, postal_code, phone')
      .eq('user_id', order.users.id)
      .single();
    billing = billingData || null;
  }

  res.json({ success: true, order: { ...order, billing_info: billing } });
};

// PATCH /api/admin/orders/:id  (full edit: status, shipping_address, notes)
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, shipping_address, notes } = req.body;

    if (status && !ALL_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${ALL_ORDER_STATUSES.join(', ')}.`,
      });
    }

    // STEP 1: Fetch order to get user_id and order_number
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number, user_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !order) {
      console.error('Order fetch error:', fetchError?.message);
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // STEP 2: Fetch customer email separately (join on update is unreliable in Supabase)
    let user = null;
    if (order.user_id) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', order.user_id)
        .single();

      user = userData;
    }

    // STEP 3: Update the order
    const updateFields = {};
    if (status           !== undefined) updateFields.status           = status;
    if (shipping_address !== undefined) updateFields.shipping_address = shipping_address;
    if (notes            !== undefined) updateFields.notes            = notes;

    const { data: updated, error: updateError } = await supabase
      .from('orders')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Admin updateOrder error:', updateError.message);
      return res.status(500).json({ success: false, message: 'Failed to update order.' });
    }

    // STEP 4: Send email if status changed and customer email exists
    let emailResult = { sent: false, reason: 'no_status_change' };

    if (status && user?.email) {
      const orderNumber = order.order_number || id.slice(0, 8).toUpperCase();
      const fromAddress = process.env.EMAIL_USER;

      const statusMessages = {
        paid:       'Your payment has been confirmed! ✅',
        processing: 'Your order is now being prepared. 🌿',
        shipped:    'Great news — your order is on its way! 🚚',
        delivered:  'Your order has been delivered. We hope you love it! 🎉',
        cancelled:  'Your order has been cancelled.',
        refunded:   'Your refund has been processed successfully.',
      };

      const msg = statusMessages[status] || 'Your order status has been updated.';

      const mailOptions = {
        from:    `"Promise Organics" <${fromAddress}>`,
        to:      user.email,
        subject: `Order ${orderNumber} Update — ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;padding:40px 20px;color:#333;">
            <div style="text-align:center;margin-bottom:32px;border-bottom:2px solid #e8f0eb;padding-bottom:24px;">
              <h1 style="color:#2d5a3d;font-size:26px;margin:0 0 4px;">Promise Organics</h1>
              <p style="color:#9aab9e;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0;">Order Update</p>
            </div>
            <p style="color:#4a5568;font-size:15px;">Hi ${user.full_name || 'there'},</p>
            <div style="background:#f7faf8;border-left:4px solid #4a7c59;border-radius:8px;padding:20px 24px;margin:20px 0;">
              <p style="margin:0 0 12px;color:#1a3d28;font-size:16px;font-weight:bold;">${msg}</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="color:#9aab9e;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 0;">Order Number</td>
                  <td style="color:#1a3d28;font-weight:bold;font-size:18px;text-align:right;">${orderNumber}</td>
                </tr>
                <tr>
                  <td style="color:#9aab9e;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 0;">New Status</td>
                  <td style="color:#4a7c59;font-weight:bold;text-transform:capitalize;text-align:right;">${status}</td>
                </tr>
              </table>
            </div>
            <p style="color:#718096;font-size:14px;line-height:1.6;">
              If you have any questions, reply to this email or reach us at
              <a href="${fromAddress}" style="color:#4a7c59;">${fromAddress}</a>
            </p>
            <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e8f0eb;text-align:center;">
              <p style="color:#9aab9e;font-size:12px;margin:0;">Promise Organics · ${fromAddress} · +27 79 616 1262</p>
              <p style="color:#c8dece;font-size:11px;font-style:italic;margin:6px 0 0;">Nourishing hair, naturally. 🌿</p>
            </div>
          </div>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        emailResult = { sent: true, to: user.email, messageId: info.messageId };
      } catch (emailErr) {
        console.error('❌ Email failed:', {
          message:      emailErr.message,
          code:         emailErr.code,
          response:     emailErr.response,
          responseCode: emailErr.responseCode,
        });
        emailResult = {
          sent:     false,
          reason:   'smtp_error',
          error:    emailErr.message,
          code:     emailErr.code,
          response: emailErr.response,
        };
      }
    } else if (!user?.email) {
      console.warn('⚠️ No customer email found for order:', order.order_number || id.slice(0, 8));
      emailResult = { sent: false, reason: 'no_customer_email' };
    }

    // STEP 5: Respond
    return res.json({ success: true, order: updated, email: emailResult });

  } catch (err) {
    console.error('updateOrder unexpected error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/orders/:id
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  const { error: itemsError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', id);

  if (itemsError) {
    console.error('Admin deleteOrder items error:', itemsError.message);
    return res.status(500).json({ success: false, message: 'Failed to delete order items.' });
  }

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Admin deleteOrder error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete order.' });
  }

  res.json({ success: true });
};

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}.`,
    });
  }

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Admin updateOrderStatus error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }

  res.json({ success: true, message: 'Order status updated.' });
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

// GET /api/admin/products
export const getProducts = async (req, res) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Admin getProducts error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }

  res.json({ success: true, products });
};

// POST /api/admin/products
export const createProduct = async (req, res) => {
  const { name, description, price, stock, image_url, category, sku, in_stock } = req.body;

  if (!name?.trim() || price === undefined) {
    return res.status(400).json({ success: false, message: 'name and price are required.' });
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name:        name.trim(),
      description: description?.trim() || null,
      price:       parseFloat(price),
      stock:       parseInt(stock) || 0,
      image_url:   image_url || null,
      category:    category  || null,
      sku:         sku        || null,
      in_stock:    in_stock !== undefined ? Boolean(in_stock) : true,
    })
    .select()
    .single();

  if (error) {
    console.error('Admin createProduct error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }

  res.status(201).json({ success: true, product });
};

// PATCH /api/admin/products/:id
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const fields  = req.body;

  if (fields.price !== undefined) fields.price = parseFloat(fields.price);
  if (fields.stock !== undefined) fields.stock = parseInt(fields.stock);

  const { data: product, error } = await supabase
    .from('products')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Admin updateProduct error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }

  res.json({ success: true, product });
};

// PATCH /api/admin/products/:id/stock
export const updateStock = async (req, res) => {
  const { id } = req.params;
  const { in_stock, stock } = req.body;

  const update = {};
  if (in_stock !== undefined) update.in_stock = Boolean(in_stock);
  if (stock    !== undefined) update.stock    = parseInt(stock);

  const { error } = await supabase
    .from('products')
    .update(update)
    .eq('id', id);

  if (error) {
    console.error('Admin updateStock error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update stock.' });
  }

  res.json({ success: true, message: 'Stock updated.' });
};

// DELETE /api/admin/products/:id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Admin deleteProduct error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }

  res.json({ success: true, message: 'Product deleted.' });
};

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

// GET /api/admin/reviews
export const getReviews = async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  res.json({ success: true, reviews: data });
};

// PATCH /api/admin/reviews/:id/approve
export const approveReview = async (req, res) => {
  const { error } = await supabase
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ success: false, message: 'Failed to approve review.' });
  res.json({ success: true, message: 'Review approved.' });
};

// PATCH /api/admin/reviews/:id/reject
export const rejectReview = async (req, res) => {
  const { error } = await supabase
    .from('reviews')
    .update({ is_approved: false })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ success: false, message: 'Failed to reject review.' });
  res.json({ success: true, message: 'Review rejected.' });
};

// DELETE /api/admin/reviews/:id
export const deleteReview = async (req, res) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ success: false, message: 'Failed to delete review.' });
  res.json({ success: true, message: 'Review deleted.' });
};

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

// GET /api/admin/stats
export const getStats = async (req, res) => {
  const [
    { count: totalOrders },
    { data: revenueData },
    { data: ordersByStatus },
    { count: totalCustomers },
    { count: totalProducts },
    { data: lowStockProducts },
    { count: pendingReviews },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').neq('status', 'cancelled'),
    supabase.from('orders').select('status'),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('id, name, stock').lt('stock', 5),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
  ]);

  const totalRevenue = (revenueData || []).reduce(
    (sum, o) => sum + parseFloat(o.total_amount || 0), 0
  );

  const statusCounts = (ordersByStatus || []).reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    stats: {
      total_orders:      totalOrders    ?? 0,
      total_revenue:     parseFloat(totalRevenue.toFixed(2)),
      orders_by_status:  statusCounts,
      total_customers:   totalCustomers ?? 0,
      total_products:    totalProducts  ?? 0,
      low_stock_products: lowStockProducts || [],
      pending_reviews:   pendingReviews ?? 0,
    },
  });
};

// ─── TEST EMAIL ───────────────────────────────────────────────────────────────

// GET /api/admin/test-email
export const testEmail = async (req, res) => {
  try {
    const testTransporter = nodemailer.createTransport({
      host:   'smtp.zoho.com',
      port:   465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug:  true,
      logger: true,
    });

    await testTransporter.verify();

    const info = await testTransporter.sendMail({
      from:    `"Promise Organics" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_USER,
      subject: 'Test Email from Promise Organics Backend',
      text:    'If you see this, email is working!',
    });

    // TODO: emailUser exposes the configured SMTP address — consider removing before going live.
    return res.json({
      success:      true,
      messageId:    info.messageId,
      emailUser:    process.env.EMAIL_USER,
      emailPassSet: !!process.env.EMAIL_PASS,
    });
  } catch (err) {
    console.error('❌ SMTP ERROR:', {
      message:      err.message,
      code:         err.code,
      response:     err.response,
      responseCode: err.responseCode,
    });
    // TODO: error, code, response, and emailUser expose SMTP internals — scope access to admin-only or remove before going live.
    return res.status(500).json({
      success:      false,
      error:        err.message,
      code:         err.code,
      response:     err.response,
      emailUser:    process.env.EMAIL_USER,
      emailPassSet: !!process.env.EMAIL_PASS,
    });
  }
};
