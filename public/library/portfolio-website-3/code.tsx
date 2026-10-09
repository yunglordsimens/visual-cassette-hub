import React, { useState } from 'react';
import { 
  Instagram, 
  Mail, 
  ArrowRight, 
  Image as ImageIcon, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  Building 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('wnetrza');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const portfolioTabs = [
    { id: 'wnetrza', label: 'Wnętrza' },
    { id: 'design', label: 'Projekty Designerskie' },
    { id: 'architektura', label: 'Architektura' },
  ];

  // Данные для портфолио (с деталями объектов)
  const portfolioItems = [
    { id: 1, category: 'wnetrza', title: 'Apartament Mokotów', type: 'Mieszkanie', size: '85 m²', location: 'Warszawa', aspect: 'aspect-[4/3]' },
    { id: 2, category: 'wnetrza', title: 'Loft Industrialny', type: 'Penthouse', size: '120 m²', location: 'Praga', aspect: 'aspect-[3/4]' },
    { id: 3, category: 'design', title: 'Minimalist Studio', type: 'Projekt Wnętrza', size: '45 m²', location: 'Kraków', aspect: 'aspect-[3/4]' },
    { id: 4, category: 'architektura', title: 'Willa Premium', type: 'Dom Wolnostojący', size: '250 m²', location: 'Wilanów', aspect: 'aspect-[4/3]' },
    { id: 5, category: 'wnetrza', title: 'Modern Classic', type: 'Apartament', size: '95 m²', location: 'Warszawa', aspect: 'aspect-[4/3]' },
    { id: 6, category: 'design', title: 'Biuro Butikowe', type: 'Przestrzeń Komercyjna', size: '150 m²', location: 'Poznań', aspect: 'aspect-[3/4]' },
  ];

  // Данные для FAQ
  const faqs = [
    { q: 'Jak długo trwa standardowa sesja?', a: 'Dla mieszkania do 80m² sesja zajmuje zazwyczaj około 1.5 - 2 godzin. Większe domy lub sesje typu "Designer Day" mogą trwać od 3 do 8 godzin w zależności od potrzeb.' },
    { q: 'Kiedy otrzymam gotowe zdjęcia?', a: 'Gotowe, poddane profesjonalnemu retuszowi zdjęcia wysyłam zazwyczaj w ciągu 48-72 godzin od momentu wyboru kadrów przez Klienta.' },
    { q: 'Jakie prawa do zdjęć otrzymuję?', a: 'Otrzymujesz licencję na wykorzystanie zdjęć do celów promocji i sprzedaży nieruchomości (strony WWW, portale ogłoszeniowe, social media). Autorskie prawa majątkowe pozostają przy mnie.' },
    { q: 'Czy wykonujesz sesje z drona?', a: 'Tak, posiadam uprawnienia i oferuję zdjęcia z drona, które świetnie dopełniają prezentację domów i działek. Jest to opcja dostępna w pakiecie Premium.' },
  ];

  // Данные для отзывов
  const testimonials = [
    { id: 1, name: 'Anna Kowalska', role: 'Agent Nieruchomości, Premium Real Estate', text: 'Zdjęcia wykonane dla naszego apartamentu na Złotej 44 przeszły najśmielsze oczekiwania. Nieruchomość sprzedała się w 2 tygodnie.' },
    { id: 2, name: 'Michał Nowak', role: 'Architekt Wnętrz', text: 'Sesja "Designer Day" to strzał w dziesiątkę. Fotograf doskonale zrozumiał moją wizję i uchwycił detale, nad którymi pracowałem miesiącami.' },
    { id: 3, name: 'Piotr Wiśniewski', role: 'Inwestor (Flip Mieszkań)', text: 'Od kiedy współpracujemy, moje mieszkania na wynajem znikają z portali w pierwszy dzień od publikacji ogłoszenia. Rewelacyjna jakość!' },
  ];

  const filteredPortfolio = portfolioItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-white selection:text-black scroll-smooth">
      
      {/* Навигация (Glass Navbar) */}
      <nav className="fixed w-full top-0 z-50 bg-neutral-950/70 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="text-sm tracking-[0.2em] text-white uppercase flex flex-col z-50">
            <span className="font-bold">Photographer</span>
            <span className="text-[10px] text-neutral-500">Name</span>
          </a>
          
          {/* Десктопное меню */}
          <div className="hidden md:flex space-x-8 text-[11px] tracking-widest uppercase">
            <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
            <a href="#o-mnie" className="hover:text-white transition-colors">O mnie</a>
            <a href="#oferta" className="hover:text-white transition-colors">Oferta</a>
            <a href="#opinie" className="hover:text-white transition-colors">Opinie</a>
            <a href="#kontakt" className="hover:text-white transition-colors">Kontakt</a>
          </div>
          
          {/* Кнопка Zarezerwuj (Десктоп) */}
          <a href="#kontakt" className="hidden md:flex items-center gap-2 text-[11px] tracking-widest uppercase text-white hover:text-neutral-400 transition-colors">
            Zarezerwuj <ChevronRight size={14} />
          </a>

          {/* Мобильный бургер */}
          <button 
            className="md:hidden z-50 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Мобильное полноэкранное меню */}
        <div className={`fixed inset-0 bg-neutral-950/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <a href="#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">Portfolio</a>
          <a href="#o-mnie" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">O mnie</a>
          <a href="#oferta" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">Oferta</a>
          <a href="#opinie" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">Opinie</a>
          <a href="#kontakt" onClick={() => setIsMobileMenuOpen(false)} className="mt-8 px-8 py-3 border border-white text-white tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-colors">Zarezerwuj Termin</a>
        </div>
      </nav>

      {/* Cinematic Hero с кнопками (CTA) */}
      <section className="h-[90vh] min-h-[600px] relative flex items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 bg-neutral-900 overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem] mx-2 md:mx-6">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/70 to-neutral-950 z-10" />
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
             <span className="text-neutral-500 text-xs tracking-widest uppercase"></span>
          </div>
        </div>
        
        <div className="relative z-20 space-y-8 max-w-4xl mx-auto animate-fade-in-up">
          <div className="text-neutral-400 tracking-[0.4em] text-[10px] md:text-xs uppercase flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-neutral-600"></span>
            Fotografia Nieruchomości & Architektury
            <span className="w-8 h-[1px] bg-neutral-600"></span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tighter leading-[1.1]">
            KADRY, KTÓRE<br />SPRZEDAJĄ.
          </h1>
          <p className="text-sm md:text-base text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
            Pomagam agencjom nieruchomości, deweloperom i projektantom ukazać prawdziwy potencjał wnętrz. Profesjonalny wizerunek to szybsza sprzedaż i wyższa wartość.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <a href="#portfolio" className="bg-white text-black px-8 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:bg-neutral-200 hover:scale-105 transition-all">
              Zobacz Portfolio
            </a>
            <a href="#oferta" className="border border-white/20 text-white px-8 py-4 rounded-full text-xs tracking-widest uppercase hover:bg-white/5 hover:border-white/40 transition-all">
              Poznaj Pakiety
            </a>
          </div>
        </div>
      </section>

      {/* Обо мне (Social Proof) */}
      <section id="o-mnie" className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[3/4] md:aspect-square bg-neutral-900 rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-neutral-500 text-xs tracking-widest uppercase"></span>
            </div>
          </div>
          <div className="space-y-8">
            <div className="text-[10px] tracking-widest text-neutral-500 uppercase">O mnie</div>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-tight">
              Wizualizuję przestrzeń,<br/>by wydobyć jej charakter.
            </h2>
            <div className="space-y-4 text-sm text-neutral-400 font-light leading-relaxed">
              <p>
                Specjalizuję się w fotografii wnętrz, architektury i nieruchomości premium. Moim celem nie jest tylko "zrobienie zdjęcia", ale opowiedzenie historii danego miejsca tak, aby przyciągnęło idealnego klienta.
              </p>
              <p>
                Dzięki precyzyjnemu operowaniu światłem i starannej obróbce pomagam pośrednikom, deweloperom i projektantom wnętrz budować silny wizerunek w branży.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl text-white font-light mb-2">5+</div>
                <div className="text-[10px] tracking-widest text-neutral-500 uppercase">Lat Doświadczenia</div>
              </div>
              <div>
                <div className="text-3xl text-white font-light mb-2">300+</div>
                <div className="text-[10px] tracking-widest text-neutral-500 uppercase">Sfotografowanych Obiektów</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Портфолио с фильтром и деталями */}
      <section id="portfolio" className="py-24 md:py-32 overflow-hidden bg-neutral-900/30">
        <div className="px-6 md:px-12 max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">Wybrane prace</h2>
            <p className="text-sm text-neutral-500 font-light max-w-sm">Kadry, które przyspieszyły sprzedaż nieruchomości i uświetniły portfolio projektantów.</p>
          </div>
          
          {/* Tabs Filter */}
          <div className="flex flex-wrap gap-6 text-[11px] tracking-[0.2em] uppercase">
            {portfolioTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white border-b border-white'
                    : 'text-neutral-600 hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-6 md:px-12 max-w-7xl mx-auto">
          {filteredPortfolio.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setLightboxData(item)}
              className={`relative group overflow-hidden rounded-xl bg-neutral-900 cursor-pointer ${item.aspect}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                 <ImageIcon className="text-neutral-800 w-12 h-12 group-hover:scale-110 transition-transform duration-700" strokeWidth={1} />
              </div>
              
              {/* Hover Details Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-neutral-400 text-[10px] tracking-widest uppercase mb-2">
                    <Building size={12} /> {item.type}
                  </div>
                  <h3 className="text-white text-xl font-light mb-1">{item.title}</h3>
                  <p className="text-neutral-400 text-xs">{item.size} • {item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal (Модальное окно просмотра) */}
      {lightboxData && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-12 animate-fade-in">
          <button 
            onClick={() => setLightboxData(null)} 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
          
          <div className="max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full max-h-[70vh] aspect-[4/3] bg-neutral-900 flex items-center justify-center rounded-lg overflow-hidden">
               <span className="text-neutral-600 tracking-widest uppercase text-sm"></span>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-light text-white mb-2">{lightboxData.title}</h3>
              <div className="flex gap-4 justify-center text-sm text-neutral-400">
                <span>{lightboxData.type}</span>
                <span>•</span>
                <span>{lightboxData.size}</span>
                <span>•</span>
                <span>{lightboxData.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Цены и Пакеты */}
      <section id="oferta" className="py-24 px-6 md:px-12 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">Pakiety i Cennik</h2>
            <p className="text-sm text-neutral-500 font-light">Przejrzyste zasady, bez ukrytych kosztów.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Minimal */}
            <div className="bg-neutral-950 border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-colors flex flex-col group">
              <div className="text-[10px] tracking-widest text-neutral-500 uppercase mb-4">Pakiet Podstawowy</div>
              <h3 className="text-2xl text-white font-light mb-2">Minimal</h3>
              <div className="text-4xl font-light text-white mb-8 group-hover:scale-105 transition-transform origin-left">300 <span className="text-lg text-neutral-600">PLN</span></div>
              <ul className="space-y-4 text-sm font-light flex-1">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-neutral-600 shrink-0" /> Do 20 zdjęć w obróbce</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-neutral-600 shrink-0" /> Idealny dla małych mieszkań do 40 m²</li>
              </ul>
            </div>

            {/* Optimal */}
            <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-2xl hover:border-neutral-500 transition-colors flex flex-col relative transform md:-translate-y-4 shadow-2xl group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold">
                Najpopularniejszy
              </div>
              <div className="text-[10px] tracking-widest text-neutral-400 uppercase mb-4">Pakiet Standardowy</div>
              <h3 className="text-2xl text-white font-light mb-2">Optimal</h3>
              <div className="text-4xl font-light text-white mb-8 group-hover:scale-105 transition-transform origin-left">400 <span className="text-lg text-neutral-500">PLN</span></div>
              <ul className="space-y-4 text-sm font-light flex-1">
                <li className="flex gap-3 text-white"><CheckCircle2 size={18} className="text-white shrink-0" /> Do 30 zdjęć w obróbce</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-neutral-500 shrink-0" /> Nieruchomości do 80 m²</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-neutral-500 shrink-0" /> Wnętrza bogate w detale</li>
              </ul>
            </div>

            {/* Maximum */}
            <div className="bg-neutral-950 border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-colors flex flex-col group">
              <div className="text-[10px] tracking-widest text-neutral-500 uppercase mb-4">Pakiet Rozszerzony</div>
              <h3 className="text-2xl text-white font-light mb-2">Maximum</h3>
              <div className="text-4xl font-light text-white mb-8 group-hover:scale-105 transition-transform origin-left">500 <span className="text-lg text-neutral-600">PLN</span></div>
              <ul className="space-y-4 text-sm font-light flex-1">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-neutral-600 shrink-0" /> Do 40 zdjęć w obróbce</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-neutral-600 shrink-0" /> Przestronne mieszkania do 200 m²</li>
              </ul>
            </div>
          </div>

          {/* Designer Day Banner */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mt-6 overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex-1 relative z-10">
              <div className="inline-block border border-white/20 text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-6">
                Oferta Specjalna dla Projektantów
              </div>
              <h3 className="text-3xl md:text-4xl font-light text-white mb-4">Designer Day</h3>
              <div className="text-neutral-400 font-light text-sm max-w-md space-y-2">
                <p>Praca bez ograniczeń czasowych, aż do uzyskania idealnego kadru. Skupienie na detalach, fakturach i jakości wykończenia dla architektonicznego portfolio.</p>
              </div>
            </div>
            <div className="text-left md:text-right shrink-0 w-full md:w-auto relative z-10">
              <div className="text-5xl font-light text-white mb-2">500 <span className="text-xl">PLN*</span></div>
              <p className="text-[10px] tracking-widest text-neutral-500 uppercase">* Cena promocyjna, limitowana</p>
              <a href="#kontakt" className="inline-block mt-6 w-full md:w-auto bg-white text-black px-8 py-3 text-xs tracking-widest uppercase rounded-full font-bold hover:bg-neutral-200 transition-colors text-center">
                Zarezerwuj Dzień
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы / Кейсы (Testimonials) */}
      <section id="opinie" className="py-24 px-6 md:px-12 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">Zaufali mi profesjonaliści</h2>
             <p className="text-sm text-neutral-500 font-light">Zobacz co mówią o mnie klienci.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-neutral-900 border border-white/5 p-8 rounded-2xl flex flex-col relative">
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm text-neutral-300 font-light leading-relaxed mb-8 flex-1 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-white/5 pt-6 mt-auto">
                  <div className="text-white text-sm font-medium">{testimonial.name}</div>
                  <div className="text-neutral-500 text-[10px] tracking-wider uppercase mt-1">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Warunki (Аккордеон) */}
      <section className="py-24 px-6 md:px-12 border-t border-white/5 bg-neutral-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm tracking-[0.2em] uppercase text-white mb-12 text-center">FAQ & Warunki Współpracy</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button 
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-white text-sm font-light">{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={18} className="text-neutral-500" /> : <ChevronDown size={18} className="text-neutral-500" />}
                </button>
                <div 
                  className={`px-6 text-sm text-neutral-400 font-light overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
            {/* Доп. условия (статичные) */}
            <div className="border border-white/10 bg-neutral-950 rounded-xl p-6 flex flex-col sm:flex-row justify-between gap-4 text-sm text-neutral-400 font-light mt-8">
              <div>
                <p className="text-white mb-1">Dodatkowe Ujęcia</p>
                <p>20 PLN / każde ujęcie poza pakietem.</p>
              </div>
              <div className="sm:text-right">
                <p className="text-white mb-1">Zaawansowany Retusz</p>
                <p>40 PLN / szt (usuwanie obiektów itp).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Контакты / Полноценная форма связи */}
      <section id="kontakt" className="pt-24 pb-12 px-6 md:px-12 bg-neutral-900 rounded-t-[3rem] md:rounded-t-[6rem] mx-2 md:mx-6 mb-2">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div className="space-y-8">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-8">
                <Camera size={24} className="text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight">
                Zróbmy świetny projekt.
              </h2>
              <p className="text-neutral-400 font-light max-w-sm">
                Zarezerwuj termin sesji lub zadaj pytanie. Zazwyczaj odpowiadam w ciągu 24 godzin.
              </p>
              
              <div className="space-y-4 pt-8 border-t border-white/10 text-sm tracking-wider font-light">
                <a href="mailto:hello@example.com" className="flex items-center gap-4 text-neutral-400 hover:text-white transition-colors">
                  <Mail size={18} className="text-neutral-600" />
                  hello@fotograf.pl
                </a>
                <a href="#" className="flex items-center gap-4 text-neutral-400 hover:text-white transition-colors">
                  <Instagram size={18} className="text-neutral-600" />
                  @twoj_instagram
                </a>
              </div>
            </div>

            {/* Рабочая Форма (UI) */}
            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/5">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2">Imię i Nazwisko / Firma</label>
                  <input type="text" placeholder="Jan Kowalski" className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2">Email</label>
                    <input type="email" placeholder="jan@example.com" className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2">Telefon</label>
                    <input type="tel" placeholder="+48 000 000 000" className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2">Rodzaj Nieruchomości / Wiadomość</label>
                  <textarea rows="4" placeholder="Opisz krótko swój projekt (np. mieszkanie 60m2 na wynajem, Warszawa)..." className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors resize-none" required></textarea>
                </div>
                
                {/* RODO / Privacy checkbox */}
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="rodo" className="mt-1" required />
                  <label htmlFor="rodo" className="text-xs text-neutral-500 font-light leading-snug">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu i obsługi zapytania. (RODO)
                  </label>
                </div>

                <button type="submit" className="w-full bg-white text-black py-4 rounded-xl text-xs tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                  Wyślij Zapytanie <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-widest uppercase text-neutral-600">
            <p>&copy; 2026 Photographer Name. Wszelkie prawa zastrzeżone.</p>
            <p>Designed for Real Estate</p>
          </div>
        </div>
      </section>
    </div>
  );
}