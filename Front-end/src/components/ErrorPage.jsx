import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';

const CoffeeErrorPage = ({ errorCode = 404, errorMessage = 'Page Not Found' }) => {
  const accountId = localStorage.getItem("accountId");
  let path = null;
  if (accountId == 1) path = "/Admin";
  else if (accountId == 2) path = "/Staff";
  else path = "/";
  const navigator = useNavigate();
  const [steamParticles, setSteamParticles] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [coffeeSpill, setCoffeeSpill] = useState(false);

  // Generate coffee steam particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, () => ({
      id: Math.random().toString(36).substring(7),
      x: Math.random() * 60 + 20, // Center around coffee cup
      y: 100, // Start at bottom
      size: Math.random() * 15 + 5,
      speed: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      drift: (Math.random() - 0.5) * 0.5,
    }));
    setSteamParticles(newParticles);

    // Coffee spill animation
    const spillTimeout = setTimeout(() => {
      setCoffeeSpill(true);
    }, 1500);

    return () => clearTimeout(spillTimeout);
  }, []);

  // Animate steam particles
  useEffect(() => {
    const interval = setInterval(() => {
      setSteamParticles(prevParticles => {
        // Remove particles that have floated away
        const filtered = prevParticles.filter(p => p.y > -10);
        
        // Add new particles occasionally
        if (filtered.length < 15 && Math.random() > 0.7) {
          filtered.push({
            id: Math.random().toString(36).substring(7),
            x: Math.random() * 60 + 20,
            y: 100,
            size: Math.random() * 15 + 5,
            speed: Math.random() * 0.8 + 0.3,
            opacity: Math.random() * 0.7 + 0.3,
            drift: (Math.random() - 0.5) * 0.5,
          });
        }

        // Update existing particles
        return filtered.map(p => ({
          ...p,
          y: p.y - p.speed,
          x: p.x + p.drift,
          opacity: p.opacity * 0.99, // Fade out
        }));
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-4 text-coffee-900">
      {/* Animated coffee cup with steam */}
      <div className="relative mb-8 w-40 h-40">
        {/* Coffee cup */}
        <motion.div 
          className="absolute bottom-0 w-full h-3/4 bg-white rounded-b-lg border-t-2 border-amber-200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Coffee liquid */}
          <motion.div 
            className="absolute bottom-0 w-full h-3/4 bg-gradient-to-b from-amber-700 to-amber-800 rounded-b-lg"
            animate={{
              height: ['75%', '70%', '75%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Cup handle */}
          <div className="absolute right-0 top-1/4 transform translate-x-1/2 w-8 h-10 rounded-full border-2 border-amber-200 bg-amber-50" />
        </motion.div>
        
        {/* Steam particles */}
        {steamParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-amber-100 opacity-70"
            style={{
              left: `${particle.x}%`,
              bottom: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: particle.opacity }}
            transition={{ duration: 0.5 }}
          />
        ))}
        
        {/* Coffee spill animation */}
        <AnimatePresence>
          {coffeeSpill && (
            <motion.div
              className="absolute -bottom-4 left-1/4 w-20 h-8 bg-amber-800 rounded-full"
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-4 bg-amber-700 rounded-b-full"
                initial={{ scaleY: 0, originY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              />
              <motion.div 
                className="absolute -bottom-4 left-4 w-2 h-6 bg-amber-700"
                initial={{ scaleY: 0, originY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5, duration: 0.2 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error content */}
      <div className="text-center max-w-2xl">
        <motion.h1
          className="text-6xl font-bold mb-4 text-amber-900"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {errorCode}
        </motion.h1>
        
        <motion.h2
          className="text-3xl font-semibold mb-6 text-amber-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {errorMessage}
        </motion.h2>
        
        <motion.p
          className="text-lg mb-8 text-amber-700"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Whoops! Looks like we spilled some coffee on this page.
          <br />
          The content you're looking for might have been moved or doesn't exist.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${isHovering ? 'bg-amber-800 text-amber-50' : 'bg-amber-700 text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={()=>navigator(-1)}
          >
            Go to Back
          </motion.button>
          
          <motion.button
            className="px-6 py-3 rounded-full font-semibold border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async ()=> await navigator(path)}
          >
            Back to home
          </motion.button>
        </motion.div>
      </div>

      {/* Coffee beans decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden h-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-8 h-4 bg-amber-900 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
            }}
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{
              delay: Math.random() * 0.5,
              duration: 0.5 + Math.random(),
            }}
          />
        ))}
      </div>

      {/* Coffee stain textures */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-amber-700"></div>
        <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-amber-800"></div>
      </div>
      <div className="absolute bottom-20 left-10 w-32 h-32 opacity-10">
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-amber-700"></div>
      </div>
    </div>
  );
};

export default CoffeeErrorPage;