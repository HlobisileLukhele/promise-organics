const TermsAndConditions = () => {
  return (
    <section className="bg-[#faf8f5] dark:bg-[#0f1f17] min-h-screen py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-[#7d9b7a] dark:text-[#7a9e85] uppercase tracking-widest mb-2">
              Promise Organics
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">
              Terms &amp; Conditions
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#7d9b7a] to-[#c8a882] rounded-full mb-4" />
            <p className="text-sm text-[#3d4d3d]/60 dark:text-[#7a9e85] italic">
              Effective Date: 20 March 2025
            </p>
          </div>

          {/* Intro */}
          <div className="prose-section mb-8">
            <p className="text-base leading-relaxed text-[#3d4d3d] dark:text-[#c8dece]">
              Welcome to Promise Organics. By accessing or placing an order on our website (www.promiseorganics.co.za),
              you agree to be bound by these Terms &amp; Conditions. Please read them carefully before using our site
              or making a purchase. These terms are governed by the laws of the Republic of South Africa, including
              the Consumer Protection Act 68 of 2008 (CPA) and the Electronic Communications and Transactions Act
              25 of 2002 (ECTA).
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">

            {/* 1. General */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">1. General</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>These Terms &amp; Conditions apply to all visitors, users, and customers of Promise Organics.</li>
                <li>Promise Organics reserves the right to update or amend these terms at any time. Continued use of the website after any changes constitutes acceptance of the revised terms.</li>
                <li>By placing an order, you confirm that you are at least 18 years of age or have the consent of a parent or legal guardian.</li>
              </ul>
            </div>

            {/* 2. Products */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">2. Products</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>All products listed on our website are subject to availability. We reserve the right to limit quantities or discontinue any product without notice.</li>
                <li>Product images are for illustrative purposes only. Colour and appearance may vary slightly due to photography and screen settings.</li>
                <li>We take great care to describe our products accurately. However, we do not warrant that product descriptions are entirely error-free.</li>
                <li>All products are formulated for haircare use only. Please read all ingredient lists and usage instructions before use.</li>
              </ul>
            </div>

            {/* 3. Pricing & Payment */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">3. Pricing &amp; Payment</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>All prices are listed in South African Rand (ZAR) and are inclusive of VAT where applicable.</li>
                <li>Prices are subject to change without prior notice. The price applicable to your order is the price displayed at the time of checkout.</li>
                <li>We accept payment via the methods listed on checkout, processed securely through PayFast. Your payment information is never stored on our servers.</li>
                <li>In the event of a pricing error, we reserve the right to cancel the order and issue a full refund.</li>
              </ul>
            </div>

            {/* 4. Order Processing */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">4. Order Processing</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion.</li>
                <li>Once your order is placed, you will receive an email confirmation. This does not constitute acceptance — acceptance occurs when the order is dispatched.</li>
                <li>Orders are typically processed within 1–3 business days, excluding public holidays.</li>
              </ul>
            </div>

            {/* 5. Shipping & Delivery */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">5. Shipping &amp; Delivery</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>We ship within South Africa. Delivery times vary depending on your location and the courier used.</li>
                <li>Estimated delivery timelines are provided at checkout and are not guaranteed. Delays caused by couriers, customs, or circumstances beyond our control do not entitle you to a refund of shipping fees.</li>
                <li>Risk of loss or damage passes to you upon delivery. However, see Section 6 for our policy on damaged goods received.</li>
                <li>We are not responsible for incorrect delivery addresses provided by the customer.</li>
              </ul>
            </div>

            {/* 6. Refunds */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-4">6. Refunds</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[#3d4d3d] dark:text-[#f0f7f2] mb-2">6.1 Damaged on Arrival</h3>
                  <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                    If your product arrives damaged — meaning the damage occurred before or during delivery and not through
                    any fault of your own — you are entitled to a full refund or replacement, at your election. This right
                    is unconditional.
                  </p>
                  <p className="text-base font-medium text-[#3d4d3d] dark:text-[#f0f7f2] mb-2">To qualify for a damaged-goods refund:</p>
                  <ol className="space-y-2 list-decimal list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                    <li>Report the damage to us within 48 hours of receiving your order.</li>
                    <li>Email us at <a href="mailto:sales@promiseorganics.co.za" className="text-[#7d9b7a] dark:text-[#7a9e85] hover:underline">sales@promiseorganics.co.za</a> with your order number, a clear description of the damage, and at least two photographs clearly showing the damaged product and packaging.</li>
                    <li>Do not use the product. Refunds will not be issued for products that have been partially or fully used, even if damaged.</li>
                    <li>We will assess your claim within 3 business days and notify you of the outcome.</li>
                  </ol>
                  <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mt-3">
                    Approved refunds will be processed back to your original payment method within 7–10 business days.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#3d4d3d] dark:text-[#f0f7f2] mb-2">6.2 What Is Not Covered</h3>
                  <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                    <li>Products that have been opened, used, or tampered with after delivery (unless a separate manufacturing defect claim applies).</li>
                    <li>Minor cosmetic damage to outer packaging that does not affect the product inside.</li>
                    <li>Damage arising from improper storage or handling after delivery.</li>
                    <li>Dissatisfaction with scent, texture, or results — please consult our product descriptions and ingredient lists before purchase.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#3d4d3d] dark:text-[#f0f7f2] mb-2">6.3 Change of Mind</h3>
                  <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                    We do not offer refunds for change-of-mind purchases. All sales are final once dispatched, subject to
                    the cancellation policy in Section 7. This is consistent with industry norms for perishable and
                    personal care products under the Consumer Protection Act.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Order Cancellations */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">7. Order Cancellations</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-4">
                You may request to cancel your order before it is dispatched. Cancellations are subject to the following
                charges, which reflect the processing and handling costs we incur regardless of fulfilment:
              </p>
              <ul className="space-y-3 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-4">
                <li><span className="font-semibold">Cancellation within 1 hour of placing the order:</span> No charge — full refund issued.</li>
                <li><span className="font-semibold">Cancellation 1–24 hours after placing the order:</span> 10% cancellation fee deducted from the refund to cover payment processing costs.</li>
                <li><span className="font-semibold">Cancellation 24–48 hours after placing the order (order not yet dispatched):</span> 15% cancellation fee deducted from the refund.</li>
                <li><span className="font-semibold">Cancellation after dispatch:</span> Not possible. Once an order has been dispatched, it cannot be cancelled. You may refuse delivery, but return shipping costs and a 20% restocking fee will apply. Refunds will only be issued once the product is returned to us in its original, unopened condition.</li>
              </ul>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                To request a cancellation, email us at{' '}
                <a href="mailto:sales@promiseorganics.co.za" className="text-[#7d9b7a] dark:text-[#7a9e85] hover:underline">
                  sales@promiseorganics.co.za
                </a>{' '}
                with your order number and the subject line: <span className="font-semibold">ORDER CANCELLATION</span>.
              </p>
              <p className="text-sm text-[#3d4d3d]/60 dark:text-[#7a9e85] italic leading-relaxed">
                These cancellation terms are standard practice across South African and international haircare e-commerce
                platforms. They reflect the costs associated with perishable personal care inventory and payment gateway fees.
              </p>
            </div>

            {/* 8. Intellectual Property */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">8. Intellectual Property</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>All content on this website — including text, images, product formulations, branding, and logos — is the intellectual property of Promise Organics and may not be copied, reproduced, or distributed without express written consent.</li>
              </ul>
            </div>

            {/* 9. Limitation of Liability */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">9. Limitation of Liability</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>Promise Organics's liability is limited to the value of the product(s) purchased. We are not liable for any indirect, incidental, or consequential damages arising from the use of our products or website, to the extent permitted by South African law.</li>
                <li>Nothing in these terms limits your rights under the Consumer Protection Act 68 of 2008.</li>
              </ul>
            </div>

            {/* 10. Governing Law */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">10. Governing Law</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                These Terms &amp; Conditions are governed by the laws of the Republic of South Africa. Any disputes will
                be subject to the jurisdiction of the South African courts.
              </p>
            </div>

            {/* 11. Contact */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">11. Contact Us</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-2">
                For any questions, refund requests, or cancellations, please reach us at:
              </p>
              <ul className="space-y-1 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece]">
                <li>
                  Email:{' '}
                  <a href="mailto:sales@promiseorganics.co.za" className="text-[#7d9b7a] dark:text-[#7a9e85] hover:underline">
                    sales@promiseorganics.co.za
                  </a>
                </li>
                <li>Website: www.promiseorganics.co.za</li>
              </ul>
            </div>

          </div>

          {/* Footer note */}
          <div className="mt-12 pt-8 border-t border-[#c8a882]/20 dark:border-[#2d5a3d]">
            <p className="text-sm text-[#3d4d3d]/60 dark:text-[#7a9e85] italic text-center">
              Last updated: 20 March 2025
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;
