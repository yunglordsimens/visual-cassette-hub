import React from 'react';

// Данные для списка проектов
const projects = [
  { title: "ANGELTEAR - UNDERWORLD", subtitle: "DIRECTION - CAMERA - EDITING" },
  { title: "ANGELTEAR - GANTZ" },
  { title: "MARO DEL LOVE - WW3" },
  { title: "ANGELTEAR - FASHION3STYLE" },
  { title: "1MADONNA - UNRELEASED" },
  { title: "TMTM - DARKSIDE" },
  { title: "VENKTOVKA - MIKE DEAN" },
  { title: "GORETEX - DR MAX" },
  { title: "TRASHBAGFACE - HEALER" },
  { title: "ANGELTEAR - ADIDAS" },
  { title: "YUNG GREX - MOVE" },
  { title: "ANGELTEAR - DARK PEGAS" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-24">
      {/* Кастомные стили для типографики. 
        Подключаем Anton для акцентного лого и Oswald для плотного, высокого списка.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@700&display=swap');
        
        .font-logo {
          font-family: 'Anton', sans-serif;
          /* Экстремально вытягиваем шрифт по вертикали для достижения эффекта со скриншота */
          transform: scaleY(2.2);
          transform-origin: center;
          letter-spacing: -0.01em;
        }
        
        .font-list {
          font-family: 'Oswald', sans-serif;
          letter-spacing: 0.01em;
        }
      `}} />

      {/* Основной контейнер. Ограничиваем ширину для сохранения мобильного вайба даже на десктопе */}
      <main className="max-w-xl mx-auto px-5 sm:px-8 pt-16 flex flex-col items-center">
        
        {/* Хедер / Логотип */}
        <header className="w-full flex justify-center mt-12 mb-32 h-20 sm:h-32">
          <h1 className="font-logo text-[5.5rem] sm:text-[8rem] uppercase text-center leading-none text-black">
            Angeltear
          </h1>
        </header>

        {/* Галерея изображений */}
        <section className="w-full flex flex-col gap-6 sm:gap-8 mb-20">
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item} 
              className="w-full aspect-[4/5] sm:aspect-[3/4] relative overflow-hidden flex items-center justify-center bg-[#0a0a0a]"
            >
              {/* Плейсхолдер */}
              <div className="absolute inset-0 flex flex-col items-center justify-center border border-neutral-800">
                 <span className="text-neutral-800 font-logo text-5xl tracking-widest scale-y-150">
                   IMAGE {item}
                 </span>
              </div>
              
              {/* Пример вставки реального изображения (путь без "./"):
                <img 
                  src={`image-${item}.jpg`} 
                  alt={`Project visual ${item}`} 
                  className="absolute inset-0 object-cover w-full h-full grayscale contrast-125" 
                /> 
              */}
            </div>
          ))}
        </section>

        {/* Список проектов */}
        <section className="w-full flex flex-col items-start gap-5 sm:gap-7 mt-8 px-1">
          {projects.map((project, idx) => (
            <div key={idx} className="flex flex-col">
              <h2 className="font-list text-3xl sm:text-4xl uppercase font-bold text-black leading-none">
                {project.title}
              </h2>
              {/* Рендерим подзаголовок, если он есть (с сильным трекингом) */}
              {project.subtitle && (
                <p className="font-sans text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase font-bold text-black mt-2">
                  {project.subtitle}
                </p>
              )}
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}