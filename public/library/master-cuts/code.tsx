import React, { useState, useEffect } from 'react';
import { Scissors, Calendar, MapPin, Phone, Instagram, Facebook, Twitter, Clock, User, Check, Menu, X, Star, Zap } from 'lucide-react';

const MasterCuts = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: "The Executive Cut", price: "850 CZK", time: "45 min", desc: "Precision scissor cut, hot towel finish, and styling consultation." },
    { name: "Beard Sculpting", price: "550 CZK", time: "30 min", desc: "Razor lining, shape definition, and premium oil treatment." },
    { name: "Full Service", price: "1200 CZK", time: "75 min", desc: "Haircut & Beard Trim combo with a complimentary beverage." },
    { name: "Buzz & Fade", price: "600 CZK", time: "30 min", desc: "Machine work, skin fade, and sharp lining." },
    { name: "Grey Camouflage", price: "700 CZK", time: "30 min", desc: "Subtle coloring to blend grey hair naturally." },
    { name: "Head Shave", price: "650 CZK", time: "40 min", desc: "Hot towel, straight razor shave for the ultimate smooth finish." }
  ];

  const masters = [
    { name: "Alexei", role: "Top Master", specialty: "Classic Cuts & Scissor Work" },
    { name: "Diego", role: "Barber", specialty: "Fades & Designs" },
    { name: "Sasha", role: "Stylist", specialty: "Long Hair & Texturing" }
  ];

  const openBooking = () => setActiveModal('booking');
  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Scissors className="text-yellow-500" size={28} />
            <span>MASTER<span className="text-yellow-500">CUTS</span></span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-widest uppercase">
            <a href="#services" className="hover:text-yellow-500 transition-colors">Services</a>
            <a href="#masters" className="hover:text-yellow-500 transition-colors">Masters</a>
            <a href="#location" className="hover:text-yellow-500 transition-colors">Location</a>
            <button 
              onClick={openBooking}
              className="bg-yellow-500 text-black px-6 py-2 font-bold hover:bg-yellow-400 transition-colors"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950 flex flex-col items-center justify-center gap-8 md:hidden">
          <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold uppercase hover:text-yellow-500">Services</a>
          <a href="#masters" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold uppercase hover:text-yellow-500">Masters</a>
          <a href="#location" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold uppercase hover:text-yellow-500">Location</a>
          <button onClick={() => { setIsMenuOpen(false); openBooking(); }} className="text-2xl font-bold uppercase text-yellow-500">Book Now</button>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 via-zinc-950 to-zinc-950 z-0"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1 border border-zinc-700 rounded-full text-xs font-bold tracking-[0.3em] uppercase text-zinc-400">
            Est. 2024 • Prague
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-none">
            SHARP<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">VISION</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            More than just a cut. It's visual communication tailored to your personal brand. 
            Precision grooming for the modern individual.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              onClick={openBooking}
              className="w-full md:w-auto bg-white text-black px-8 py-4 font-bold text-lg hover:bg-zinc-200 transition-transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Calendar size={20} /> Book Appointment
            </button>
            <button className="w-full md:w-auto px-8 py-4 font-bold text-lg border border-zinc-700 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
              View Lookbook
            </button>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-24 bg-zinc-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">Our Menu</h2>
              <div className="h-1 w-20 bg-yellow-500"></div>
            </div>
            <p className="text-zinc-400 max-w-md text-right md:text-left">
              Curated services performed with surgical precision. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group p-8 border border-zinc-800 bg-zinc-950 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold uppercase">{service.name}</h3>
                  <span className="text-yellow-500 font-bold font-mono">{service.price}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest mb-4">
                  <Clock size={14} /> {service.time}
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{service.desc}</p>
                <button className="mt-6 w-full py-2 border border-zinc-800 text-zinc-500 text-xs uppercase font-bold group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-colors">
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Masters Section */}
      <section id="masters" className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-500/5 skew-x-12"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">The Talent</h2>
            <p className="text-zinc-400">Artists. Architects. Barbers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {masters.map((master, index) => (
              <div key={index} className="relative group">
                {/* Image Placeholder */}
                <div className="aspect-[3/4] bg-zinc-800 grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
                   {/* In a real app, <img> would go here. Using a pattern for demo */}
                   <div className="w-full h-full bg-zinc-800 flex items-center justify-center relative">
                      <User size={64} className="text-zinc-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                   </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-2xl font-bold uppercase text-white mb-1">{master.name}</h3>
                  <p className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-2">{master.role}</p>
                  <p className="text-zinc-400 text-sm">{master.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info / Location Banner */}
      <section id="location" className="py-24 bg-zinc-100 text-zinc-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">Visit HQ</h2>
              <div className="space-y-6 text-lg">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 shrink-0" />
                  <div>
                    <p className="font-bold">Vinohrady 1234/56</p>
                    <p className="text-zinc-600">120 00 Prague 2, Czechia</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="shrink-0" />
                  <p className="font-bold">+420 123 456 789</p>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="mt-1 shrink-0" />
                  <div>
                    <p className="font-bold">Mon - Fri: <span className="text-zinc-600 font-normal">09:00 - 20:00</span></p>
                    <p className="font-bold">Sat: <span className="text-zinc-600 font-normal">10:00 - 16:00</span></p>
                    <p className="font-bold">Sun: <span className="text-zinc-600 font-normal">Closed</span></p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button className="p-3 border-2 border-zinc-950 rounded-full hover:bg-zinc-950 hover:text-white transition-colors">
                  <Instagram size={24} />
                </button>
                <button className="p-3 border-2 border-zinc-950 rounded-full hover:bg-zinc-950 hover:text-white transition-colors">
                  <Facebook size={24} />
                </button>
                <button className="p-3 border-2 border-zinc-950 rounded-full hover:bg-zinc-950 hover:text-white transition-colors">
                  <Twitter size={24} />
                </button>
              </div>
            </div>

            <div className="bg-zinc-200 h-80 lg:h-auto w-full flex items-center justify-center border-2 border-zinc-950 relative">
               {/* Map Placeholder */}
               <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Prague&zoom=13&size=600x300&sensor=false')] bg-cover bg-center opacity-50 grayscale"></div>
               <button className="relative bg-white border-2 border-black px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                 Get Directions
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 py-12 border-t border-zinc-800 text-center md:text-left">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
             <div className="text-xl font-black tracking-tighter flex items-center justify-center md:justify-start gap-2 text-white mb-2">
              <Scissors className="text-yellow-500" size={20} />
              <span>MASTER<span className="text-yellow-500">CUTS</span></span>
            </div>
            <p className="text-zinc-600 text-sm">© 2026 Master Cuts. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500 font-medium uppercase tracking-wider">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Careers</a>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {activeModal === 'booking' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md relative z-10 p-8 shadow-2xl">
            <button onClick={closeModal} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-black uppercase mb-6">Book Appointment</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Service</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 p-3 text-white focus:outline-none focus:border-yellow-500">
                  {services.map(s => <option key={s.name}>{s.name} - {s.price}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Date</label>
                   <input type="date" className="w-full bg-zinc-800 border border-zinc-700 p-3 text-white focus:outline-none focus:border-yellow-500" />
                </div>
                <div>
                   <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Time</label>
                   <select className="w-full bg-zinc-800 border border-zinc-700 p-3 text-white focus:outline-none focus:border-yellow-500">
                     <option>10:00</option>
                     <option>11:00</option>
                     <option>12:00</option>
                     <option>14:00</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Name</label>
                <input type="text" placeholder="Your full name" className="w-full bg-zinc-800 border border-zinc-700 p-3 text-white focus:outline-none focus:border-yellow-500" />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Phone</label>
                <input type="tel" placeholder="+420..." className="w-full bg-zinc-800 border border-zinc-700 p-3 text-white focus:outline-none focus:border-yellow-500" />
              </div>

              <button type="button" onClick={() => { alert('Request sent!'); closeModal(); }} className="w-full bg-yellow-500 text-black font-bold uppercase py-4 mt-4 hover:bg-yellow-400 transition-colors">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterCuts;