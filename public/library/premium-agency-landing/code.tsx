import React, { useState, useEffect, useRef } from 'react';
import { Play, Globe, Code2, Sparkles, MoveRight, ChevronDown } from 'lucide-react';

// Словарь переводов для мультиязычности
const translations = {
  en: {
    nav: { work: 'Work', expertise: 'Expertise', studio: 'Studio', contact: 'Discuss Project' },
    hero: {
      subtitle: 'Independent Design Practice',
      title1: 'DIGITAL',
      title2: 'PRESENCE.',
      desc: 'We merge premium custom typography, cinematic animations, and cutting-edge web technologies to build products that cannot be ignored.',
    },
    expertise: {
      titleBase: 'Strategic ',
      titleHighlight: 'sweet spot.',
      titleEnd: ' Balancing award-winning aesthetics with uncompromising conversion rates.',
      items: [
        { title: 'Custom Typography', desc: 'Basic fonts make design typical. We create bespoke typefaces and precise typographic systems to make your brand recognizable and prestigious.' },
        { title: 'Meaningful Animation', desc: 'Movement as part of the experience. Cinematic scroll (GSAP) and smooth transitions without white loading screens are the hallmarks of true professionalism.' },
        { title: 'Interactive 3D', desc: 'Implementing WebGL and Three.js to create a wow-factor. Photorealistic models and shaders turn casual viewers into loyal clients.' },
        { title: 'Engineering Base', desc: 'Beauty shouldn\'t be slow. Flawless HTML semantics, accessibility (a11y), and SEO optimization under the hood of every pixel-perfect interface.' }
      ]
    },
    work: { title: 'Selected.', viewAll: 'View all projects' },
    metrics: { launched: 'Projects Launched', awards: 'Global Awards', perf: 'Lighthouse Performance', sotd: 'Site of the Day' },
    footer: { title1: 'LET\'S', title2: 'WORK.', location: 'Prague, Czechia (CET)', rights: 'All rights reserved.' }
  },
  uk: {
    nav: { work: 'Роботи', expertise: 'Експертиза', studio: 'Студія', contact: 'Обговорити проєкт' },
    hero: {
      subtitle: 'Незалежна дизайн-практика',
      title1: 'DIGITAL',
      title2: 'ПРИСУТНІСТЬ.',
      desc: 'Ми поєднуємо преміальну кастомну типографіку, кінематографічні анімації та передові веб-технології, щоб створювати продукти, які неможливо ігнорувати.',
    },
    expertise: {
      titleBase: 'Стратегічна ',
      titleHighlight: 'золота середина.',
      titleEnd: ' Баланс між фестивальною естетикою та безкомпромісною конверсією.',
      items: [
        { title: 'Кастомна Типографіка', desc: 'Базові шрифти роблять дизайн типовим. Ми створюємо власні шрифти та вивірені системи, щоб ваш бренд виглядав статусно.' },
        { title: 'Осмислена Анімація', desc: 'Рух як частина досвіду. Кінематографічний скрол та плавні переходи без білих екранів очікування — ознака справжнього професіоналізму.' },
        { title: 'Інтерактивний 3D', desc: 'Впроваджуємо WebGL та Three.js для створення вау-ефекту. Фотореалістичні моделі перетворюють звичайних глядачів на ваших клієнтів.' },
        { title: 'Технічна База', desc: 'Краса не повинна гальмувати. Ідеальна семантика HTML, доступність (a11y) та SEO-оптимізація під капотом кожного інтерфейсу.' }
      ]
    },
    work: { title: 'Вибране.', viewAll: 'Всі проєкти' },
    metrics: { launched: 'Запущених проєктів', awards: 'Міжнародних нагород', perf: 'Lighthouse Performance', sotd: 'Site of the Day' },
    footer: { title1: 'ДАВАЙТЕ', title2: 'ПРАЦЮВАТИ.', location: 'Прага, Чехія (CET)', rights: 'Всі права захищено.' }
  },
  ru: {
    nav: { work: 'Работы', expertise: 'Экспертиза', studio: 'Студия', contact: 'Обсудить проект' },
    hero: {
      subtitle: 'Независимая дизайн-практика',
      title1: 'DIGITAL',
      title2: 'ПРИСУТСТВИЕ.',
      desc: 'Мы объединяем премиальную кастомную типографику, кинематографичные анимации и передовые технологии, чтобы создавать продукты, которые невозможно игнорировать.',
    },
    expertise: {
      titleBase: 'Стратегическая ',
      titleHighlight: 'золотая середина.',
      titleEnd: ' Баланс между фестивальным эстетизмом и бескомпромиссной конверсией.',
      items: [
        { title: 'Кастомная Типографика', desc: 'Базовые шрифты делают дизайн типичным. Мы создаем собственные шрифты и системы, чтобы ваш бренд выглядел статусно и узнаваемо.' },
        { title: 'Осмысленная Анимация', desc: 'Движение как часть опыта. Кинематографичный скролл и плавные переходы без белых экранов — признак истинного профессионализма.' },
        { title: 'Интерактивный 3D', desc: 'Внедряем WebGL и Three.js для создания вау-эффекта. Фотореалистичные модели и шейдеры превращают зрителей в ваших клиентов.' },
        { title: 'Техническая База', desc: 'Красота не должна тормозить. Идеальная семантика HTML, доступность (a11y) и SEO-оптимизация под капотом каждого интерфейса.' }
      ]
    },
    work: { title: 'Избранное.', viewAll: 'Все проекты' },
    metrics: { launched: 'Запущенных проектов', awards: 'Международных наград', perf: 'Lighthouse Performance', sotd: 'Site of the Day' },
    footer: { title1: 'ДАВАЙТЕ', title2: 'РАБОТАТЬ.', location: 'Прага, Чехия (CET)', rights: 'Все права защищены.' }
  },
  cs: {
    nav: { work: 'Práce', expertise: 'Odbornost', studio: 'Studio', contact: 'Probrat projekt' },
    hero: {
      subtitle: 'Nezávislé designové studio',
      title1: 'DIGITÁLNÍ',
      title2: 'PREZENCE.',
      desc: 'Spojujeme prémiovou typografii, filmové animace a špičkové webové technologie, abychom vytvářeli produkty, které nelze ignorovat.',
    },
    expertise: {
      titleBase: 'Strategický ',
      titleHighlight: 'zlatý střed.',
      titleEnd: ' Balancujeme mezi oceňovanou estetikou a nekompromisní konverzí.',
      items: [
        { title: 'Vlastní Typografie', desc: 'Základní fonty dělají design tuctovým. Vytváříme písma na míru a precizní systémy, aby vaše značka působila prestižně.' },
        { title: 'Smysluplná Animace', desc: 'Pohyb jako součást zážitku. Filmový scroll a plynulé přechody bez bílých obrazovek jsou znakem skutečné profesionality.' },
        { title: 'Interaktivní 3D', desc: 'Implementujeme WebGL a Three.js pro wow efekt. Fotorealistické modely mění běžné návštěvníky na vaše klienty.' },
        { title: 'Technický Základ', desc: 'Krása nesmí být pomalá. Dokonalá sémantika HTML, přístupnost (a11y) a SEO pod kapotou každého rozhraní.' }
      ]
    },
    work: { title: 'Vybrané.', viewAll: 'Všechny projekty' },
    metrics: { launched: 'Spuštěných projektů', awards: 'Světových ocenění', perf: 'Lighthouse Performance', sotd: 'Site of the Day' },
    footer: { title1: 'POJĎME', title2: 'SPOLUPRACOVAT.', location: 'Praha, Česko (CET)', rights: 'Všechna práva vyhrazena.' }
  }
};

// Хук для кинематографичного появления элементов при скролле
const useScrollReveal = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

export default function App() {
  const [lang, setLang] = useState('en'); // Состояние текущего языка
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const t = translations[lang]; // Текущий словарь

  // Эффект параллакса/слежения за мышью для фона
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Компонент-обертка для анимации появления
  const RevealSection = ({ children, className = '', delay = '' }) => {
    const [ref, isVisible] = useScrollReveal();
    return (
      <div
        ref={ref}
        className={`transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        } ${className} ${delay}`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="bg-[#050505] text-[#f4f4f0] min-h-screen font-sans overflow-hidden selection:bg-[#ff4500] selection:text-white">
      
      {/* Навигация с переключателем языков */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference p-6 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tighter uppercase">
          AGENCY<span className="text-[#ff4500]">.</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase">
          <a href="#work" className="hover:text-[#ff4500] transition-colors">{t.nav.work}</a>
          <a href="#expertise" className="hover:text-[#ff4500] transition-colors">{t.nav.expertise}</a>
          <a href="#studio" className="hover:text-[#ff4500] transition-colors">{t.nav.studio}</a>
        </div>

        <div className="flex items-center gap-6">
          {/* Переключатель языков */}
          <div className="flex gap-3 text-xs font-semibold text-neutral-500">
            {['en', 'uk', 'ru', 'cs'].map((l) => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`uppercase hover:text-white transition-colors ${lang === l ? 'text-white border-b border-[#ff4500]' : ''}`}
              >
                {l}
              </button>
            ))}
          </div>
          
          <button className="hidden sm:block text-sm font-medium uppercase tracking-wide border-b border-transparent hover:border-white transition-colors">
            {t.nav.contact}
          </button>
        </div>
      </nav>

      {/* Hero Секция */}
      <section className="relative h-screen flex flex-col justify-center px-6 md:px-12 z-10">
        <div 
          className="absolute inset-0 opacity-40 transition-transform duration-700 ease-out z-0 pointer-events-none"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Abstract 3D background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/80 to-[#050505]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <p className="text-[#ff4500] font-medium tracking-widest uppercase text-xs md:text-sm mb-6 animate-fade-in">
            {t.hero.subtitle}
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] leading-[0.9] font-bold tracking-tighter mb-8 mix-blend-lighten uppercase">
            {t.hero.title1}<br />
            <span className="italic font-serif font-light text-neutral-400">{t.hero.title2}</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end w-full">
            <p className="max-w-md text-lg text-neutral-400 font-light leading-relaxed">
              {t.hero.desc}
            </p>
            <div className="animate-bounce mt-8 md:mt-0">
              <ChevronDown className="w-8 h-8 text-neutral-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Экспертиза / Философия */}
      <section className="py-32 px-6 md:px-12 bg-[#0a0a0a] relative z-20" id="expertise">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-20 max-w-4xl">
              {t.expertise.titleBase}
              <span className="text-[#ff4500]">{t.expertise.titleHighlight}</span>
              {t.expertise.titleEnd}
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-neutral-800 pt-16">
            <RevealSection delay="delay-0">
              <div className="text-[#ff4500] mb-6"><Globe className="w-8 h-8" strokeWidth={1.5} /></div>
              <h3 className="text-xl font-medium mb-4">{t.expertise.items[0].title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">{t.expertise.items[0].desc}</p>
            </RevealSection>
            
            <RevealSection delay="delay-100">
              <div className="text-[#ff4500] mb-6"><Play className="w-8 h-8" strokeWidth={1.5} /></div>
              <h3 className="text-xl font-medium mb-4">{t.expertise.items[1].title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">{t.expertise.items[1].desc}</p>
            </RevealSection>

            <RevealSection delay="delay-200">
              <div className="text-[#ff4500] mb-6"><Sparkles className="w-8 h-8" strokeWidth={1.5} /></div>
              <h3 className="text-xl font-medium mb-4">{t.expertise.items[2].title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">{t.expertise.items[2].desc}</p>
            </RevealSection>

            <RevealSection delay="delay-300">
              <div className="text-[#ff4500] mb-6"><Code2 className="w-8 h-8" strokeWidth={1.5} /></div>
              <h3 className="text-xl font-medium mb-4">{t.expertise.items[3].title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">{t.expertise.items[3].desc}</p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Портфолио */}
      <section className="py-20 bg-[#050505]" id="work">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <RevealSection>
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">{t.work.title}</h2>
              <button className="hidden md:flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:text-[#ff4500] transition-colors">
                {t.work.viewAll} <MoveRight className="w-5 h-5" />
              </button>
            </div>
          </RevealSection>

          <div className="flex flex-col gap-24 md:gap-40">
            {/* Проект 1 */}
            <RevealSection>
              <div className="group cursor-pointer">
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-neutral-900 mb-8">
                  {/* Обрати внимание, я не использую "./" для изображений, как мы обсуждали */}
                  <img 
                    src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2000&auto=format&fit=crop" 
                    alt="Fashion Editorial Website" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/20">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 group-hover:text-[#ff4500] transition-colors">AURA Lingerie</h3>
                    <p className="text-neutral-400 font-light">E-commerce / Art Direction / Custom Typography</p>
                  </div>
                  <div className="text-sm font-medium border border-neutral-700 rounded-full px-4 py-1">2026</div>
                </div>
              </div>
            </RevealSection>

            {/* Проект 2 */}
            <RevealSection>
              <div className="group cursor-pointer">
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-neutral-900 mb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop" 
                    alt="Fintech 3D Website" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-80 group-hover:opacity-100 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-[#001020]/40 group-hover:bg-transparent transition-colors duration-500 mix-blend-multiply"></div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 group-hover:text-[#ff4500] transition-colors">Nexus Tech</h3>
                    <p className="text-neutral-400 font-light">Corporate Site / WebGL 3D / Animations</p>
                  </div>
                  <div className="text-sm font-medium border border-neutral-700 rounded-full px-4 py-1">2026</div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Social Proof & Подвал */}
      <section className="pt-32 pb-12 bg-[#050505] border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-neutral-900 pb-20 mb-20">
              <div>
                <div className="text-5xl font-bold mb-2">40<span className="text-[#ff4500]">+</span></div>
                <div className="text-neutral-500 text-sm font-light">{t.metrics.launched}</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">12</div>
                <div className="text-neutral-500 text-sm font-light">{t.metrics.awards}</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">98<span className="text-[#ff4500]">%</span></div>
                <div className="text-neutral-500 text-sm font-light">{t.metrics.perf}</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">Aww</div>
                <div className="text-neutral-500 text-sm font-light">{t.metrics.sotd}</div>
              </div>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="flex flex-col md:flex-row justify-between items-end gap-12">
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none max-w-2xl">
                {t.footer.title1}<br />{t.footer.title2}
              </h2>
              <div className="flex flex-col gap-4">
                <a href="mailto:hello@agency.com" className="text-2xl hover:text-[#ff4500] transition-colors underline underline-offset-8 decoration-neutral-800 hover:decoration-[#ff4500]">
                  hello@agency.com
                </a>
                <p className="text-neutral-500 font-light">{t.footer.location}</p>
              </div>
            </div>
          </RevealSection>

          <div className="mt-32 flex flex-col md:flex-row justify-between text-neutral-600 text-sm font-light">
            <p>&copy; {new Date().getFullYear()} Agency. {t.footer.rights}</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Awwwards</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}