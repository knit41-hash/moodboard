import { useState, useEffect } from 'react';

interface BoardItem {
  id: string;
  type: 'image' | 'text' | 'color';
  content: string;
  color?: string;
  createdAt: number;
}

const defaultColors = [
  '#fce7f3', '#f3e8ff', '#e0e7ff', '#dbeafe', '#d1fae5',
  '#fef3c7', '#ffe4e6', '#ede9fe', '#cffafe', '#fecdd3'
];

const inspirationTexts = [
  "Dream big 💫",
  "Self love 🤍",
  "Healthy lifestyle 🌿",
  "Confidence 👑",
  "Inner peace 🕊️",
  "Glow up ✨",
  "Motivation 🔥",
  "Beauty 🌸",
];

export default function VisionBoard() {
  const [items, setItems] = useState<BoardItem[]>(() => {
    const saved = localStorage.getItem('vision-board');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', type: 'text', content: '✨ Моя лучшая версия ✨', color: '#f3e8ff', createdAt: Date.now() },
      { id: '2', type: 'text', content: 'Здоровье и красота 🌿', color: '#d1fae5', createdAt: Date.now() - 1000 },
      { id: '3', type: 'text', content: 'Стиль и элегантность 👗', color: '#fce7f3', createdAt: Date.now() - 2000 },
    ];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemType, setNewItemType] = useState<'image' | 'text' | 'color'>('text');
  const [newText, setNewText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);

  useEffect(() => {
    localStorage.setItem('vision-board', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    const newItem: BoardItem = {
      id: Date.now().toString(),
      type: newItemType,
      content: newItemType === 'image' ? newImageUrl : newText || inspirationTexts[Math.floor(Math.random() * inspirationTexts.length)],
      color: newItemType === 'text' ? selectedColor : undefined,
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
    setShowAddModal(false);
    setNewText('');
    setNewImageUrl('');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-purple-800">🎨 Мой мудборд</h2>
          <p className="text-xs text-purple-400 mt-1">Вдохновение для лучшей версии себя</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="gradient-btn text-sm px-4 py-2"
        >
          + Добавить
        </button>
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 gap-3 space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="masonry-item glass-card overflow-hidden group relative"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {item.type === 'image' ? (
              <div className="relative">
                <img
                  src={item.content}
                  alt="Vision board"
                  className="w-full object-cover rounded-t-[20px]"
                  style={{ minHeight: '120px', maxHeight: '250px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%23e9d5ff"><rect width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%238b5cf6" font-size="40">🖼️</text></svg>';
                  }}
                />
                <button
                  onClick={() => deleteItem(item.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                className="p-4 min-h-[100px] flex items-center justify-center text-center relative"
                style={{ backgroundColor: item.color || '#f3e8ff' }}
              >
                <p className="text-sm font-bold text-purple-800">{item.content}</p>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/20 text-purple-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="glass-card p-8 text-center">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-purple-600 text-sm">Добавь первое вдохновение!</p>
          <p className="text-purple-400 text-xs mt-1">Картинки, цитаты, цвета</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-800 mb-4">Добавить на мудборд</h3>
            
            {/* Type Selector */}
            <div className="flex gap-2 mb-4">
              {[
                { type: 'text' as const, icon: '📝', label: 'Текст' },
                { type: 'image' as const, icon: '🖼️', label: 'Картинка' },
              ].map(t => (
                <button
                  key={t.type}
                  onClick={() => setNewItemType(t.type)}
                  className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all ${
                    newItemType === t.type
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                      : 'bg-purple-50 text-purple-600 border border-purple-200'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {newItemType === 'text' ? (
              <div className="space-y-3">
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Напиши вдохновляющую цитату или цель..."
                  className="input-field min-h-[80px] resize-none"
                />
                <div>
                  <p className="text-xs text-purple-400 mb-2">Выбери цвет:</p>
                  <div className="flex flex-wrap gap-2">
                    {defaultColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'border-purple-500 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Вставь URL картинки..."
                  className="input-field"
                />
                <p className="text-xs text-purple-400">
                  💡 Найди картинку в Pinterest → нажми "Поделиться" → скопируй ссылку на изображение
                </p>
                {newImageUrl && (
                  <div className="rounded-xl overflow-hidden border border-purple-200">
                    <img
                      src={newImageUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <button
              onClick={addItem}
              className="gradient-btn w-full mt-4"
            >
              ✨ Добавить на мудборд
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
