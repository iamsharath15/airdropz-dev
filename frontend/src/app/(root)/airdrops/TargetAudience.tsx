
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TargetAudience = () => {
  const audiences = [
    {
      title: 'Designers',
      description: 'Create stunning visual content',
      gradient: 'from-blue-600 to-purple-700',
      bgPattern: 'geometric',
    },
    {
      title: 'Marketers', 
      description: 'Boost campaign performance',
      gradient: 'from-green-400 to-blue-500',
      bgPattern: 'abstract',
    },
    {
      title: 'VFX filmmakers',
      description: 'Professional video effects',
      gradient: 'from-blue-500 to-cyan-400',
      bgPattern: 'camera',
    },
    {
      title: 'Content creators',
      description: 'Engaging social content',
      gradient: 'from-purple-500 to-pink-500',
      bgPattern: 'creative',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const PatternElement = ({ pattern }: { pattern: string }) => {
    switch (pattern) {
      case 'geometric':
        return (
          <motion.div 
            className="space-y-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-16 bg-white/20 rounded-lg shadow-lg" />
            <div className="w-16 h-12 bg-white/30 rounded-lg ml-4 shadow-lg" />
            <div className="text-white font-bold text-sm tracking-wide">DREAMS</div>
          </motion.div>
        );
      case 'abstract':
        return (
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full shadow-lg" />
            <div className="w-12 h-8 bg-white/30 rounded-lg shadow-lg" />
          </motion.div>
        );
      case 'camera':
        return (
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-12 bg-white/20 rounded-lg shadow-lg" />
            <div className="w-4 h-16 bg-white/30 rounded-lg mx-auto shadow-lg" />
          </motion.div>
        );
      case 'creative':
        return (
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full shadow-lg" />
            <div className="w-12 h-8 bg-creative-orange/40 rounded-lg shadow-lg" />
          </motion.div>
        );
      default:
        return null;
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
          <h2 className="text-3xl text-white md:text-5xl font-bold mb-6 max-w-4xl mx-auto">
            Boost your professional workflow and productivity
          </h2>
          
          {/* Navigation arrows with hover effects */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button 
              className="p-3 glassmorphic rounded-full hover:bg-white/10 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button 
              className="p-3 glassmorphic rounded-full hover:bg-white/10 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </motion.div>

        {/* Audience cards with improved animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              variants={itemVariants}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group cursor-pointer"
            >
              <div className="glassmorphic rounded-2xl overflow-hidden h-96 relative shadow-xl">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${audience.gradient} opacity-80`} />
                
                {/* Pattern overlay */}
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Content area with visual elements */}
                <div className="relative h-full p-6 flex flex-col">
                  {/* Visual content area */}
                  <div className="flex-1 flex items-center justify-center">
                    <PatternElement pattern={audience.bgPattern} />
                  </div>
                  
                  {/* Title with improved typography */}
                  <div className="text-center">
                    <motion.h3 
                      className="text-xl font-bold text-white mb-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {audience.title}
                    </motion.h3>
                    <p className="text-sm text-white/80">
                      {audience.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TargetAudience;