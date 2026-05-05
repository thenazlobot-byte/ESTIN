import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PetAdoptionPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');

  const categories = [
    { name: 'All', icon: '🐾' },
    { name: 'Dog', icon: '🐕' },
    { name: 'Cat', icon: '🐈' },
    { name: 'Bird', icon: '🦜' },
    { name: 'Rabbit', icon: '🐇' }
  ];

  const pets = [
    { 
      id: 1, 
      name: 'Max', 
      type: 'Dog', 
      breed: 'Golden Retriever', 
      age: '3 months', 
      price: '$450', 
      img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      desc: 'Very friendly and playful. Great with kids!'
    },
    { 
      id: 2, 
      name: 'Bella', 
      type: 'Cat', 
      breed: 'Persian', 
      age: '2 months', 
      price: '$300', 
      img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
      desc: 'Calm and affectionate. Loves to be pampered.'
    },
    { 
      id: 3, 
      name: 'Bluey', 
      type: 'Bird', 
      breed: 'Macaw Parrot', 
      age: '5 months', 
      price: '$1,200', 
      img: 'https://images.unsplash.com/photo-1552728089-57bdde30eba3?auto=format&fit=crop&q=80&w=400',
      desc: 'Vibrant and talkative. Learns new words quickly!'
    },
    { 
      id: 4, 
      name: 'Snowy', 
      type: 'Rabbit', 
      breed: 'Angora', 
      age: '2 months', 
      price: '$80', 
      img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=400',
      desc: 'Soft and quiet. A perfect indoor companion.'
    },
    { 
      id: 5, 
      name: 'Rocky', 
      type: 'Dog', 
      breed: 'German Shepherd', 
      age: '4 months', 
      price: '$550', 
      img: 'https://images.unsplash.com/photo-1589944173351-54d03292447d?auto=format&fit=crop&q=80&w=400',
      desc: 'Smart and energetic. Perfect for an active family.'
    },
    { 
      id: 6, 
      name: 'Misty', 
      type: 'Cat', 
      breed: 'British Shorthair', 
      age: '3 months', 
      price: '$400', 
      img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400',
      desc: 'Curious and independent. Loves exploring.'
    },
    { 
      id: 7, 
      name: 'Goldie', 
      type: 'Bird', 
      breed: 'Canary', 
      age: '2 months', 
      price: '$50', 
      img: 'https://images.unsplash.com/photo-1522850949506-58555f29a8e0?auto=format&fit=crop&q=80&w=400',
      desc: 'Beautiful singing voice. Very cheerful!'
    }
  ];

  const filteredPets = filter === 'All' ? pets : pets.filter(p => p.type === filter);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-[#343434] text-white py-14">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#edc315] mb-2">Pet Adoption Center</h1>
            <p className="text-gray-400 text-lg">Find your new companion by category</p>
          </div>
          <Link to="/" className="text-gray-400 hover:text-[#edc315] font-bold flex items-center gap-2 group">
            <i className="fa fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Back to Home
          </Link>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setFilter(cat.name)}
                className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                  filter === cat.name 
                  ? 'bg-[#5380c1] text-white shadow-lg scale-105' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-[2rem] shadow-xl overflow-hidden group hover:-translate-y-3 transition-all border border-gray-50">
              <div className="h-72 relative overflow-hidden bg-gray-200">
                <img src={pet.img} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-6 right-6 bg-[#edc315] text-white px-5 py-2 rounded-2xl text-sm font-bold shadow-2xl">
                  {pet.price}
                </div>
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-1 rounded-xl text-[10px] font-bold text-[#5380c1] uppercase tracking-[2px]">
                  {pet.type}
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-[#343434] mb-1">{pet.name}</h3>
                    <p className="text-[#5380c1] font-bold">{pet.breed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{pet.age}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 h-12 overflow-hidden">{pet.desc}</p>
                <button 
                  onClick={() => navigate(`/payment?item=Adoption: ${pet.name} (${pet.breed})&price=${pet.price}`)}
                  className="w-full py-5 bg-[#343434] text-white rounded-2xl font-bold hover:bg-[#5380c1] transition-all shadow-lg flex items-center justify-center gap-3 group"
                >
                  Adopt {pet.name} <i className="fa fa-heart text-red-500 group-hover:scale-125 transition-transform"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPets.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-400">No {filter}s available right now.</h3>
            <p className="text-gray-500 mt-2">Check back soon or try another category!</p>
          </div>
        )}
      </main>

      <footer className="bg-[#343434] py-16 text-center text-gray-500 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <img src="/logo.png" alt="PetCare" className="h-12 mx-auto mb-8 brightness-0 invert opacity-30" />
          <p className="text-sm">&copy; 2026 PetCare Adoption Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PetAdoptionPage;
