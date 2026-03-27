// Product controllers — public read access for the product catalogue.
import { supabase } from '../config/supabase.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, ingredients, directions')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, ingredients, directions')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
