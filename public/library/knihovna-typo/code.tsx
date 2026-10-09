import React, { useState, useMemo } from 'react';
import { Search, Book, Library, Hash, ArrowUpRight } from 'lucide-react';

// Парсинг данных из CSV (взял часть твоих данных для примера)
// В реальном проекте этот массив будет загружаться из базы данных или CSV файла
const rawData = [
  { id: 1, title: "The Evolution of Type: A Graphic Guide to 100 Landmark Typefaces", author: "Tony Seddon", year: "2015", tags: "type, teorie, history", coverUrl: null },
  { id: 2, title: "Dutch Type", author: "Jan Middendorp", year: "2004", tags: "type", coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400" }, // Пример с обложкой
  { id: 3, title: "Typography and Type Design in Slovakia", author: "Ľubomír Longauer", year: null, tags: "type, teorie, history", coverUrl: null },
  { id: 4, title: "Merz to Emigre and Beyond", author: "Steven Heller", year: "2003", tags: "graphic design, teorie, history, magazine", coverUrl: null },
  { id: 5, title: "WORKBOOK", author: "Magdalena Konečná", year: "2025", tags: "bachelor/diploma work, umprumtype", coverUrl: null },
  { id: 6, title: "A Subterranean Guide to the Underworld of D.I.Y. Crafts", author: "Žofia Fodorová", year: "2025", tags: "umprumtype, bachelor/diploma work", coverUrl: null },
  { id: 7, title: "ШРИФТЫ КИРИЛЛИЦА (kyrillische Schriften)", author: "H. Berthold AG", year: null, tags: "cyrillic, type", coverUrl: null },
  { id: 8, title: "Book of Letters From Аа to Яя", author: "Yuri Gordon", year: "2006", tags: "type, cyrillic", coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400" }, // Пример с обложкой
  { id: 9, title: "Transformation of Type Design", author: "Pavla Nečásková", year: "2024", tags: "bachelor/diploma work, umprumtype", coverUrl: null },
  { id: 10, title: "INDIEFONTS: A Compendium of Digital Type", author: "Tamye Riggs", year: "2002", tags: "type, specimen, katalog", coverUrl: null }
];

// Нормализация данных
const books = rawData.map(book => ({
  ...book,
  // Превращаем строку тегов в массив, убираем пробелы, делаем lowercase
  tagList: book.tags ? book.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
}));

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Извлекаем все уникальные теги из всех книг
  const allTags = useMemo(() => {
    const tags = new Set();
    books.forEach(book => book.tagList.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  // Фильтрация книг
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = selectedTag ? book.tagList.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-black selection:text-white pb-20">
      
      {/* Навигация / Шапка */}
      <header className="sticky top-0 z-50 bg-neutral-50/90 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4">
            
            <div className="flex items-center gap-3">
              <Library className="w-8 h-8" strokeWidth={1.5} />
              <div>
                <h1 className="text-2xl font-bold tracking-tight uppercase leading-none">Knihovna</h1>
                <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Typo. Archive</span>
              </div>
            </div>

            <div className="w-full md:w-auto flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Поиск по названию или автору..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border border-neutral-300 rounded-none py-2 pl-10 pr-4 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Панель тегов */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide pt-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`whitespace-nowrap px-3 py-1 text-xs uppercase tracking-wider font-medium border transition-colors ${
                selectedTag === null 
                  ? 'bg-neutral-900 text-white border-neutral-900' 
                  : 'bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`whitespace-nowrap px-3 py-1 text-xs uppercase tracking-wider font-medium border transition-colors flex items-center gap-1 ${
                  selectedTag === tag 
                    ? 'bg-neutral-900 text-white border-neutral-900' 
                    : 'bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-900 hover:text-neutral-900'
                }`}
              >
                <Hash className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        <div className="mb-8 flex justify-between items-end border-b border-neutral-200 pb-4">
          <h2 className="text-lg font-medium">
            {selectedTag ? `Тег: ${selectedTag}` : 'Все издания'}
          </h2>
          <span className="text-sm text-neutral-500">{filteredBooks.length} найдено</span>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 gap-y-12 gap-x-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-500 flex flex-col items-center">
            <Book className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">По вашему запросу ничего не найдено.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
              className="mt-4 underline decoration-neutral-300 hover:decoration-neutral-900 underline-offset-4"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </main>

    </div>
  );
}

// Компонент отдельной карточки книги
function BookCard({ book }) {
  return (
    <article className="group flex flex-col h-full cursor-pointer">
      {/* Обложка или Типографическая заглушка */}
      <div className="relative aspect-[3/4] w-full mb-4 bg-white border border-neutral-200 overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl shadow-sm">
        {book.coverUrl ? (
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover mix-blend-multiply"
          />
        ) : (
          <TypographicCover book={book} />
        )}
        
        {/* Hover overlay с кнопкой */}
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300">
             <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Метаданные (под обложкой) */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-bold text-neutral-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {book.title}
          </h3>
          {book.year && (
            <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 whitespace-nowrap">
              {book.year}
            </span>
          )}
        </div>
        
        <p className="text-sm text-neutral-600 mb-3 line-clamp-1">
          {book.author || 'Неизвестный автор'}
        </p>

        <div className="mt-auto flex flex-wrap gap-1">
          {book.tagList.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider bg-neutral-100 text-neutral-600 px-1.5 py-0.5 border border-neutral-200">
              {tag}
            </span>
          ))}
          {book.tagList.length > 3 && (
            <span className="text-[10px] text-neutral-400 px-1 pt-0.5">+{book.tagList.length - 3}</span>
          )}
        </div>
      </div>
    </article>
  );
}

// Компонент типографической обложки (когда нет картинки)
function TypographicCover({ book }) {
  // Для эстетики разбиваем длинные названия
  const titleWords = book.title.split(' ');
  const isLong = titleWords.length > 4;

  return (
    <div className="w-full h-full p-6 flex flex-col bg-neutral-50">
      {/* Верхний колонтитул */}
      <div className="flex justify-between border-b border-neutral-900 pb-2 mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Vol. {book.id.toString().padStart(3, '0')}</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{book.year || 'N/A'}</span>
      </div>

      {/* Название */}
      <div className="flex-grow flex items-center">
        <h2 className={`font-serif leading-[1.1] tracking-tight text-neutral-900 ${
          isLong ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
        }`} style={{ wordBreak: 'break-word' }}>
          {book.title}
        </h2>
      </div>

      {/* Нижний колонтитул */}
      <div className="pt-4 border-t border-neutral-900 mt-4">
        <p className="text-sm font-medium uppercase tracking-widest text-neutral-900">
          {book.author || 'Author Unknown'}
        </p>
        {book.tagList.includes('umprumtype') && (
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">UMPRUM Type</p>
        )}
      </div>
    </div>
  );
}