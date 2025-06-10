'use client';

import { motion } from 'framer-motion';

const TrustIndicators = () => {
  const companies = [
    { name: 'Google', logo: 'Google' },
    { name: 'NYU Bank', logo: 'Bank' },
    { name: 'Hello Fresh', logo: 'Fresh' },
    { name: 'Coca Cola', logo: 'Cola' },
    { name: 'Ogilvy', logo: 'Ogilvy' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8  bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-extrabold leading-snug tracking-tight max-w-4xl mx-auto text-white"
          >
            You hunt the airdrops. <br />
            <span className="text-purple-400">We help you win more.</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Join 600,000+ Web3 explorers, builders, and degens on Airdropz.
          </motion.p>
        </motion.div>

        {/* Trusted Companies Logos */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60"
        >
          {companies.map((company) => (
            <motion.div
              key={company.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                opacity: 1,
                transition: { duration: 0.2 },
              }}
              className="text-xl md:text-2xl font-semibold text-muted-foreground hover:text-white transition-colors duration-300 cursor-pointer"
              aria-label={`Trusted by ${company.name}`}
            >
              {company.logo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustIndicators;
