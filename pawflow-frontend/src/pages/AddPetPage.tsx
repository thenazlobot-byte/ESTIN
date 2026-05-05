import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';

const AddPetPage = () => {
  const navigate = useNavigate();
  const addPet = useAuthStore((state) => state.addPet);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save to store
    addPet(formData);
    
    setTimeout(() => {
      alert(`${formData.name} has been added successfully!`);
      navigate('/booking');
    }, 1000);
  };

  return (
    <DashboardLayout activeSidebarItem="booking">
      <div className="mb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-400 hover:text-[#5380c1] text-xs font-bold uppercase tracking-widest mb-6 inline-flex items-center gap-2 group transition-colors"
        >
          <i className="fa fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Back
        </button>
        <h1 className="text-4xl font-bold text-[#343434] mb-2">Add New Pet</h1>
        <p className="text-gray-500">Register a new companion to your profile.</p>
      </div>

      <div className="max-w-2xl bg-white rounded-[2rem] p-10 shadow-xl border border-gray-50">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Pet Name</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
                placeholder="Buddy"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Animal Type</label>
              <select 
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Dog">Dog 🐕</option>
                <option value="Cat">Cat 🐈</option>
                <option value="Bird">Bird 🦜</option>
                <option value="Rabbit">Rabbit 🐇</option>
                <option value="Other">Other 🐾</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Breed</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
                placeholder="Golden Retriever"
                value={formData.breed}
                onChange={e => setFormData({...formData, breed: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Age (e.g. 2 years)</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
                placeholder="2 years"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Gender</label>
              <select 
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold appearance-none"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Weight (kg)</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
                placeholder="15"
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-[#5380c1] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#4269a1] transition-all transform hover:-translate-y-1 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register Pet'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddPetPage;
