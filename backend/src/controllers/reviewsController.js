// Reviews controllers — submit, list approved reviews, and mark reviews as helpful.
import { supabase } from '../config/supabase.js';

// POST /api/reviews
export const submitReview = async (req, res) => {
  const { name, rating, message, product_id, user_id, images } = req.body;

  if (!name?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: 'Name and message are required.' });
  }

  const parsedRating = Number(rating);
  if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
  }

  const { error } = await supabase.from('reviews').insert({
    name:        name.trim(),
    email:       null,
    rating:      parsedRating,
    title:       null,
    message:     message.trim(),
    product_id:  product_id || null,
    user_id:     user_id    || null,
    is_approved: false,
    images:      Array.isArray(images) && images.length > 0 ? images : null,
  });

  if (error) {
    console.error('Review insert error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to submit review' });
  }

  res.json({ success: true, message: 'Review submitted! It will appear after approval.' });
};

// GET /api/reviews
export const getReviews = async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Review fetch error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }

  res.json({ success: true, reviews: data });
};

// POST /api/reviews/:id/helpful
export const applaudReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  // Insert — will fail on unique constraint if already applauded
  const { error: insertError } = await supabase
    .from('review_helpful')
    .insert({ review_id: id, user_id: userId });

  if (insertError) {
    // Already applauded — return current count
    const { data: current } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', id)
      .single();
    return res.json({ success: true, helpful_count: current?.helpful_count || 0 });
  }

  // Fetch current count then increment
  const { data: review } = await supabase
    .from('reviews')
    .select('helpful_count')
    .eq('id', id)
    .single();

  const newCount = (review?.helpful_count || 0) + 1;

  await supabase
    .from('reviews')
    .update({ helpful_count: newCount })
    .eq('id', id);

  res.json({ success: true, helpful_count: newCount });
};
