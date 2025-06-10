
import { motion } from 'framer-motion';
import { useState } from 'react';

const AIModelsShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState('Image generation');

  const aiModels = [
    'Google', 'MAGNIFIC', 'KLING', 'Flux', 'ChatGPT', 'ElevenLabs', 'runway', 'Google'
  ];

  const categories = [
    'Image generation',
    'Image editing', 
    'Video generation',
    'Video editing',
    'Audio generation'
  ];

  const categoryContent = {
    'Image generation': {
      title: 'Generate Images',
      description: '35mm film photography, she wears a bold red trench coat over a black turtleneck.',
      mode: 'Flux 1.0',
      gradient: 'from-creative-purple via-creative-pink to-creative-orange'
    },
    'Image editing': {
      title: 'Edit Images',
      description: 'Remove background, enhance colors, and apply professional filters to your images.',
      mode: 'MAGNIFIC AI',
      gradient: 'from-creative-blue via-creative-purple to-creative-pink'
    },
    'Video generation': {
      title: 'Generate Videos',
      description: 'Create stunning video content from text prompts with cinematic quality.',
      mode: 'KLING AI',
      gradient: 'from-creative-green via-creative-blue to-creative-purple'
    },
    'Video editing': {
      title: 'Edit Videos',
      description: 'Professional video editing with AI-powered scene detection and transitions.',
      mode: 'Runway ML',
      gradient: 'from-creative-orange via-creative-pink to-creative-purple'
    },
    'Audio generation': {
      title: 'Generate Audio',
      description: 'Create high-quality voice overs and music from text descriptions.',
      mode: 'ElevenLabs',
      gradient: 'from-creative-pink via-creative-orange to-creative-blue'
    }
  };

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

  const currentContent = categoryContent[selectedCategory];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto text-white">
            Powered by GenAI models from industry leaders
          </h2>
          
          {/* AI Model logos with improved animation */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16 opacity-60"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {aiModels.map((model, index) => (
              <motion.div
                key={`${model}-${index}`}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1, 
                  opacity: 1,
                  transition: { duration: 0.2 }
                }}
                className="text-xl md:text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                {model}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main showcase with improved layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Background gradient */}
<div className="absolute inset-0 bg-gradient-to-br from-creative-purple/30 via-creative-pink/20 to-creative-orange/30 rounded-3xl blur-3xl" />
          
          {/* Main interface mockup */}
          <div className="relative glassmorphic rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left sidebar - controls */}
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:w-1/3 space-y-6"
              >
                <div className="glassmorphic rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">{currentContent.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {currentContent.description}
                  </p>
                  
                  {/* Control buttons with improved styling */}
                  <div className="space-y-3">
                    {[
                      { color: 'bg-creative-purple', label: 'Mode', value: currentContent.mode },
                      { color: 'bg-creative-blue', label: 'Style', value: null },
                      { color: 'bg-creative-pink', label: 'Composition', value: null },
                      { color: 'bg-creative-orange', label: 'Effects', value: null }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`w-4 h-4 ${item.color} rounded shadow-sm`} />
                        <span className="text-sm font-medium">{item.label}</span>
                        {item.value && (
                          <span className="text-sm text-muted-foreground ml-auto">{item.value}</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-creative-purple hover:bg-creative-purple/80 text-white py-3 rounded-lg font-semibold mt-6 transition-colors shadow-lg"
                  >
                    Generate
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Right side - generated content preview */}
              <motion.div
                key={`preview-${selectedCategory}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="lg:w-2/3"
              >
                <div className="glassmorphic rounded-2xl overflow-hidden h-64 md:h-80 relative shadow-lg">
                  {/* Dynamic gradient based on selected category */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentContent.gradient} opacity-60`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Overlay elements representing the AI-generated content */}
                  <div className="absolute inset-4 flex items-center justify-center">
                    <motion.div 
                      className="w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-xl"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-full" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Interactive category tabs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              variants={itemVariants}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full text-sm transition-all duration-300 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-white text-black shadow-lg' 
                  : 'glassmorphic text-muted-foreground hover:text-foreground hover:bg-white/10'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AIModelsShowcase;