import React from 'react';
import { Link } from 'react-router-dom';

const PageLayout = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
    <header className="bg-[#343434] text-white py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="w-24">
          <img src="/logo.png" alt="PetCare" className="brightness-0 invert" />
        </Link>
        <Link to="/" className="text-sm hover:underline">Back to Home</Link>
      </div>
    </header>
    <main className="flex-1 container mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold text-[#5380c1] mb-10">{title}</h1>
      <div className="bg-white p-10 rounded-2xl shadow-xl">
        {children}
      </div>
    </main>
    <footer className="bg-[#343434] text-gray-400 py-10 text-center">
      <p>&copy; 2026 PetCare Pet Care. All rights reserved.</p>
    </footer>
  </div>
);

export const PetCarePage = () => (
  <PageLayout title="Pet Care Services">
    <div className="grid md:grid-cols-2 gap-10">
      <img src="https://i.imgur.com/BQzjsD0.png" className="w-full rounded-xl" />
      <div>
        <p className="text-xl text-gray-600 mb-6">Our comprehensive pet care services include wellness exams, vaccinations, and nutrition counseling.</p>
        <ul className="space-y-4">
          {['Wellness Exams', 'Vaccinations', 'Nutrition Counseling', 'Dental Care'].map(s => (
            <li key={s} className="flex items-center gap-3">
              <span className="text-[#edc315]">🐾</span> {s}
            </li>
          ))}
        </ul>
        <Link to="/booking" className="btn-gold mt-10 inline-block">Book a Checkup</Link>
      </div>
    </div>
  </PageLayout>
);

export const PetShopPage = () => (
  <PageLayout title="Pet Shop">
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { name: 'Premium Dog Food', price: '$45.00', img: 'https://i.imgur.com/nXvJkp1.png' },
        { name: 'Organic Cat Treats', price: '$12.00', img: 'https://i.imgur.com/nXvJkp1.png' },
        { name: 'Toy Bundle', price: '$25.00', img: 'https://i.imgur.com/nXvJkp1.png' }
      ].map(p => (
        <div key={p.name} className="border p-6 rounded-xl hover:shadow-lg transition">
          <img src={p.img} className="w-32 mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-2">{p.name}</h3>
          <p className="text-[#edc315] font-bold mb-4">{p.price}</p>
          <button className="w-full py-2 bg-[#5380c1] text-white rounded-lg">Add to Cart</button>
        </div>
      ))}
    </div>
  </PageLayout>
);

export const PetHelpPage = () => (
  <PageLayout title="Pet Help & Emergency">
    <div className="bg-red-50 border-l-8 border-red-500 p-8 mb-10">
      <h2 className="text-2xl font-bold text-red-700 mb-4">Emergency Hotline: 1-800-PAW-HELP</h2>
      <p className="text-red-600">Our emergency clinic is open 24/7 for urgent veterinary needs.</p>
    </div>
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <h3 className="text-2xl font-bold mb-6">First Aid Guide</h3>
        <p className="text-gray-600 mb-4">Learn what to do in case of common emergencies before you reach the clinic.</p>
        <button className="text-[#5380c1] font-bold hover:underline">Download Guide (PDF)</button>
      </div>
      <img src="https://i.imgur.com/k9hYPWX.png" className="w-full rounded-xl" />
    </div>
  </PageLayout>
);

export const HistoryPage = () => (
  <PageLayout title="Our History">
    <p className="text-lg text-gray-600 leading-relaxed">Founded in 2010, PetCare Pet Care started as a small local clinic with a big mission: to provide compassionate and professional care for every animal in our community.</p>
  </PageLayout>
);

export const TeamPage = () => (
  <PageLayout title="Our Team">
    <div className="grid md:grid-cols-3 gap-10">
      {['Dr. Sarah (Lead Vet)', 'Dr. Karim (Surgeon)', 'Emily (Head Groomer)'].map(name => (
        <div key={name} className="text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4" />
          <h3 className="font-bold">{name}</h3>
        </div>
      ))}
    </div>
  </PageLayout>
);

export const TermsPage = () => (
  <PageLayout title="Terms & Conditions">
    <p className="text-gray-600">By using our services, you agree to our policies regarding appointment cancellations and data privacy...</p>
  </PageLayout>
);

export const BookingGuidePage = () => (
  <PageLayout title="Booking Guide">
    <ol className="list-decimal list-inside space-y-4 text-gray-600">
      <li>Login to your account</li>
      <li>Go to 'Book Visit'</li>
      <li>Select your pet and preferred veterinarian</li>
      <li>Choose a date and time</li>
      <li>Confirm your appointment</li>
    </ol>
  </PageLayout>
);
