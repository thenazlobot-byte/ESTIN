import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Stepper from '../components/Stepper';
import DashboardLayout from '../components/DashboardLayout';
import { useAuthStore } from '../store/authStore';

type BookingStep = 1 | 2 | 3 | 4;

export const BookingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pets, user, bookAppointment } = useAuthStore();
  const isEmergency = new URLSearchParams(location.search).get('type') === 'emergency';
  
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(isEmergency ? 'emergency' : '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('10:00 - 10:30');
  const [petState, setPetState] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const services = [
    { id: '1', name: 'General Consultation', desc: 'Routine exams and non-urgent health issues' },
    { id: '2', name: 'Vaccination', desc: 'Preventive immunizations' },
    { id: 'emergency', name: 'Emergency Care', desc: 'Urgent medical attention needed immediately' },
    { id: '4', name: 'Surgery', desc: 'Surgical procedures' },
  ];

  const clinicAdmin = { name: 'Clinic Administrator', specialty: 'Chief Veterinarian' };

  useEffect(() => {
    if (isEmergency) {
      setSelectedServiceId('emergency');
    }
  }, [isEmergency]);

  const uploadFile = async (selectedFile: File, appointmentId: string) => {
    // Simulate Supabase upload since client is mocked here
    console.log(`Uploading ${selectedFile.name} to health-booklets bucket for appointment ${appointmentId}`);
    return URL.createObjectURL(selectedFile);
  };

  const handleConfirm = async () => {
    const pet = pets.find(p => p.id === selectedPetId);
    const service = services.find(s => s.id === selectedServiceId);
    
    let bookletUrl = undefined;
    if (file) {
      bookletUrl = await uploadFile(file, 'temp-id');
    }

    bookAppointment({
      customer_name: user?.full_name || 'Guest',
      customer_phone: user?.phone || 'N/A',
      customer_email: user?.email || 'N/A',
      pet_name: pet?.name || 'My New Pet',
      pet_type: pet?.type || 'Other',
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      reason: petState || service?.name || 'Checkup',
      health_booklet_url: bookletUrl
    });

    alert('Appointment requested successfully!');
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-xl">
            <h2 className="text-2xl font-bold text-[#5380c1] mb-8">Select Your Pet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => { setSelectedPetId(pet.id); setCurrentStep(2); }}
                  className={`p-8 border-2 rounded-2xl transition-all text-center group ${
                    selectedPetId === pet.id
                      ? 'border-[#edc315] bg-[#edc31505]'
                      : 'border-gray-100 hover:border-[#5380c1]'
                  }`}
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                    {pet.type === 'Dog' ? '🐕' : pet.type === 'Cat' ? '🐈' : pet.type === 'Bird' ? '🦜' : pet.type === 'Rabbit' ? '🐇' : '🐾'}
                  </div>
                  <h3 className="font-bold text-xl text-[#343434]">{pet.name}</h3>
                  <p className="text-gray-500 font-medium">{pet.breed}</p>
                </button>
              ))}
              <button
                onClick={() => navigate('/add-pet')}
                className="p-10 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#5380c1] hover:bg-[#5380c105] transition-all text-center flex flex-col items-center justify-center group h-64"
              >
                <div className="text-5xl mb-4 text-[#5380c1] group-hover:scale-125 transition-transform">➕</div>
                <h3 className="font-bold text-xl text-[#343434]">Register New Pet</h3>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-xl">
            <h2 className="text-2xl font-bold text-[#5380c1] mb-8">Choose a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => { setSelectedServiceId(service.id); setCurrentStep(3); }}
                  className={`p-6 border-2 rounded-2xl transition-all text-left group ${
                    selectedServiceId === service.id
                      ? 'border-[#edc315] bg-[#edc31505]'
                      : 'border-gray-100 hover:border-[#5380c1]'
                  } ${service.id === 'emergency' ? 'bg-red-50' : ''}`}
                >
                  <h3 className={`font-bold text-lg mb-2 ${service.id === 'emergency' ? 'text-red-600' : 'text-[#343434]'}`}>{service.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-xl">
            <h2 className="text-2xl font-bold text-[#5380c1] mb-8">Your Veterinarian</h2>
            <div className="p-8 border-2 border-[#edc315] bg-[#edc31505] rounded-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-[#343434]">{clinicAdmin.name}</h3>
                <p className="text-[#5380c1] font-bold">{clinicAdmin.specialty}</p>
              </div>
              <span className="bg-[#edc315] text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs">
                Chief Doctor
              </span>
            </div>
            <p className="mt-6 text-gray-500 italic text-sm">
              Note: The Clinic Administrator is the primary veterinarian overseeing all appointments.
            </p>
            <button 
              onClick={() => setCurrentStep(4)}
              className="mt-10 w-full py-4 bg-[#5380c1] text-white rounded-2xl font-bold hover:bg-[#4269a1] transition-all"
            >
              Continue to Schedule
            </button>
          </div>
        );

      case 4:
        return (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-xl">
            <h2 className="text-2xl font-bold text-[#5380c1] mb-8">Schedule & Animal State</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-5 py-4 bg-[#F8F9FA] border-none rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Time</label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-5 py-4 bg-[#F8F9FA] border-none rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold appearance-none"
                  >
                    <option>10:00 - 10:30</option>
                    <option>11:00 - 11:30</option>
                    <option>14:00 - 14:30</option>
                    <option>15:00 - 15:30</option>
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Animal's State</label>
                  <textarea
                    value={petState}
                    onChange={(e) => setPetState(e.target.value)}
                    placeholder="Describe your animal's health state..."
                    className="w-full h-32 px-5 py-4 bg-[#F8F9FA] border-none rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Health Booklet (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full px-5 py-3 bg-[#F8F9FA] border-none rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none text-[#343434] font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-[#5380c105] border border-[#5380c110] rounded-2xl">
              <h3 className="font-bold text-[#5380c1] mb-4 text-lg">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p className="text-gray-500">Pet: <span className="text-[#343434] font-bold">{pets.find(p => p.id === selectedPetId)?.name}</span></p>
                <p className="text-gray-500">Vet: <span className="text-[#343434] font-bold">{clinicAdmin.name}</span></p>
                <p className="text-gray-500">Date: <span className="text-[#343434] font-bold">{selectedDate}</span></p>
                <p className="text-gray-500">Time: <span className="text-[#343434] font-bold">{selectedTime}</span></p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-10 w-full bg-[#edc315] text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#d4ae12] transition-all transform hover:-translate-y-1"
            >
              Request Appointment
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeSidebarItem="booking">
      <div className="mb-12">
        <Link to="/dashboard" className="text-gray-400 hover:text-[#5380c1] text-xs font-bold uppercase tracking-widest mb-6 inline-flex items-center gap-2 group transition-colors">
          <i className="fa fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-[#343434] mb-8">Book a Visit</h1>
        <Stepper steps={['Pet', 'Service', 'Vet', 'Schedule']} currentStep={currentStep - 1} />
      </div>

      <div className="max-w-5xl">
        {renderStep()}
      </div>

      <div className="mt-12 flex gap-4 max-w-5xl justify-between">
        <button
          onClick={() => setCurrentStep((Math.max(1, currentStep - 1)) as BookingStep)}
          disabled={currentStep === 1}
          className="px-8 py-4 border-2 border-gray-100 rounded-2xl text-gray-400 font-bold hover:bg-white hover:text-[#5380c1] hover:border-[#5380c1] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentStep((Math.min(4, currentStep + 1)) as BookingStep)}
          disabled={currentStep === 4 || (currentStep === 1 && !selectedPetId) || (currentStep === 2 && !selectedServiceId)}
          className="px-8 py-4 bg-[#5380c1] text-white rounded-2xl font-bold hover:bg-[#4269a1] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next Step →
        </button>
      </div>
    </DashboardLayout>
  );
};

export default BookingFlow;
