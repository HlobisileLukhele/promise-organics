// Payment controllers — initiate a PayFast payment and handle the ITN webhook callback.
import { supabase }                                                    from '../config/supabase.js';
import { buildPayfastPayload, getPayfastUrl, verifyWebhookSignature } from '../services/payfastService.js';

// POST /api/payment/initiate  (protected)
export const initiatePayment = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const userId = req.user.id;

    if (!order_id) {
      return res.status(400).json({ success: false, message: 'order_id is required.' });
    }

    // 1. Fetch order — enforce ownership
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, status')
      .eq('id', order_id)
      .eq('user_id', userId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Order already paid.' });
    }

    // 2. Fetch billing info (optional)
    const { data: billingInfo } = await supabase
      .from('billing_info')
      .select('address, city, province, postal_code, phone')
      .eq('user_id', userId)
      .single();

    // 3. Fetch user name
    const { data: user } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', userId)
      .single();

    const fullUser = {
      full_name: user?.full_name ?? '',
      email:     req.user.email,
    };

    // 4. Build PayFast payload with signature
    const payload = buildPayfastPayload(order, billingInfo ?? null, fullUser);

    res.json({
      success:     true,
      payfastUrl:  getPayfastUrl(),
      payload,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payment/webhook  (public — PayFast ITN)
export const handleWebhook = async (req, res, next) => {
  try {
    const data = req.body;

    // 1. Verify MD5 signature
    const valid = verifyWebhookSignature(data, process.env.PAYFAST_PASSPHRASE || '');
    if (!valid) {
      return res.status(400).send('Invalid signature.');
    }

    const { payment_status, m_payment_id: orderId, pf_payment_id, amount_gross } = data;

    // 2. Handle COMPLETE
    if (payment_status === 'COMPLETE') {
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      if (orderError) throw orderError;

      const { error: paymentError } = await supabase
        .from('payments')
        .upsert({
          order_id:           orderId,
          payfast_payment_id: pf_payment_id ?? null,
          status:             'complete',
          amount:             amount_gross ?? null,
          updated_at:         new Date().toISOString(),
        }, { onConflict: 'order_id' });

      if (paymentError) throw paymentError;
    }

    // 3. Handle FAILED or CANCELLED
    if (payment_status === 'FAILED' || payment_status === 'CANCELLED') {
      const paymentRecordStatus = payment_status === 'FAILED' ? 'failed' : 'cancelled';

      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);

      await supabase.from('payments').upsert({
        order_id:           orderId,
        payfast_payment_id: pf_payment_id ?? null,
        status:             paymentRecordStatus,
        amount:             amount_gross ?? null,
        updated_at:         new Date().toISOString(),
      }, { onConflict: 'order_id' });
    }

    // Always return 200 to PayFast to prevent retries
    res.sendStatus(200);
  } catch (err) {
    // Still return 200 to prevent PayFast from retrying on server errors
    console.error('Webhook error:', err.message);
    res.sendStatus(200);
  }
};
