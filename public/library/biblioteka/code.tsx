import React, { useState, useMemo } from 'react';

// Иконки SVG для независимости от внешних библиотек
const Icons = {
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  )
};

// Моковые данные для книг (Тематика: Дизайн, Типографика, CS)
const LIBRARY_DATA = [
  { id: 1, title: 'Основы стиля в типографике', author: 'Роберт Брингхерст', tags: ['Типографика', 'Дизайн'], cover: 'bg-gradient-to-br from-gray-100 to-gray-300', textCol: 'text-gray-800' },
  { id: 2, title: 'Искусство цвета', author: 'Иоханнес Иттен', tags: ['Искусство', 'Дизайн'], cover: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-blue-500', textCol: 'text-white' },
  { id: 3, title: 'Грокаем алгоритмы', author: 'Адитья Бхаргава', tags: ['Computer Science'], cover: 'bg-[#f4f4f4] border border-gray-200', textCol: 'text-black' },
  { id: 4, title: 'Модульные системы в графическом дизайне', author: 'Йозеф Мюллер-Брокманн', tags: ['Типографика', 'Дизайн'], cover: 'bg-black', textCol: 'text-white' },
  { id: 5, title: 'Дизайн привычных вещей', author: 'Дон Норман', tags: ['UX/UI', 'Дизайн'], cover: 'bg-gradient-to-b from-blue-200 to-blue-400', textCol: 'text-gray-900' },
  { id: 6, title: 'Чистый код', author: 'Роберт Мартин', tags: ['Computer Science'], cover: 'bg-gradient-to-br from-green-700 to-green-900', textCol: 'text-white' },
  { id: 7, title: 'О шрифте', author: 'Эрик Шпикерманн', tags: ['Типографика'], cover: 'bg-[#e24a35]', textCol: 'text-white' },
  { id: 8, title: 'Визуальное мышление', author: 'Рудольф Арнхейм', tags: ['Искусство', 'Психология'], cover: 'bg-gradient-to-r from-purple-400 to-purple-600', textCol: 'text-white' },
  { id: 9, title: 'Компьютерные сети', author: 'Эндрю Таненбаум', tags: ['Computer Science'], cover: 'bg-indigo-900', textCol: 'text-white' },
  { id: 10, title: 'Новая типографика', author: 'Ян Чихольд', tags: ['Типографика', 'Дизайн'], cover: 'bg-gray-200', textCol: 'text-black' },
  { id: 11, title: 'Теория архитектуры', author: 'Витрувий', tags: ['Архитектура', 'Искусство'], cover: 'bg-[#c5bda8]', textCol: 'text-gray-900' },
  { id: 12, title: 'Эмоциональный дизайн', author: 'Дон Норман', tags: ['UX/UI', 'Психология'], cover: 'bg-pink-500', textCol: 'text-white' },
];

export default function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTags, setActiveTags] = useState([]);

  // Получаем все уникальные теги из данных
  const allTags = useMemo(() => {
    const tags = new Set();
    LIBRARY_DATA.forEach(book => book.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  // Фильтрация книг
  const filteredBooks = useMemo(() => {
    if (activeTags.length === 0) return LIBRARY_DATA;
    return LIBRARY_DATA.filter(book => 
      book.tags.some(tag => activeTags.includes(tag))
    );
  }, [activeTags]);

  const toggleTag = (tag) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f8f8] font-sans text-gray-900 overflow-hidden antialiased">
      
      {/* 1. ЛЕВАЯ ПАНЕЛЬ ФИЛЬТРОВ (Выезжает и сдвигает контент) */}
      <aside 
        className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-500 ease-in-out shrink-0 overflow-hidden ${
          isFilterOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="p-8 w-72">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-medium tracking-tight">Фильтры</h2>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-black transition-colors">
              <Icons.Close />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Теги и Категории</h3>
              <div className="flex flex-col space-y-2">
                {allTags.map(tag => (
                  <label key={tag} className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      activeTags.includes(tag) ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-gray-500'
                    }`}>
                      {activeTags.includes(tag) && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${activeTags.includes(tag) ? 'font-medium text-black' : 'text-gray-600 group-hover:text-black'}`}>
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {activeTags.length > 0 && (
              <button 
                onClick={() => setActiveTags([])}
                className="text-sm text-gray-500 hover:text-black underline decoration-gray-300 underline-offset-4 transition-all"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. ЦЕНТРАЛЬНАЯ ЧАСТЬ (Сетка книг) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-500 ease-in-out">
        {/* Шапка */}
        <header className="h-20 flex items-center px-8 md:px-12 shrink-0 border-b border-transparent">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity"
          >
            <Icons.Filter />
            <span>{isFilterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}</span>
          </button>
          <div className="flex-1 text-center font-medium tracking-widest uppercase text-xs text-gray-400">
            UMPRUM / KhNURE Library
          </div>
          <div className="w-20"></div> {/* Баланс для флекс-центра */}
        </header>

        {/* Скроллируемая область с сеткой */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className={`grid gap-x-8 gap-y-16 transition-all duration-500 ease-in-out
            ${selectedBook || isFilterOpen ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 md:grid-cols-4 xl:grid-cols-6'}
          `}>
            {filteredBooks.map((book) => (
              <div 
                key={book.id} 
                onClick={() => setSelectedBook(book)}
                className="group flex flex-col items-center cursor-pointer"
              >
                {/* Обложка книги с реалистичными тенями */}
                <div className="relative w-32 h-48 md:w-40 md:h-56 transition-transform duration-500 ease-out group-hover:-translate-y-3">
                  <div className={`absolute inset-0 shadow-[10px_15px_25px_rgba(0,0,0,0.12),_5px_5px_10px_rgba(0,0,0,0.05)] rounded-r-sm rounded-l-md overflow-hidden ${book.cover}`}>
                    {/* Текст на абстрактной обложке для красоты */}
                    <div className={`p-4 flex flex-col justify-between h-full ${book.textCol} opacity-80`}>
                      <span className="text-[10px] uppercase tracking-widest font-bold max-w-full break-words leading-tight">
                        {book.title}
                      </span>
                      <span className="text-[8px] tracking-wide mt-2">
                        {book.author}
                      </span>
                    </div>
                  </div>
                  {/* Эффект корешка книги слева */}
                  <div className="absolute top-0 left-0 bottom-0 w-[6px] bg-gradient-to-r from-black/20 to-transparent rounded-l-md"></div>
                  {/* Блик на обложке */}
                  <div className="absolute top-0 left-[6px] bottom-0 w-2 bg-gradient-to-r from-white/30 to-transparent"></div>
                </div>
                
                {/* Подпись под книгой (появляется или всегда видна) */}
                <div className="mt-6 text-center px-2">
                  <h4 className="text-sm font-medium text-gray-900 leading-snug">{book.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBooks.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              По вашему запросу ничего не найдено.
            </div>
          )}
        </div>
      </main>

      {/* 3. ПРАВАЯ ПАНЕЛЬ ДЕТАЛЕЙ (Оранжевая, как на референсе) */}
      <aside 
        className={`bg-[#e05424] text-black h-full flex flex-col transition-all duration-500 ease-in-out shrink-0 shadow-[-20px_0_40px_rgba(0,0,0,0.08)] overflow-hidden ${
          selectedBook ? 'w-80 md:w-[420px] opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="w-80 md:w-[420px] h-full flex flex-col relative">
          {/* Кнопка закрытия */}
          <button 
            onClick={() => setSelectedBook(null)}
            className="absolute top-8 left-6 p-2 text-black/60 hover:text-black transition-colors"
          >
            <Icons.ChevronLeft />
          </button>

          <div className="p-12 pt-24 flex-1 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest border-b border-black/20 pb-4 mb-10">
              Рекомендация недели
            </span>

            {selectedBook && (
              <div className="flex-1 flex flex-col items-center">
                {/* Большая версия обложки */}
                <div className={`w-48 h-72 md:w-56 md:h-80 shadow-[15px_25px_40px_rgba(0,0,0,0.25)] rounded-r-sm rounded-l-md relative mb-12 ${selectedBook.cover}`}>
                   <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-r from-black/30 to-transparent rounded-l-md"></div>
                   <div className="absolute top-0 left-2 bottom-0 w-3 bg-gradient-to-r from-white/30 to-transparent"></div>
                   <div className={`p-6 flex flex-col justify-between h-full ${selectedBook.textCol}`}>
                      <span className="text-sm uppercase tracking-widest font-bold leading-tight">
                        {selectedBook.title}
                      </span>
                      <span className="text-xs tracking-wide">
                        {selectedBook.author}
                      </span>
                    </div>
                </div>

                <div className="text-center w-full">
                  <h2 className="text-2xl font-semibold mb-2 leading-tight">{selectedBook.title}</h2>
                  <p className="text-sm font-medium opacity-80 mb-6">{selectedBook.author}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {selectedBook.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-black/5 text-xs font-medium uppercase tracking-wider rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm opacity-80 leading-relaxed italic text-center px-4">
                     Классическое издание, обязательное к прочтению для всех, кто интересуется темой "{selectedBook.tags[0].toLowerCase()}". 
                     Эта книга раскрывает фундаментальные концепции и предлагает свежий взгляд на знакомые вещи.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-8 border-t border-black/10 text-center text-xs opacity-60">
            UMPRUM &times; KhNURE Library, 2026
          </div>
        </div>
      </aside>

    </div>
  );
}