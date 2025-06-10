
import { motion } from 'framer-motion';

const FeaturesShowcase = () => {
  const features = [
    {
      title: 'Generate an AI image',
      description: 'Create stunning visuals with AI',
      gradient: 'from-red-500 to-red-700',
      bgColor: 'bg-red-500/20',
    },
    {
      title: 'Chat with AI to transform images',
      description: 'Intelligent image editing',
      gradient: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Find high-quality images',
      description: 'Premium stock photography',
      gradient: 'from-green-400 to-blue-500',
      bgColor: 'bg-green-500/20',
    },
    {
      title: 'Edit an image',
      description: 'Professional editing tools',
      gradient: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-500/20',
    },
    {
      title: 'Create on-brand AI images',
      description: 'Consistent brand visuals',
      gradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Upscale an image up to 10K',
      description: 'Enhanced image resolution',
      gradient: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-500/20',
    },
  ];

  const categories = ['Images', 'Video', 'Audio', 'Illustrations', 'Design', 'All AI tools'];

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
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto text-white">
            The features you need, the simplicity you want
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Categories sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="lg:w-1/4 space-y-2"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  index === 0 ? 'bg-white text-black shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {category}
              </motion.div>
            ))}
          </motion.div>

          {/* Features grid */}
          <motion.div 
            className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className="group cursor-pointer"
              >
                <div className="glassmorphic rounded-2xl p-6 h-64 flex flex-col justify-between relative overflow-hidden shadow-lg" key={index}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Content placeholder */}
                  <div className="relative z-10 flex-1 flex items-center justify-center">
                    <motion.div 
                      className={`w-20 h-20 rounded-2xl ${feature.bgColor}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  
                  {/* Title */}
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
