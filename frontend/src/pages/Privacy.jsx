import { motion } from "framer-motion";

function Privacy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-400 mb-6">
          Your privacy is important to us. This Privacy Policy explains how
          Fuel Consumption Analysis collects, uses, and protects your
          information.
        </p>

        {/* Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">
            1. Information We Collect
          </h2>
          <p className="text-gray-400">
            We may collect personal information such as name, email address,
            vehicle details, fuel usage data, and system usage statistics to
            improve our services.
          </p>
        </section>

        {/* Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">
            2. How We Use Your Data
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Analyze fuel consumption and efficiency</li>
            <li>Generate reports and predictions</li>
            <li>Improve system performance</li>
            <li>Provide customer support</li>
          </ul>
        </section>

        {/* Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">
            3. Data Security
          </h2>
          <p className="text-gray-400">
            We implement industry-standard security measures to protect your
            data from unauthorized access, alteration, or disclosure.
          </p>
        </section>

        {/* Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">
            4. Cookies
          </h2>
          <p className="text-gray-400">
            Our platform may use cookies to enhance user experience, analyze
            traffic, and personalize content.
          </p>
        </section>

        {/* Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">
            5. Third-Party Services
          </h2>
          <p className="text-gray-400">
            We may use trusted third-party services for analytics, authentication,
            and hosting. These services follow their own privacy policies.
          </p>
        </section>

        {/* Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">
            6. Changes to This Policy
          </h2>
          <p className="text-gray-400">
            We may update this Privacy Policy from time to time. Changes will
            be reflected on this page.
          </p>
        </section>

        {/* Section */}
        <section>
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">
            7. Contact Us
          </h2>
          <p className="text-gray-400">
            If you have any questions about this Privacy Policy, contact us at:
            <br />
            <span className="text-white font-medium">
              info@fuelanalysis.com
            </span>
          </p>
        </section>
      </motion.div>
    </div>
  );
}

export default Privacy;
