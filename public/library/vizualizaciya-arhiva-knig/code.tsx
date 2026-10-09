import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';

// Встроенный фрагмент данных из твоего CSV для мгновенной отрисовки
const rawCSV = `NAME / TITLE,AUTHOR,YEAR,TAGS
The Evolution of Type: A Graphic Guide to 100 Landmark Typefaces,Tony Seddon,,"type, teorie, history"
Dutch Type,Jan Middendorp,,type
Typography and Type Design in Slovakia It All Began with Cyril and Methodius,Ľubomír Longauer,,"type, teorie, history"
Merz to Emigre and Beyond,Steven Heller,,"graphic design, teorie, history, magazine"
INITIAL INITIATIVE INITIALIZATION OF INITIALS,Simona Császárová,,"graphic design, teorie, history"
Grafológia,Jozef Mistrík,1982,"graphic design, teorie"
Fernand Baudin Prize 2012 / Dossier Fernand Baudin,"Coline Sunier, Charles Mazé",,type
Slab Serif Type: A Century of Bold Letterforms,"Steven Heller, Louise Fili",,type
SNKLHU - Odeon (1953–1995): České knižní obálky v edičních řadách,Nikola Klímová,,"katalog, book making"
Book of Letters From Аа to Яя,Yuri Gordon,,"type, cyrillic"
Von deutscher Sprache und Schrift,Hans Riegelmann,,
Cyrillic Type Design Tips,Elina Semenova,,"type, cyrillic"
Gewone letters: Gerrit's early models,Geen Bitter,,"type, teorie"
Rozhovory o písmu rukopisném,Lencová Radana,,type
Naičitateľnejšie písmo na svete,David Kalata,2018,type
UM,Emma Ondrová,2021,"umprumtype, specimen"
????????????????/,Rozálie Halířová,2024,umprumtype
WORKBOOK,Magdalena Konečná,2025,"bachelor/diploma work, umprumtype"
Transformation of Type Design,Pavla Nečásková,2024,"bachelor/diploma work, umprumtype"
Adast newspaper,Magdalena Konečná,,umprumtype
Adast,Magdalena Konečná,2023,"bachelor/diploma work, umprumtype"
"A Subterranean Guide to the Underworld of D.I.Y. Crafts",Žofia Fodorová,2025,"umprumtype, bachelor/diploma work"
The Slanted Yearbook of Type III,Slanted,2018,"specimen, katalog, type"
iniciály,Jolana Kimlová,,umprum
ШРИФТЫ КИРИЛЛИЦА (kyrillische Schriften),H. Berthold AG,,"cyrillic, type"
INDIEFONTS: A Compendium of Digital Type,"Tamye Riggs, James Grieshaber",2002,"type, specimen, katalog"`;

// Функция парсинга CSV с учетом кавычек
const parseCSV = (csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Регулярное выражение для разделения по запятым, игнорируя запятые внутри кавычек
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const values = line.split(regex).map(val => val.replace(/^"|"$/g, '').trim());

    if (values.length >= 4) {
      result.push({
        title: values[0] || 'Unknown Title',
        author: values[1] || 'Unknown Author',
        year: values[2] || 'N/A',
        tags: values[3] ? values[3].split(',').map(t => t.trim().toLowerCase()) : ['untagged']
      });
    }
  }
  return result;
};

// Цветовая палитра, вдохновленная швейцарской школой дизайна (чистые, сильные цвета)
const colorScale = d3.scaleOrdinal()
  .range(['#E63946', '#457B9D', '#1D3557', '#2A9D8F', '#E9C46A', '#F4A261', '#8338EC', '#3A0CA3']);

export default function App() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Подготовка данных для графа
  const graphData = useMemo(() => {
    const books = parseCSV(rawCSV);
    const nodes = [];
    const links = [];
    const tagCounts = {};

    // Подсчет книг по тегам
    books.forEach(book => {
      book.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Создание узлов для тегов (категорий)
    Object.keys(tagCounts).forEach(tag => {
      nodes.push({
        id: `tag-${tag}`,
        name: tag,
        group: 'tag',
        radius: Math.max(15, Math.min(50, tagCounts[tag] * 8)), // Размер зависит от количества книг
        count: tagCounts[tag]
      });
    });

    // Создание узлов для книг и связей
    books.forEach((book, index) => {
      const bookId = `book-${index}`;
      nodes.push({
        id: bookId,
        name: book.title,
        author: book.author,
        year: book.year,
        tags: book.tags,
        group: 'book',
        radius: 6 // Фиксированный размер для книг
      });

      book.tags.forEach(tag => {
        links.push({
          source: bookId,
          target: `tag-${tag}`
        });
      });
    });

    return { nodes, links };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Очистка при ререндере

    // Настройка симуляции физики (Force Directed Graph)
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(d => d.target.group === 'tag' ? 80 : 30))
      .force("charge", d3.forceManyBody().strength(-150)) // Отталкивание узлов друг от друга
      .force("center", d3.forceCenter(width / 2, height / 2)) // Центрирование
      .force("collide", d3.forceCollide().radius(d => d.radius + 10).iterations(2)); // Предотвращение наложения

    // Создание контейнера для зума/панорамирования
    const g = svg.append("g");

    // Настройка зума
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Отрисовка линий (связей)
    const link = g.append("g")
      .attr("stroke", "#d1d5db") // Tailwind gray-300
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", 1.5);

    // Отрисовка узлов
    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.group === 'tag' ? colorScale(d.name) : '#9ca3af') // Цвет тега или серый для книги
      .call(drag(simulation));

    // Добавление текста (названий) только для узлов-тегов
    const labels = g.append("g")
      .selectAll("text")
      .data(graphData.nodes.filter(d => d.group === 'tag'))
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .text(d => d.name)
      .style("font-family", "Inter, sans-serif")
      .style("font-size", d => Math.max(10, d.radius * 0.4) + "px")
      .style("font-weight", "600")
      .style("fill", "#ffffff")
      .style("pointer-events", "none");

    // Интерактивность (Hover и Click)
    node.on("mouseover", (event, d) => {
      setHoveredNode(d);
      
      // Подсветка связей
      link.attr("stroke", l => (l.source.id === d.id || l.target.id === d.id) ? "#1f2937" : "#e5e7eb")
          .attr("stroke-opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.2);
      
      node.attr("opacity", n => {
        if (n.id === d.id) return 1;
        const isConnected = graphData.links.some(l => 
          (l.source.id === d.id && l.target.id === n.id) || 
          (l.target.id === d.id && l.source.id === n.id)
        );
        return isConnected ? 1 : 0.3;
      });
    })
    .on("mouseout", () => {
      setHoveredNode(null);
      link.attr("stroke", "#d1d5db").attr("stroke-opacity", 0.6);
      node.attr("opacity", 1);
    })
    .on("click", (event, d) => {
      setSelectedNode(d);
    });

    // Обновление позиций на каждом тике симуляции
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Функция Drag & Drop
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [graphData]);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800">
      
      {/* Область визуализации (Граф) */}
      <div className="relative flex-1" ref={containerRef}>
        {/* Подсказка при наведении (Tooltip) */}
        {hoveredNode && (
          <div 
            className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200 pointer-events-none"
          >
            <p className="text-sm font-semibold">
              {hoveredNode.group === 'tag' ? '#' + hoveredNode.name : hoveredNode.name}
            </p>
            {hoveredNode.group === 'tag' && (
              <p className="text-xs text-slate-500">Книг: {hoveredNode.count}</p>
            )}
            {hoveredNode.group === 'book' && (
              <p className="text-xs text-slate-500">{hoveredNode.author}</p>
            )}
          </div>
        )}
        
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        {/* Инструкция */}
        <div className="absolute bottom-6 left-6 text-xs text-slate-400 max-w-xs">
          Скролл для масштабирования. Тяните узлы мышкой. Кликните для подробностей.
        </div>
      </div>

      {/* Боковая панель с информацией (Типографически акцентированная) */}
      <div className="w-80 bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1 uppercase">Knihovna</h1>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Typo Archive</h2>
        </div>

        {selectedNode ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {selectedNode.group === 'book' ? (
              <>
                <div className="mb-2 text-xs font-bold text-blue-600 uppercase tracking-wider">Издание</div>
                <h3 className="text-xl font-serif text-slate-900 leading-tight mb-4">{selectedNode.name}</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-slate-400 text-xs uppercase mb-1">Автор</span>
                    <span className="font-medium">{selectedNode.author}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase mb-1">Год</span>
                    <span className="font-medium">{selectedNode.year || 'Не указан'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase mb-1">Теги</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedNode.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 text-xs font-bold text-rose-500 uppercase tracking-wider">Категория</div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-4 capitalize">{selectedNode.name}</h3>
                <div className="text-sm">
                  <span className="block text-slate-400 text-xs uppercase mb-1">Количество в архиве</span>
                  <span className="text-3xl font-light text-slate-800">{selectedNode.count}</span>
                </div>
                
                <div className="mt-8">
                  <span className="block text-slate-400 text-xs uppercase mb-3">Связанные издания</span>
                  <ul className="space-y-2 text-sm">
                    {graphData.nodes
                      .filter(n => n.group === 'book' && n.tags.includes(selectedNode.name))
                      .map(book => (
                        <li key={book.id} className="text-slate-600 truncate border-l-2 border-slate-200 pl-3 hover:border-slate-800 transition-colors">
                          {book.name}
                        </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center opacity-50">
            <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm">Выберите узел на графе, чтобы увидеть детали издания или категории.</p>
          </div>
        )}
      </div>

    </div>
  );
}