import { useState, useEffect } from 'react';

interface Pin {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  category: string;
  note: string;
  createdAt: number;
}

const pinCategories = [
  { id: 'all', label: 'Все', emoji: '📌' },
  { id: 'recipes', label: 'Рецепты', emoji: '🍽️' },
  { id: 'fashion', label: 'Мода', emoji: '👗' },
  { id: 'beauty', label: 'Красота', emoji: '💄' },
  { id: 'fitness', label: 'Фитнес', emoji: '💪' },
  { id: 'decor', label: 'Декор', emoji: '🏠' },
  { id: 'selfcare', label: 'Self-care', emoji: '🧖‍♀️' },
  { id: 'other', label: 'Другое', emoji: '✨' },
];

export default function Pins() {
  const [pins, setPins] = useState<Pin[]>(() => {
    const saved = localStorage.getItem('pins');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        title: 'Идеи для здорового завтрака',
        url: 'https://pinterest.com',
        imageUrl: '',
        category: 'recipes',
        note: 'Попробовать овсянку с ягодами',
        createdAt: Date.now(),
      },
      {
        id: '2',
        title: 'Летние луки 2024',
        url: 'https://pinterest.com',
        imageUrl: '',
        category: 'fashion',
        note: 'Пастельные тона, лёгкие ткани',
        createdAt: Date.now() - 1000,
      },
    ];
  });
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddPin, setShowAddPin] = useState(false);
  const [newPin, setNewPin] = useState({
    title: '',
    url: '',
    imageUrl: '',
    category: 'other',
    note: '',
  });

  useEffect(() => {
    localStorage.setItem('pins', JSON.stringify(pins));
  }, [pins]);

  const addPin = () => {
    if (!newPin.title.trim()) return;
    const pin: Pin = {
      id: Date.now().toString(),
      title: newPin.title,
      url: newPin.url,
      imageUrl: newPin.imageUrl,
      category: newPin.category,
      note: newPin.note,
      createdAt: Date.now(),
    };
    setPins(prev => [pin, ...prev]);
    setNewPin({ title: '', url: '', imageUrl: '', category: 'other', note: '' });
    setShowAddPin(false);
  };

  const deletePin = (id: string) => {
    setPins(prev => prev.filter(p => p.id !== id));
  };

  const filteredPins = activeCategory === 'all'
    ? pins
    : pins.filter(p => p.category === activeCategory);

  const getCategoryEmoji = (catId: string) => {
    return pinCategories.find(c => c.id === catId)?.emoji || '✨';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-purple-800">📌 Мои пины</h2>
          <p className="text-xs text-purple-400 mt-1">Сохранённое вдохновение</p>
        </div>
        <button
          onClick={() => setShowAddPin(true)}
          className="gradient-btn text-sm px-4 py-2"
        >
          + Пин
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {pinCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                : 'bg-white/70 text-purple-600 border border-purple-200'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Pins Grid */}
      {filteredPins.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="text-4xl mb-3">📌</div>
          <p className="text-purple-600 text-sm">Пока нет пинов</p>
          <p className="text-purple-400 text-xs mt-1">Сохрани вдохновение из Pinterest!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPins.map(pin => (
            <div key={pin.id} className="glass-card overflow-hidden group">
              {pin.imageUrl && (
                <div className="relative">
                  <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement?.remove();
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{getCategoryEmoji(pin.category)}</span>
                      <h4 className="font-bold text-purple-800 text-sm">{pin.title}</h4>
                    </div>
                    {pin.note && (
                      <p className="text-xs text-purple-500 mt-1">{pin.note}</p>
                    )}
                    {pin.url && pin.url !== 'https://pinterest.com' && (
                      <a
                        href={pin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 mt-2 inline-flex items-center gap-1 hover:text-purple-600"
                      >
                        🔗 Открыть ссылку
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => deletePin(pin.id)}
                    className="text-xs text-red-400 hover:text-red-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Pin Modal */}
      {showAddPin && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddPin(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-800 mb-4">Сохранить пин</h3>
            
            <div className="space-y-3">
              <input
                type="text"
                value={newPin.title}
                onChange={(e) => setNewPin(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Название пина..."
                className="input-field"
              />

              <input
                type="url"
                value={newPin.url}
                onChange={(e) => setNewPin(prev => ({ ...prev, url: e.target.value }))}
                placeholder="Ссылка из Pinterest..."
                className="input-field"
              />

              <input
                type="url"
                value={newPin.imageUrl}
                onChange={(e) => setNewPin(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="URL картинки (необязательно)..."
                className="input-field"
              />

              {newPin.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-purple-200">
                  <img
                    src={newPin.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <textarea
                value={newPin.note}
                onChange={(e) => setNewPin(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Заметка (что понравилось, идея...)"
                className="input-field min-h-[60px] resize-none"
              />

              <div>
                <p className="text-xs text-purple-400 mb-2">Категория:</p>
                <div className="flex flex-wrap gap-2">
                  {pinCategories.filter(c => c.id !== 'all').map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setNewPin(prev => ({ ...prev, category: cat.id }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        newPin.category === cat.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-50 text-purple-600 border border-purple-200'
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={addPin} className="gradient-btn w-full mt-4">
              📌 Сохранить пин
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
