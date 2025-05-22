import React from "react";

const TermsConditions = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-semibold mb-2">Terms & Conditions for Earn3</h1>
      <p className="text-sm text-zinc-400 mb-8">Last update: Apr 8, 2025</p>

      <div className="space-y-6">
        <p>
          These Website Standard Terms and Conditions shall govern your use of our platform, Earn3, accessible at{" "}
          <a href="https://www.earn3.app" className="text-yellow-400 underline">www.earn3.app</a>. By using our Website, you agree to comply with and be bound by these Terms.
        </p>

        <div>
          <h2 className="text-xl font-medium">Age Restriction</h2>
          <p className="text-zinc-300">
            You must be at least 18 years of age to use this Website. By using Earn3, you confirm that you meet this requirement.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">Intellectual Property Rights</h2>
          <p className="text-zinc-300">
            Other than the content you submit, Earn3 and/or its licensors own all intellectual property rights for the content and materials on this Website.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">Restrictions</h2>
          <ul className="list-disc list-inside text-zinc-300 space-y-1">
            <li>Republishing any Website material elsewhere</li>
            <li>Commercializing or selling Website content</li>
            <li>Publicly displaying Website material</li>
            <li>Using Earn3 in any way that harms or may harm the platform or its users</li>
            <li>Violating applicable laws or regulations</li>
            <li>Engaging in data mining, scraping, or similar activities</li>
            <li>Using the platform for unauthorized advertising or promotions</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-medium">No Warranties</h2>
          <p className="text-zinc-300">
            Earn3 is provided “as is.” We do not guarantee accuracy, availability, or functionality of the site or any content related to airdrops or token listings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">Limitation of Liability</h2>
          <p className="text-zinc-300">
            Earn3 and its team shall not be held liable for any damages, losses, or issues arising from the use or misuse of the Website or its content.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">Governing Law</h2>
          <p className="text-zinc-300">
            These Terms are governed by the laws of [Your Country or State], and any disputes shall be handled in its jurisdiction.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
