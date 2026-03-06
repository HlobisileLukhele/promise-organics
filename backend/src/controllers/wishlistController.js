import { supabase } from '../config/supabase.js';

// GET /api/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
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

// POST /api/wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'product_id is required.' });
    }

    // Ignore if already in wishlist (unique constraint), return existing row
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id, product_id')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      return res.status(200).json({ success: true, data: existing, message: 'Already in wishlist.' });
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({ user_id: req.user.id, product_id })
      .select('id, product_id')
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/wishlist/:id
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { error, count } = await supabase
      .from('wishlist_items')
      .delete({ count: 'exact' })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    if (count === 0) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found.' });
    }

    res.json({ success: true, message: 'Item removed from wishlist.' });
  } catch (err) {
    next(err);
  }
};
