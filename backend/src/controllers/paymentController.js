import { supabase }                              from '../config/supabase.js';
import { config }                               from '../config/env.js';
import { buildSignature, verifySignature, getPayfastUrl } from '../services/payfastService.js';

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

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be paid — current status is "${order.status}".`,
      });
    }

    // 2. Fetch user full_name from users table
    const { data: user } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', userId)
      .single();

    const nameParts = (user?.full_name ?? '').trim().split(/\s+/);
    const nameFirst = nameParts[0] || 'Customer';
    const nameLast  = nameParts.slice(1).join(' ') || undefined; // omit if empty

    // 3. Fetch billing info (optional — used for reference; PayFast doesn't require it in payload)
    const { data: billing } = await supabase
      .from('billing_info')
      .select('address, city, province, postal_code, phone')
      .eq('user_id', userId)
      .single();

    // 4. Build PayFast payload (field order matters for signature)
    const payload = {
      merchant_id:   config.payfast.merchantId,
      merchant_key:  config.payfast.merchantKey,
      return_url:    `${config.clientUrl}/payment/success`,
      cancel_url:    `${config.clientUrl}/payment/cancel`,
      notify_url:    `${config.backendUrl}/api/payment/webhook`,
      name_first:    nameFirst,
      ...(nameLast && { name_last: nameLast }),
      email_address: req.user.email,
      m_payment_id:  order.id,
      amount:        Number(order.total_amount).toFixed(2),
      item_name:     `Promise Organics Order`,
    };

    // 5. Generate MD5 signature and attach
    const signature = buildSignature(payload, config.payfast.passphrase);

    res.json({
      success: true,
      data: {
        payload:      { ...payload, signature },
        payfast_url:  getPayfastUrl(),
        billing_info: billing ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payment/webhook  (public — PayFast ITN)
export const handleWebhook = async (req, res, next) => {
  try {
    const { signature, ...params } = req.body;

    // 1. Verify MD5 signature
    if (!signature) {
      return res.status(400).send('Missing signature.');
    }

    let valid;
    try {
      valid = verifySignature(params, signature, config.payfast.passphrase);
    } catch {
      valid = false;
    }

    if (!valid) {
      return res.status(400).send('Invalid signature.');
    }

    const { payment_status, m_payment_id, pf_payment_id } = params;

    // 2. Handle COMPLETE payment
    if (payment_status === 'COMPLETE') {
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', m_payment_id);

      if (orderError) throw orderError;

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id:           m_payment_id,
          payfast_payment_id: pf_payment_id ?? null,
          status:             'complete',
        });

      if (paymentError) throw paymentError;
    }

    // PayFast expects a 200 response — no body required
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
