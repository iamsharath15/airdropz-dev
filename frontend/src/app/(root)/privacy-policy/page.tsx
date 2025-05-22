import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-semibold mb-2">Privacy Policy – Earn3</h1>
      <p className="text-sm text-zinc-400 mb-8">Last update: Apr 8, 2025</p>

      <p className="mb-6">
        We value your privacy and are committed to protecting your data while using Earn3.
      </p>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">1. Information We Collect</h2>
          <p className="text-zinc-300">
            We collect non-personal info such as IP address, browser type, and usage patterns to improve site performance and user experience.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">2. Cookies</h2>
          <p className="text-zinc-300">
            Earn3 uses cookies to remember preferences and optimize your journey. You can disable them in your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">3. Third–Party Services</h2>
          <p className="text-zinc-300">
            We may use third-party tools (e.g., analytics, ads) that collect usage data. Please refer to their privacy policies for details.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">4. Childrens Privacy</h2>
          <p className="text-zinc-300">
            Earn3 does not knowingly collect data from children under 13. If such data is found, we’ll promptly remove it.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">5. Data Usage</h2>
          <p className="text-zinc-300">
            Data is used to enhance your experience, track airdrop progress, and personalize content. We do not collect wallet keys or sensitive info.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">6. Your Consent</h2>
          <p className="text-zinc-300">
            By using Earn3, you agree to this Privacy Policy and the Terms of Use.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">Contact Us</h2>
          <p className="text-zinc-300">
            For questions, reach us at <a href="mailto:support@earn3.app" className="text-yellow-400 underline">support@earn3.app</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
