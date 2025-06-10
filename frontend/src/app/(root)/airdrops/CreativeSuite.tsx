
import { motion } from 'framer-motion';

const CreativeSuite = () => {
  const categories = [
    'Social media',
    'Advertising', 
    'Video creation',
    'Photography',
    'Branding',
    'Printed materials',
    'Audio creation'
  ];

  const suiteFeatures = [
    {
      title: 'Auto-resize for each platform',
      description: 'Make your design fit every social format, fast.',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      title: 'Create on-brand stories and reels',
      description: 'Stay true to your brand style in every post.',
      gradient: 'from-green-400 to-blue-500',
    },
    {
      title: 'Remove background to highlight subjects',
      description: 'Clean up your content and keep the focus on your subject.',
      gradient: 'from-red-500 to-orange-500',
    },
    {
      title: 'Generate social posts',
      description: 'Get scroll-worthy content for your social media.',
      gradient: 'from-pink-400 to-red-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            All in a single creative suite
          </h2>
          
          {/* Categories with smooth stagger animation */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {categories.map((category, index) => (
              <motion.span
                key={category}
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 cursor-pointer ${
                  index === 0 
                    ? 'bg-white text-black shadow-lg' 
                    : 'glassmorphic text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
              >
                {category}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Features grid with improved layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {suiteFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="group cursor-pointer"
            >
              <div className="glassmorphic rounded-2xl overflow-hidden h-96 shadow-lg">
                {/* Image area with improved gradient */}
                <div className={`h-2/3 bg-gradient-to-br ${feature.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <motion.div 
                    className="absolute inset-4 bg-white/10 rounded-xl backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {/* Content with better spacing */}
                <div className="p-6 h-1/3 flex flex-col justify-center">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-creative-purple transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CreativeSuite;