const PrivacyPolicy = () => {
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
              Privacy Policy
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#7d9b7a] to-[#c8a882] rounded-full mb-4" />
            <p className="text-sm text-[#3d4d3d]/60 dark:text-[#7a9e85] italic">
              Effective Date: 20 March 2025
            </p>
          </div>

          {/* Intro */}
          <div className="mb-8">
            <p className="text-base leading-relaxed text-[#3d4d3d] dark:text-[#c8dece]">
              Promise Organics ("we", "us", "our") is committed to protecting your personal information. This Privacy
              Policy explains what data we collect, why we collect it, how we use and protect it, and your rights in
              relation to it. This policy is compliant with the Protection of Personal Information Act 4 of 2013 (POPIA)
              and applies to all personal information processed through our website, www.promiseorganics.co.za.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">

            {/* 1. Who We Are */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">1. Who We Are</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                Promise Organics is a South African organic haircare brand operating through our e-commerce platform at
                www.promiseorganics.co.za. We act as the Responsible Party in terms of POPIA for all personal
                information processed through our platform.
              </p>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece]">
                Contact:{' '}
                <a href="mailto:sales@promiseorganics.co.za" className="text-[#7d9b7a] dark:text-[#7a9e85] hover:underline">
                  sales@promiseorganics.co.za
                </a>
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-4">2. Information We Collect</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-[#3d4d3d] dark:text-[#f0f7f2] mb-2">2.1 Information You Provide</h3>
                  <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                    <li>Full name, email address, phone number, and delivery address when placing an order or creating an account.</li>
                    <li>Payment information — processed directly by PayFast. We never receive, store, or have access to your full card details.</li>
                    <li>Messages and enquiries submitted through the contact form.</li>
                    <li>Email address if you subscribe to our newsletter or waitlist.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#3d4d3d] dark:text-[#f0f7f2] mb-2">2.2 Information Collected Automatically</h3>
                  <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                    <li>IP address, browser type, device type, and operating system.</li>
                    <li>Pages visited, time spent on site, and referral sources (via analytics tools).</li>
                    <li>Cookies and similar tracking technologies — see Section 7.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#3d4d3d] dark:text-[#f0f7f2] mb-2">2.3 Information We Do Not Collect</h3>
                  <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                    <li>We do not collect or store payment card numbers, CVVs, or banking details.</li>
                    <li>We do not collect sensitive personal information such as race, health records, or biometric data.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. How We Use Your Information */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">3. How We Use Your Information</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                We use your personal information for the following purposes:
              </p>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>To process and fulfil your orders, including delivery and payment confirmation.</li>
                <li>To send transactional emails — order confirmations, shipping updates, and refund notifications.</li>
                <li>To respond to your enquiries submitted via the contact form.</li>
                <li>To send marketing communications if you have opted in. You may unsubscribe at any time.</li>
                <li>To improve our website, detect fraud, and ensure security of our platform.</li>
                <li>To comply with legal obligations under South African law.</li>
              </ul>
            </div>

            {/* 4. Legal Basis for Processing */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">4. Legal Basis for Processing</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                We process your personal information on one or more of the following grounds:
              </p>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li><span className="font-semibold">Performance of a contract:</span> to fulfil your order.</li>
                <li><span className="font-semibold">Legitimate interest:</span> to operate and improve our business securely.</li>
                <li><span className="font-semibold">Consent:</span> for marketing communications (which you may withdraw at any time).</li>
                <li><span className="font-semibold">Legal obligation:</span> to comply with applicable South African laws.</li>
              </ul>
            </div>

            {/* 5. How We Store & Protect Your Information */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">5. How We Store &amp; Protect Your Information</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li>Your personal data is stored securely on Supabase (PostgreSQL), hosted within a secure cloud environment.</li>
                <li>All data is encrypted in transit using TLS/HTTPS. Data at rest is encrypted at the database level.</li>
                <li>Access to your personal information is restricted to authorised personnel only.</li>
                <li>We retain your order information for a minimum of 5 years for accounting and legal compliance purposes. Newsletter subscriber data is retained until you unsubscribe.</li>
                <li>We do not store any payment credentials on our servers. All card transactions are processed by PayFast, a PCI-DSS compliant payment gateway.</li>
              </ul>
            </div>

            {/* 6. Sharing Your Information */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">6. Sharing Your Information</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                We do not sell, rent, or trade your personal information. We may share it only in the following circumstances:
              </p>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                <li><span className="font-semibold">Service providers:</span> courier companies (for delivery), PayFast (for payment), Zoho (for transactional email) — each bound by their own privacy commitments and limited to the information necessary to perform their service.</li>
                <li><span className="font-semibold">Legal requirements:</span> where required to do so by law, court order, or governmental authority.</li>
                <li><span className="font-semibold">Business transfer:</span> in the unlikely event of a business sale or merger, your data may be transferred as part of that transaction. You will be notified in advance.</li>
              </ul>
            </div>

            {/* 7. Cookies */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">7. Cookies</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                We use cookies to improve your browsing experience. Cookies are small text files stored on your device.
                We use the following types:
              </p>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                <li><span className="font-semibold">Essential cookies:</span> required for the website and checkout to function correctly.</li>
                <li><span className="font-semibold">Analytics cookies:</span> to understand how visitors use our site (e.g. page views, session duration). These are anonymised where possible.</li>
                <li><span className="font-semibold">Marketing cookies:</span> only placed if you have consented to marketing communications.</li>
              </ul>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                You can manage or disable cookies in your browser settings. Disabling essential cookies may affect your
                ability to use the website or complete purchases.
              </p>
            </div>

            {/* 8. Your Rights Under POPIA */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">8. Your Rights Under POPIA</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                As a data subject under the Protection of Personal Information Act, you have the right to:
              </p>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                <li><span className="font-semibold">Access:</span> request a copy of the personal information we hold about you.</li>
                <li><span className="font-semibold">Correction:</span> request that inaccurate or incomplete information be corrected.</li>
                <li><span className="font-semibold">Deletion:</span> request that we delete your personal information, subject to legal retention requirements.</li>
                <li><span className="font-semibold">Objection:</span> object to the processing of your information for marketing purposes.</li>
                <li><span className="font-semibold">Withdrawal of consent:</span> withdraw any previously given consent at any time.</li>
                <li><span className="font-semibold">Complaint:</span> lodge a complaint with the Information Regulator of South Africa if you believe your rights have been violated.</li>
              </ul>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece]">
                To exercise any of these rights, contact us at:{' '}
                <a href="mailto:sales@promiseorganics.co.za" className="text-[#7d9b7a] dark:text-[#7a9e85] hover:underline">
                  sales@promiseorganics.co.za
                </a>
              </p>
            </div>

            {/* 9. Third-Party Links */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">9. Third-Party Links</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices
                of those sites and encourage you to review their privacy policies independently.
              </p>
            </div>

            {/* 10. Children's Privacy */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">10. Children's Privacy</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                Our website is not directed at children under the age of 18. We do not knowingly collect personal
                information from minors. If you believe a minor has provided us with personal information, please
                contact us immediately.
              </p>
            </div>

            {/* 11. Changes to This Policy */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">11. Changes to This Policy</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed">
                We may update this Privacy Policy from time to time. The revised policy will be posted on our website
                with an updated effective date. We encourage you to review it periodically.
              </p>
            </div>

            {/* 12. Contact & Complaints */}
            <div>
              <h2 className="text-lg font-bold text-[#3d4d3d] dark:text-[#f0f7f2] mb-3">12. Contact &amp; Complaints</h2>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-3">
                If you have any questions or concerns about this Privacy Policy or the way we handle your data, please
                contact us:
              </p>
              <ul className="space-y-1 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece] mb-4">
                <li>
                  Email:{' '}
                  <a href="mailto:sales@promiseorganics.co.za" className="text-[#7d9b7a] dark:text-[#7a9e85] hover:underline">
                    sales@promiseorganics.co.za
                  </a>
                </li>
                <li>Website: www.promiseorganics.co.za</li>
              </ul>
              <p className="text-base text-[#3d4d3d] dark:text-[#c8dece] leading-relaxed mb-2">
                You also have the right to lodge a complaint with the Information Regulator of South Africa:
              </p>
              <ul className="space-y-1 list-disc list-outside pl-5 text-base text-[#3d4d3d] dark:text-[#c8dece]">
                <li>Website: www.justice.gov.za/inforeg</li>
                <li>
                  Email:{' '}
                  <a href="mailto:inforeg@justice.gov.za" className="text-[#7d9b7a] dark:text-[#7a9e85] hover:underline">
                    inforeg@justice.gov.za
                  </a>
                </li>
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

export default PrivacyPolicy;
