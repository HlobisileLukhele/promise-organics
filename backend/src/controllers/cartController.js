// Cart controllers — add, update, remove, and fetch cart items for the authenticated user.
import { supabase } from '../config/supabase.js';

// GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:product_id (
          id,
          name,
          description,
          price,
          stock,
          image_url
        )
      `)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/cart
export const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'product_id is required.' });
    }
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be at least 1.' });
    }

    // Upsert: if (user_id, product_id) already exists, add to quantity
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    let data, error;

    if (existing) {
      ({ data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select('id, quantity, product_id')
        .single());
    } else {
      ({ data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: req.user.id, product_id, quantity })
        .select('id, quantity, product_id')
        .single());
    }

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/cart/:id
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ success: false, message: 'quantity is required.' });
    }
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be at least 1.' });
    }

    // Ensure the cart item belongs to the authenticated user
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select('id, quantity, product_id')
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/:id
export const removeFromCart = async (req, res, next) => {
  try {
    const { error, count } = await supabase
      .from('cart_items')
      .delete({ count: 'exact' })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    if (count === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    next(err);
  }
};
