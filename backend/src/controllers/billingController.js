// Billing controllers — fetch and upsert a single billing address record per user.
import { supabase } from '../config/supabase.js';

// GET /api/billing
export const getBilling = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('billing_info')
      .select('id, address, city, province, postal_code, phone')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found

    res.json({ success: true, data: data ?? null });
  } catch (err) {
    next(err);
  }
};

// POST /api/billing
export const saveBilling = async (req, res, next) => {
  try {
    const { address, city, province, postal_code, phone } = req.body;

    if (!address || !city || !province || !postal_code) {
      return res.status(400).json({
        success: false,
        message: 'address, city, province and postal_code are required.',
      });
    }

    // Upsert on user_id — one billing record per user
    const { data, error } = await supabase
      .from('billing_info')
      .upsert(
        { user_id: req.user.id, address, city, province, postal_code, phone },
        { onConflict: 'user_id' }
      )
      .select('id, address, city, province, postal_code, phone')
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
