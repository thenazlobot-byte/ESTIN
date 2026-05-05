import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemName = new URLSearchParams(location.search).get('item') || 'Pet Service';
  const price = new URLSearchParams(location.search).get('price') || '$19.00';
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      alert(`Payment of ${price} for ${itemName} successful!`);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#739ee3] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-[#5380c1] p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Secure Payment</h2>
          <p className="text-blue-100 text-sm">Paying for: <span className="font-bold">{itemName}</span></p>
          <div className="text-4xl font-bold mt-4">{price}</div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Cardholder Name</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-4 bg-[#F8F9FA] rounded-xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
              placeholder="JOHN DOE"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Card Number</label>
            <div className="relative">
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 bg-[#F8F9FA] rounded-xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={e => setFormData({...formData, cardNumber: e.target.value})}
              />
              <div className="absolute right-4 top-4 text-gray-300 text-xl">
                <i className="fa fa-credit-card"></i>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Expiry Date</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 bg-[#F8F9FA] rounded-xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={e => setFormData({...formData, expiry: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">CVV</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 bg-[#F8F9FA] rounded-xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
                placeholder="123"
                value={formData.cvv}
                onChange={e => setFormData({...formData, cvv: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={isProcessing}
            className="w-full py-5 bg-[#edc315] hover:bg-[#d4ae12] text-white rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : `Pay ${price}`}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors"
          >
            Cancel and Return
          </button>
        </form>
        
        <div className="p-6 bg-gray-50 flex items-center justify-center gap-4 border-t border-gray-100">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 opacity-50" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 opacity-50" />
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-gray-400 uppercase mb-1">Algérie Poste</span>
            <img src="https://vignette.wikia.nocookie.net/logopedia/images/8/8e/Alg%C3%A9rie_Poste.png" className="h-8" alt="Edahabia" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
