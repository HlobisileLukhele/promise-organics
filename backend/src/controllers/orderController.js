import { supabase } from '../config/supabase.js';

// POST /api/orders
// Reads the user's cart, creates an order + order_items, then clears the cart
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Fetch the user's current cart joined with product details
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:product_id (
          id,
          name,
          price,
          stock,
          image_url
        )
      `)
      .eq('user_id', userId);

    if (cartError) throw cartError;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    // 2. Calculate total amount
    const total_amount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 3. Insert the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, total_amount, status: 'pending' })
      .select('id, user_id, total_amount, status, created_at')
      .single();

    if (orderError) throw orderError;

    // 4. Build order_items rows from cart (matches schema: id, order_id, product_id, quantity, price)
    const orderItems = cartItems.map((item) => ({
      order_id:   order.id,
      product_id: item.product.id,
      quantity:   item.quantity,
      price:      item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 5. Clear the user's cart
    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (clearError) throw clearError;

    res.status(201).json({ success: true, data: { order_id: order.id, ...order } });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders
export const getUserOrders = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch order — enforce ownership via user_id filter
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Fetch order items for this order
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('id, product_id, quantity, price')
      .eq('order_id', order.id);

    if (itemsError) throw itemsError;

    res.json({ success: true, data: { ...order, items } });
  } catch (err) {
    next(err);
  }
};
