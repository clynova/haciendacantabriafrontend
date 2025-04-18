import { useEffect, useState, useRef } from 'react';

const companies = [
  { name: "Chiche cuadra", logo: "/images/companies/Chiche-logo.webp" },
  { name: "La Cabrera", logo: "/images/companies/lacabrera-logo.webp" },
  { name: "Burger Smasher", logo: "/images/companies/smashlogo.webp" },
  { name: "Tierra del Fuego", logo: "/images/companies/tdf-logo-white.webp" },
  { name: "Santabrasa", logo: "/images/companies/SANTABRASA.webp" },
];

const CompaniesCarousel = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const duration = 30000; // 15 seconds for one complete cycle
    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      
      // Calculate position with a continuous movement
      const newPosition = -(progress * 100);
      setScrollPosition(newPosition);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Create a longer array for smoother infinite scroll
  const extendedCompanies = [...companies, ...companies, ...companies, ...companies];

  return (
    <div className="w-full overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Quienes Confían en Nosotros
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Nos enorgullece ser proveedores de confianza para las mejores empresas del sector gastronómico
        </p>
      </div>
      
      <div className="relative" ref={containerRef}>
        <div 
          className="flex gap-4"
          style={{ 
            transform: `translateX(${scrollPosition}%)`,
            transition: 'transform 0.1s linear'
          }}
        >
          {extendedCompanies.map((company, index) => (
            <div 
              key={`${company.name}-${index}`}
              className="flex-none w-[250px] p-4 flex items-center justify-center"
            >
              <img
                src={company.logo}
                alt={`Logo de ${company.name}`}
                className="w-full h-auto object-contain 
                         brightness-0 invert
                         hover:brightness-100 hover:invert-0 
                         transition-all duration-300"
                loading="lazy"
                width="250"
                height="100"
                style={{ aspectRatio: '2.5/1' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesCarousel;