import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Counter = ({ value, label }: { value: number; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  const formatValue = (v: number) => {
    if (v >= 10000) return (v / 1000).toFixed(0) + "k+";
    if (v >= 1000) return (v / 1000).toFixed(1) + "K";
    return v;
  };

  return (
    <div ref={ref} className="flex flex-col items-center justify-center border-[6px] border-white w-64 h-64 rounded-full">
      <h3 className="text-6xl font-bold">{formatValue(count)}</h3>
      <p className="text-lg uppercase tracking-widest">{label}</p>
    </div>
  );
};

const FadeIn = ({ children, direction = 'left' }: { children: React.ReactNode; direction?: 'left' | 'right' | 'up' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    if (direction === 'left') return 'animate-fade-in-left';
    if (direction === 'right') return 'animate-fade-in-right';
    return 'animate-fade-in-up';
  };

  return (
    <div ref={ref} className={getAnimationClass()}>
      {children}
    </div>
  );
};

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [followerPos, setFollowerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    const animateFollower = () => {
      setFollowerPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.1,
        y: prev.y + (pos.y - prev.y) * 0.1,
      }));
      requestAnimationFrame(animateFollower);
    };
    const frame = requestAnimationFrame(animateFollower);
    return () => cancelAnimationFrame(frame);
  }, [pos]);

  return (
    <>
      <div 
        className="cursor default-cursor hidden lg:flex" 
        style={{ left: pos.x, top: pos.y }} 
      />
      <div 
        className="cursor-follower default-cursor-follower hidden lg:block" 
        style={{ left: followerPos.x, top: followerPos.y }} 
      />
    </>
  );
};

const LandingPage = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const searchItems = [
    { title: 'Pet Care Services', path: '/payment?item=Pet Care&price=$19.00', keywords: 'health, checkup, care' },
    { title: 'Buy a Pet', path: '/adoption', keywords: 'food, toys, buy, shop, animals, breed' },
    { title: 'Emergency Help', path: '/booking?type=emergency', keywords: 'help, urgent, doctor, medical' },
    { title: 'Book Appointment', path: '/booking', keywords: 'visit, schedule, rendez-vous' },
    { title: 'Our Team', path: '/team', keywords: 'staff, doctors, vets' },
    { title: 'History', path: '/history', keywords: 'about, story' },
  ];

  const filteredItems = searchQuery 
    ? searchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : [];
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'FR' : 'EN');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="application relative overflow-hidden">
      <CustomCursor />
      
      {/* Header */}
      <header className={`header transition-all duration-300 ${isFixed ? 'fixed top-0 left-0 right-0 bg-[#343434] shadow-lg' : 'bg-[#5380c150]'}`}>
        <div className="container mx-auto px-4">
          <div className="header-wrap flex items-center justify-between py-4">
            <div className="logo w-40 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <img src="/logo.png" alt="PetCare Logo" className="max-w-full brightness-0 invert" />
            </div>
            <nav className="navigation hidden md:flex items-center gap-8">
              {!searchActive && (
                <ul className="items-list flex gap-8">
                  <li className="nav-item"><a className="nav-link active-link" href="/">{language === 'EN' ? 'Home' : 'Accueil'}</a></li>
                  <li className="nav-item"><a className="nav-link" href="#services">Services</a></li>
                  {!user ? (
                    <li className="nav-item"><Link className="nav-link" to="/login">{language === 'EN' ? 'Login' : 'Connexion'}</Link></li>
                  ) : (
                    <li className="nav-item flex items-center">
                      <Link 
                        to="/settings" 
                        className="w-10 h-10 rounded-full bg-[#edc315] text-white flex items-center justify-center font-bold text-sm shadow-lg hover:scale-110 transition-transform border-2 border-white"
                        title="My Profile"
                      >
                        {user.full_name?.charAt(0).toUpperCase()}
                      </Link>
                    </li>
                  )}
                </ul>
              )}
              
              {/* Language Switcher */}
              <button 
                onClick={toggleLanguage}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold text-white hover:bg-white hover:text-black transition-all"
              >
                {language}
              </button>
              <div className={`search-input relative ${searchActive ? 'block w-96' : 'hidden'}`}>
                <input 
                  type="text" 
                  placeholder={language === 'EN' ? 'Search services, products...' : 'Rechercher...'} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-2 text-white placeholder-white/50 focus:bg-white focus:text-black outline-none transition-all"
                  autoFocus
                />
                {filteredItems.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100] border border-gray-100">
                    {filteredItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigate(item.path);
                          setSearchActive(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                      >
                        <span className="font-bold text-gray-700 group-hover:text-[#5380c1]">{item.title}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Go →</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="search cursor-pointer p-2" onClick={() => setSearchActive(!searchActive)}>
                <i className={`fa ${searchActive ? 'fa-close' : 'fa-search'} text-2xl ${searchActive ? 'text-[#edc315]' : ''}`}></i>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-first relative min-h-[80vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: 'url(https://i.imgur.com/R9T4P4s.jpeg)', backgroundBlendMode: 'multiply' }}>
        <div className="container px-4">
          <div className="section-first-content max-w-4xl mx-auto drop-shadow-2xl">
            <h1 className="text-5xl md:text-8xl font-bold mb-12 [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
              {language === 'EN' ? 'We Care About Your Pet' : 'Nous prenons soin de votre animal'}
            </h1>
            {!user && (
              <div className="btn">
                <Link to="/register" className="btn-gold inline-block">Join Now</Link>
              </div>
            )}
            {user && (
              <div className="btn">
                <Link to="/dashboard" className="btn-gold inline-block">Go to Dashboard</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-second py-20 relative bg-[#739ee3]">
        <div className="shapes absolute inset-0 pointer-events-none">
          <img src="https://i.imgur.com/5u73PrF.png" className="absolute left-[-100px] top-0 opacity-50" />
          <img src="https://i.imgur.com/4dNbVzq.png" className="absolute right-[-100px] top-0 opacity-50" />
          <img src="https://i.imgur.com/ZnFhx86.png" className="absolute left-20 top-20 animate-[rotation_3s_linear_infinite]" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Discover Our Services</h2>
          <p className="max-w-2xl mx-auto mb-16 tracking-wider">We offer a wide range of services to keep your pets healthy and happy.</p>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { img: 'https://i.imgur.com/BQzjsD0.png', title: 'Pet Care', desc: 'Comprehensive wellness exams and preventive care.', path: '/payment?item=Pet%20Care&price=$19.00' },
              { img: 'https://i.imgur.com/k9hYPWX.png', title: 'Buy a Pet', desc: 'Find your new best friend from our selected breeds.', path: '/adoption' },
              { img: 'https://i.imgur.com/k9hYPWX.png', title: 'Pet Help', desc: '24/7 emergency assistance and specialized treatments.', path: '/booking?type=emergency' }
            ].map((item, i) => (
              <Link key={i} to={item.path} className="flex flex-col items-center group cursor-pointer">
                <img src={item.img} alt={item.title} className="mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#edc315] transition-colors">{item.title}</h3>
                <p className="text-gray-200">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-third py-32 bg-cover bg-center relative" style={{ backgroundImage: 'url(https://i.imgur.com/sRZ5lvP.jpeg)', backgroundColor: '#edc315', backgroundBlendMode: 'multiply' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <Counter value={3500} label="Pet Care" />
            <Counter value={900} label="Outlets" />
            <Counter value={25000} label="Pets Helped" />
          </div>
        </div>
      </section>

      {/* Content Section 1 */}
      <section className="section-four py-32 bg-[#5380c1] relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <FadeIn direction="left">
            <div className="max-w-xl text-left">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Personalized Care for Every Breed</h2>
              <p className="text-lg mb-8 leading-relaxed">Every pet is unique. Our expert team provides specialized care plans tailored to your pet's breed, age, and health history.</p>
              <Link to="/booking" className="btn-gold">Book Appointment</Link>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <img src="https://i.imgur.com/3ykANgK.png" alt="Pet" className="max-w-full rounded-2xl shadow-2xl" />
          </FadeIn>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-six py-32 bg-[#5380c1]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Basic Plan', price: '$0.00', desc: 'Standard wellness tips and community support.', icon: 'https://i.imgur.com/LqcEz5m.png' },
              { title: 'Premium Plan', price: '$19.00', desc: 'Full access to wellness checks and prioritized bookings.', icon: 'https://i.imgur.com/LqcEz5m.png', highlight: true },
              { title: 'Ultimate Plan', price: '$49.00', desc: 'All-inclusive care, grooming, and emergency coverage.', icon: 'https://i.imgur.com/LqcEz5m.png' }
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-2xl flex flex-col items-center transition-all transform hover:-translate-y-4 shadow-xl ${
                plan.highlight ? 'bg-[#5380c1] text-white scale-105' : 'bg-white text-[#5380c1]'
              }`}>
                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <img src={plan.icon} className={`w-16 mb-4 ${plan.highlight ? 'brightness-0 invert' : ''}`} />
                <h4 className="text-4xl font-bold mb-6">{plan.price}</h4>
                <p className={`mb-8 ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{plan.desc}</p>
                <button className={`font-bold px-8 py-3 rounded-xl transition-colors ${
                  plan.highlight ? 'bg-[#edc315] text-white hover:bg-[#d4ae12]' : 'bg-[#5380c1] text-white hover:bg-[#4269a1]'
                }`}>Select Plan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-[#343434] py-20 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h3 className="text-3xl font-bold mb-6">PetCare Pet Care</h3>
              <p className="mb-8 max-w-md text-gray-400">Your trusted partner in veterinary excellence since 2010. We treat your pets like our own family.</p>
              <div className="flex gap-4">
                {[ 'instagram', 'facebook', 'twitter', 'whatsapp' ].map(icon => (
                  <div key={icon} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#edc315] transition-colors">
                    <i className={`fa fa-${icon} text-black`}></i>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/history" className="hover:text-[#edc315]">History</Link></li>
                <li><Link to="/team" className="hover:text-[#edc315]">Our Team</Link></li>
                <li><Link to="/terms" className="hover:text-[#edc315]">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/booking-guide" className="hover:text-[#edc315]">Booking Guide</Link></li>
                <li><Link to="/pet-shop" className="hover:text-[#edc315]">Pet Shop</Link></li>
                <li><Link to="/pet-help" className="hover:text-[#edc315]">Emergency Care</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; 2026 PetCare Veterinary Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
