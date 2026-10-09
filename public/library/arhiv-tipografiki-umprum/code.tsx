import React, { useState, useMemo } from 'react';
import { Search, Grid, List, Clock, X } from 'lucide-react';

// Данные, извлеченные из предоставленного CSV файла
const archiveData = [
  { id: 1, title: "The Evolution of Type: A Graphic Guide to 100 Landmark Typefaces", author: "Tony Seddon", year: null, tags: ["type", "teorie", "history"] },
  { id: 2, title: "Dutch Type", author: "Jan Middendorp", year: null, tags: ["type"] },
  { id: 3, title: "Typography and Type Design in Slovakia It All Began with Cyril and Methodius", author: "Ľubomír Longauer", year: null, tags: ["type", "teorie", "history"] },
  { id: 4, title: "Merz to Emigre and Beyond", author: "Steven Heller", year: null, tags: ["graphic design", "teorie", "history", "magazine"] },
  { id: 5, title: "INITIAL INITIATIVE INITIALIZATION OF INITIALS", author: "Simona Császárová", year: null, tags: ["graphic design", "teorie", "history"] },
  { id: 6, title: "Grafológia", author: "Jozef Mistrík", year: 1982, tags: ["graphic design", "teorie"] },
  { id: 7, title: "Fernand Baudin Prize 2012 / Dossier Fernand Baudin", author: "Coline Sunier, Charles Mazé", year: null, tags: ["type"] },
  { id: 8, title: "Slab Serif Type: A Century of Bold Letterforms", author: "Steven Heller, Louise Fili", year: null, tags: ["type"] },
  { id: 9, title: "SNKLHU - Odeon (1953–1995): České knižní obálky v edičních řadách", author: "Nikola Klímová", year: null, tags: ["katalog", "book making"] },
  { id: 10, title: "Book of Letters From Аа to Яя", author: "Yuri Gordon", year: null, tags: ["type", "cyrillic"] },
  { id: 11, title: "Von deutscher Sprache und Schrift", author: "Hans Riegelmann", year: null, tags: [] },
  { id: 12, title: "Cyrillic Type Design Tips", author: "Elina Semenova", year: null, tags: ["type", "cyrillic"] },
  { id: 13, title: "Gewone letters: Gerrit's early models", author: "Geen Bitter", year: null, tags: ["type", "teorie"] },
  { id: 14, title: "Rozhovory o písmu rukopisném", author: "Lencová Radana", year: null, tags: ["type"] },
  { id: 15, title: "Naičitateľnejšie písmo na svete", author: "David Kalata", year: 2018, tags: ["type"] },
  { id: 16, title: "UM", author: "Emma Ondrová", year: 2021, tags: ["umprumtype", "specimen"] },
  { id: 17, title: "????????????????/", author: "Rozálie Halířová", year: 2024, tags: ["umprumtype"] },
  { id: 18, title: "WORKBOOK", author: "Magdalena Konečná", year: 2025, tags: ["bachelor/diploma work", "umprumtype"] },
  { id: 19, title: "Transformation of Type Design", author: "Pavla Nečásková", year: 2024, tags: ["bachelor/diploma work", "umprumtype"] },
  { id: 20, title: "Adast newspaper", author: "Magdalena Konečná", year: null, tags: ["umprumtype"] },
  { id: 21, title: "Adast", author: "Magdalena Konečná", year: 2023, tags: ["bachelor/diploma work", "umprumtype"] },
  { id: 22, title: "A Subterranean Guide to the Underworld of D.I.Y. Crafts...", author: "Žofia Fodorová", year: 2025, tags: ["umprumtype", "bachelor/diploma work"] },
  { id: 23, title: "The Slanted Yearbook of Type III", author: "Slanted", year: 2018, tags: ["specimen", "katalog", "type"] },
  { id: 24, title: "iniciály", author: "Jolana Kimlová", year: null, tags: ["umprum"] },
  { id: 25, title: "ШРИФТЫ КИРИЛЛИЦА (kyrillische Schriften)", author: "H. Berthold AG", year: null, tags: ["cyrillic", "type"] },
  { id: 26, title: "INDIEFONTS: A Compendium of Digital Type...", author: "Tamye Riggs, James Grieshaber, Richard Kegler", year: 2002, tags: ["type", "specimen", "katalog"] },
  { id: 27, title: "MATA PEPRNA", author: "Milos Sodion, Zdeněk Seydi", year: 1944, tags: ["beletrie"] },
  { id: 28, title: "PAMĚTI NÁRODA", author: "Ateliér filmové a televizní grafiky", year: 2020, tags: [] }
];

export default function App() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'timeline'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Извлекаем уникальные теги
  const allTags = useMemo(() => {
    const tags = new Set();
    archiveData.forEach(item => {
      item.tags.forEach(tag => tags.add(tag.trim().toLowerCase()));
    });
    return Array.from(tags).sort();
  }, []);

  // Фильтрация данных
  const filteredData = useMemo(() => {
    return archiveData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag ? item.tags.some(t => t.trim().toLowerCase() === selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  // Группировка для таймлайна
  const timelineData = useMemo(() => {
    const withYear = filteredData.filter(item => item.year).sort((a, b) => a.year - b.year);
    const grouped = {};
    withYear.forEach(item => {
      if (!grouped[item.year]) grouped[item.year] = [];
      grouped[item.year].push(item);
    });
    return grouped;
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-[#111] font-sans selection:bg-[#ff3b00] selection:text-white">
      {/* Навигация и заголовок */}
      <header className="sticky top-0 z-50 bg-[#f4f4f0]/90 backdrop-blur-md border-b border-[#111]">
        <div className="p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Архив<br />Типографики
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest font-medium text-gray-500">
              Knihovna Typo / Собрание UMPRUM
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex items-center border border-[#111] rounded-full overflow-hidden bg-white/50">
              <div className="pl-4 pr-2">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Поиск по названию или автору..." 
                className="bg-transparent py-3 pr-4 outline-none w-full md:w-64 text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-[#111] text-white' : 'hover:bg-gray-200'}`}
                title="Сетка"
              >
                <Grid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-[#111] text-white' : 'hover:bg-gray-200'}`}
                title="Список"
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'timeline' ? 'bg-[#111] text-white' : 'hover:bg-gray-200'}`}
                title="Таймлайн"
              >
                <Clock size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Теги */}
        <div className="px-4 md:px-8 py-4 flex gap-2 overflow-x-auto no-scrollbar border-t border-[#111]/10">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full whitespace-nowrap transition-all ${
              selectedTag === null ? 'bg-[#ff3b00] text-white border border-[#ff3b00]' : 'bg-transparent border border-[#111] hover:bg-[#111] hover:text-white'
            }`}
          >
            Все работы ({archiveData.length})
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full whitespace-nowrap transition-all ${
                selectedTag === tag ? 'bg-[#ff3b00] text-white border border-[#ff3b00]' : 'bg-transparent border border-[#111]/30 hover:border-[#111]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      {/* Основной контент */}
      <main className="p-4 md:p-8">
        
        {filteredData.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-400">Ничего не найдено</h2>
          </div>
        )}

        {/* Вид: Сетка */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map(item => (
              <div key={item.id} className="group relative border border-[#111] bg-white aspect-[3/4] flex flex-col justify-between p-6 transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold border border-[#111] px-2 py-1 rounded-sm">
                      {item.year || 'N/A'}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest text-right w-1/2 break-words">
                      {item.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold leading-tight mb-4 group-hover:text-[#ff3b00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium opacity-70 uppercase tracking-wide">
                    {item.author}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-6">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase bg-gray-100 px-2 py-1 tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Вид: Список */}
        {viewMode === 'list' && (
          <div className="flex flex-col border-t border-[#111]">
            {filteredData.map(item => (
              <div key={item.id} className="group flex flex-col md:flex-row border-b border-[#111] hover:bg-[#111] hover:text-white transition-colors cursor-pointer p-4 gap-4 items-start md:items-center">
                <div className="w-16 text-xs font-bold opacity-50 font-mono">
                  {item.year || '----'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold leading-none mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs uppercase tracking-widest opacity-80">
                    {item.author}
                  </p>
                </div>
                <div className="w-full md:w-1/3 flex flex-wrap gap-2 justify-start md:justify-end">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase border border-current px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Вид: Таймлайн (для элементов с годом) */}
        {viewMode === 'timeline' && (
          <div className="relative py-12">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-[#111]/20"></div>
            
            {Object.keys(timelineData).length === 0 ? (
              <p className="text-center text-gray-500 uppercase tracking-widest">Нет данных с указанием года для текущего фильтра.</p>
            ) : (
              Object.keys(timelineData).sort((a,b) => b - a).map((year, index) => (
                <div key={year} className="relative mb-24 flex flex-col md:flex-row items-center">
                  <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end md:pr-16' : 'md:order-2 md:justify-start md:pl-16'} pl-16 md:pl-0 mb-4 md:mb-0`}>
                    <div className="flex flex-col gap-4 w-full max-w-md">
                      {timelineData[year].map(item => (
                        <div key={item.id} className="bg-white border-2 border-[#111] p-5 shadow-[4px_4px_0px_0px_rgba(255,59,0,1)]">
                          <h4 className="font-bold text-lg leading-tight mb-2">{item.title}</h4>
                          <p className="text-xs uppercase tracking-wider text-gray-600 mb-3">{item.author}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-bold uppercase bg-[#111] text-white px-1.5 py-0.5">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute left-8 md:left-1/2 w-16 h-16 -ml-8 bg-[#ff3b00] rounded-full border-4 border-[#f4f4f0] flex items-center justify-center text-white font-black z-10 transform hover:scale-110 transition-transform cursor-default">
                    {year}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}