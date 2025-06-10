
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-creative-purple/10 " />
      
      {/* Animated background elements with improved performance */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-creative-pink/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-creative-orange/20 rounded-full blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* New Badge with improved animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glassmorphic px-4 py-2 rounded-full mb-8 flex items-center gap-2"
      >
        <span className="text-sm font-medium text-white">Google Veo 3 has landed</span>
        <motion.span 
          className="bg-white text-black px-2 py-1 rounded text-xs font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
        >
          NEW
        </motion.span>
      </motion.div>

      {/* Main heading with staggered animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-center max-w-5xl mx-auto mb-6"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="block"
          >
            Creative work, reimagined with AI
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="block bg-gradient-to-r from-creative-purple to-creative-blue bg-clip-text text-transparent"
          >
            All in one place
          </motion.span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12"
      >
        One suite with AI tools you trust and premium stock assets you ll love.
      </motion.p>

      {/* CTA Button with improved hover effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 transition-all duration-300 text-lg px-8 py-6 rounded-full group shadow-lg"
          >
            Get started for free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Floating creative elements with improved animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Handbag */}
        <motion.div
          className="absolute top-1/4 left-[10%] w-24 h-24 md:w-32 md:h-32"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-creative-orange to-creative-pink rounded-2xl glassmorphic p-3 flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-creative-orange/40 rounded-lg" />
          </div>
        </motion.div>

        {/* Portrait */}
        <motion.div
          className="absolute top-1/3 right-[10%] w-24 h-24 md:w-32 md:h-32"
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, -2, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-creative-green to-creative-blue rounded-2xl glassmorphic p-3 flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-creative-pink/40 rounded-full" />
          </div>
        </motion.div>

        {/* Audio visualizer */}
        <motion.div
          className="absolute bottom-1/4 left-[15%] w-20 h-20 md:w-24 md:h-24"
          animate={{ 
            y: [0, -8, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-creative-blue to-creative-purple rounded-2xl glassmorphic p-2 flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-creative-blue/40 rounded-lg" />
          </div>
        </motion.div>

        {/* Mountain scene - central large image */}
        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-32 md:w-64 md:h-40"
          animate={{ 
            y: [0, -6, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-creative-blue/80 to-creative-purple/80 rounded-3xl glassmorphic overflow-hidden shadow-xl">
            <div className="w-full h-full bg-gradient-to-t from-creative-blue/30 to-creative-purple/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
