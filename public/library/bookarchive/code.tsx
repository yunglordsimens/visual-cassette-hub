import React from 'react';

// Моковые данные для нашего архива книг (16 книг)
const archiveData = [
  { id: 1, date: '08/20/20', time: '04:06 PM', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&h=400&fit=crop', title: 'Основы стиля в типографике', author: 'Роберт Брингхерст' },
  { id: 2, date: '09/28/19', time: '04:23 AM', cover: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=400&h=400&fit=crop', title: 'Новая Типографика', author: 'Ян Чихольд' },
  { id: 3, date: '09/29/19', time: '10:53 PM', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&h=400&fit=crop', title: 'Модульные системы', author: 'Йозеф Мюллер-Брокманн' },
  { id: 4, date: '10/08/19', time: '01:13 AM', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&h=400&fit=crop', title: 'О шрифте', author: 'Эрик Шпикерманн' },
  { id: 5, date: '10/13/19', time: '01:15 AM', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&h=400&fit=crop', title: 'Искусство цвета', author: 'Иоханнес Иттен' },
  { id: 6, date: '09/16/20', time: '10:52 AM', cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&h=400&fit=crop', title: 'Дизайн привычных вещей', author: 'Дон Норман' },
  { id: 7, date: '11/06/20', time: '01:21 PM', cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&h=400&fit=crop', title: '1984', author: 'Джордж Оруэлл' },
  { id: 8, date: '11/28/20', time: '08:27 PM', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&h=400&fit=crop', title: 'Мастер и Маргарита', author: 'Михаил Булгаков' },
  { id: 9, date: '12/08/19', time: '01:34 PM', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=400&h=400&fit=crop', title: 'Преступление и наказание', author: 'Федор Достоевский' },
  { id: 10, date: '09/14/20', time: '04:35 AM', cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400&h=400&fit=crop', title: 'Кобзар', author: 'Тарас Шевченко' },
  { id: 11, date: '12/25/19', time: '03:21 PM', cover: 'https://images.unsplash.com/photo-1629196914275-f9b23b184200?q=80&w=400&h=400&fit=crop', title: 'Типографика и дизайн', author: 'Эмиль Рудер' },
  { id: 12, date: '05/12/20', time: '01:34 PM', cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=400&h=400&fit=crop', title: 'Шрифт и логотип', author: 'Адриан Фрутигер' },
  { id: 13, date: '01/01/20', time: '09:41 AM', cover: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400&h=400&fit=crop', title: 'Архитектура книги', author: 'Владимир Фаворский' },
  { id: 14, date: '01/19/20', time: '11:46 PM', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&h=400&fit=crop', title: 'Смерть Ивана Ильича', author: 'Лев Толстой' },
  { id: 15, date: '01/25/20', time: '02:59 PM', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&h=400&fit=crop', title: 'История кириллицы', author: 'Неизвестный' },
  { id: 16, date: '02/01/20', time: '04:11 AM', cover: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=400&h=400&fit=crop', title: 'Искусство формы', author: 'Иоханнес Иттен' },
];

// Текстовый блок - теперь это строгий невидимый квадрат
const MetaText = ({ date, time }) => (
  <div className="w-full aspect-square flex flex-col justify-start text-[14px] md:text-[15px] lg:text-[16px] font-sans tracking-tight leading-[1.1] text-gray-900 pt-1">
    <span>{date}</span>
    <span>{time}</span>
  </div>
);

// Блок с обложкой книги - тоже строгий квадрат
const BookCover = ({ cover, title, author }) => (
  <div className="w-full aspect-square bg-gray-200 relative group overflow-hidden shadow-sm">
    <img src={cover} alt={title} className="w-full h-full object-cover grayscale-[30%] contrast-125" />
    
    {/* Оверлей при наведении с информацией о книге */}
    <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <span className="text-white text-sm font-medium mb-1 leading-tight">{title}</span>
      <span className="text-gray-400 text-xs italic">{author}</span>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-12 md:py-20 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Заголовок архива */}
        <header className="mb-12 md:mb-20">
          <h1 className="text-3xl md:text-5xl font-medium tracking-tighter text-gray-900 mb-2">Typography Archive</h1>
          <p className="text-gray-500 tracking-tight">Visual communications collection</p>
        </header>

        {/* СЕКРЕТ ИДЕАЛЬНОЙ ШАХМАТКИ: 
          Отступ (gap) в главном контейнере должен быть РАВЕН отступу во внутреннем контейнере.
          Тогда визуально это будет единая сплошная сетка из 8 квадратов в ширину.
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {archiveData.map((book, i) => {
            // Математика для сохранения шахматного порядка:
            // На десктопе меняем порядок каждую 4-ю книгу (каждый новый ряд)
            const deskSwap = Math.floor(i / 4) % 2 !== 0; 
            // На мобилке меняем порядок каждую 2-ю книгу
            const mobSwap = Math.floor(i / 2) % 2 !== 0; 

            return (
              // gap-4 md:gap-6 - ВАЖНО: точно такой же отступ, как у родителя!
              <div key={book.id} className="grid grid-cols-2 gap-4 md:gap-6 items-start">
                <div className={`${mobSwap ? 'order-2' : 'order-1'} md:${deskSwap ? 'order-2' : 'order-1'}`}>
                  <MetaText date={book.date} time={book.time} />
                </div>
                <div className={`${mobSwap ? 'order-1' : 'order-2'} md:${deskSwap ? 'order-1' : 'order-2'}`}>
                  <BookCover cover={book.cover} title={book.title} author={book.author} />
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}