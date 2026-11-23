import { useState, useEffect } from 'react';

interface ClothingItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear';
  color: string;
  emoji: string;
}

interface Outfit {
  id: string;
  name: string;
  items: string[];
  rating: number;
  occasion: string;
  createdAt: number;
}

const categories = [
  { id: 'top' as const, label: 'Верх', emoji: '👚' },
  { id: 'bottom' as const, label: 'Низ', emoji: '👖' },
  { id: 'shoes' as const, label: 'Обувь', emoji: '👟' },
  { id: 'accessory' as const, label: 'Аксессуары', emoji: '💍' },
  { id: 'outerwear' as const, label: 'Верхняя одежда', emoji: '🧥' },
];

const occasions = ['На каждый день', 'На свидание', 'На учёбу', 'На прогулку', 'Вечерний выход', 'Спорт', 'Домашний'];

const colorOptions = [
  { name: 'Чёрный', value: '#1a1a1a' },
  { name: 'Белый', value: '#ffffff' },
  { name: 'Розовый', value: '#f472b6' },
  { name: 'Бежевый', value: '#d4a574' },
  { name: 'Голубой', value: '#60a5fa' },
  { name: 'Зелёный', value: '#4ade80' },
  { name: 'Красный', value: '#ef4444' },
  { name: 'Фиолетовый', value: '#a78bfa' },
  { name: 'Серый', value: '#9ca3af' },
  { name: 'Жёлтый', value: '#fbbf24' },
];

export default function Outfits() {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem('wardrobe');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Белая футболка', category: 'top', color: '#ffffff', emoji: '👚' },
      { id: '2', name: 'Джинсы', category: 'bottom', color: '#60a5fa', emoji: '👖' },
      { id: '3', name: 'Кроссовки', category: 'shoes', color: '#ffffff', emoji: '👟' },
      { id: '4', name: 'Розовое платье', category: 'top', color: '#f472b6', emoji: '👗' },
    ];
  });

  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    const saved = localStorage.getItem('outfits');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [view, setView] = useState<'outfits' | 'wardrobe'>('outfits');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showCreateOutfit, setShowCreateOutfit] = useState(false);
  
  // Add item form
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ClothingItem['category']>('top');
  const [newItemColor, setNewItemColor] = useState(colorOptions[0].value);

  // Create outfit form
  const [outfitName, setOutfitName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [outfitOccasion, setOutfitOccasion] = useState(occasions[0]);
  const [outfitRating, setOutfitRating] = useState(0);

  useEffect(() => {
    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  useEffect(() => {
    localStorage.setItem('outfits', JSON.stringify(outfits));
  }, [outfits]);

  const addClothingItem = () => {
    if (!newItemName.trim()) return;
    const item: ClothingItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: newItemCategory,
      color: newItemColor,
      emoji: categories.find(c => c.id === newItemCategory)?.emoji || '👕',
    };
    setWardrobe(prev => [...prev, item]);
    setNewItemName('');
    setShowAddItem(false);
  };

  const deleteClothingItem = (id: string) => {
    setWardrobe(prev => prev.filter(item => item.id !== id));
  };

  const createOutfit = () => {
    if (!outfitName.trim() || selectedItems.length === 0) return;
    const outfit: Outfit = {
      id: Date.now().toString(),
      name: outfitName,
      items: selectedItems,
      rating: outfitRating,
      occasion: outfitOccasion,
      createdAt: Date.now(),
    };
    setOutfits(prev => [outfit, ...prev]);
    setOutfitName('');
    setSelectedItems([]);
    setOutfitRating(0);
    setShowCreateOutfit(false);
  };

  const deleteOutfit = (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getItemById = (id: string) => wardrobe.find(item => item.id === id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-purple-800">👗 Мои луки</h2>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('outfits')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            view === 'outfits' ? 'tab-active' : 'bg-white/70 text-purple-600 border border-purple-200'
          }`}
        >
          🎀 Мои луки ({outfits.length})
        </button>
        <button
          onClick={() => setView('wardrobe')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            view === 'wardrobe' ? 'tab-active' : 'bg-white/70 text-purple-600 border border-purple-200'
          }`}
        >
          👚 Гардероб ({wardrobe.length})
        </button>
      </div>

      {view === 'outfits' ? (
        <>
          <button onClick={() => setShowCreateOutfit(true)} className="gradient-btn w-full text-sm">
            ✨ Создать новый лук
          </button>

          {outfits.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">👗</div>
              <p className="text-purple-600 text-sm">Пока нет луков</p>
              <p className="text-purple-400 text-xs mt-1">Собери свой первый образ!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {outfits.map(outfit => (
                <div key={outfit.id} className="glass-card p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-purple-800">{outfit.name}</h4>
                      <p className="text-xs text-purple-400">{outfit.occasion}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < outfit.rating ? 'opacity-100' : 'opacity-30'}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {outfit.items.map(itemId => {
                      const item = getItemById(itemId);
                      if (!item) return null;
                      return (
                        <div
                          key={itemId}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: item.color + '30', border: `1px solid ${item.color}50` }}
                        >
                          <span>{item.emoji}</span>
                          <span className="text-purple-700">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => deleteOutfit(outfit.id)}
                    className="text-xs text-red-400 hover:text-red-500"
                  >
                    Удалить лук
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <button onClick={() => setShowAddItem(true)} className="gradient-btn w-full text-sm">
            + Добавить вещь в гардероб
          </button>

          {categories.map(cat => {
            const catItems = wardrobe.filter(item => item.category === cat.id);
            if (catItems.length === 0) return null;
            return (
              <div key={cat.id} className="glass-card p-4">
                <h4 className="text-sm font-bold text-purple-700 mb-2">{cat.emoji} {cat.label}</h4>
                <div className="flex flex-wrap gap-2">
                  {catItems.map(item => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-2 px-3 py-2 rounded-xl border relative"
                      style={{ backgroundColor: item.color + '20', borderColor: item.color + '40' }}
                    >
                      <span>{item.emoji}</span>
                      <span className="text-xs font-medium text-purple-700">{item.name}</span>
                      <button
                        onClick={() => deleteClothingItem(item.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddItem(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-800 mb-4">Добавить вещь</h3>
            
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Название вещи..."
              className="input-field mb-3"
            />

            <div className="mb-3">
              <p className="text-xs text-purple-400 mb-2">Категория:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setNewItemCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      newItemCategory === cat.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-50 text-purple-600 border border-purple-200'
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-purple-400 mb-2">Цвет:</p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setNewItemColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      newItemColor === color.value ? 'border-purple-500 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <button onClick={addClothingItem} className="gradient-btn w-full">
              ✨ Добавить
            </button>
          </div>
        </div>
      )}

      {/* Create Outfit Modal */}
      {showCreateOutfit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowCreateOutfit(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-800 mb-4">Создать лук</h3>
            
            <input
              type="text"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              placeholder="Название лука..."
              className="input-field mb-3"
            />

            <div className="mb-3">
              <p className="text-xs text-purple-400 mb-2">Повод:</p>
              <div className="flex flex-wrap gap-2">
                {occasions.map(occ => (
                  <button
                    key={occ}
                    onClick={() => setOutfitOccasion(occ)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      outfitOccasion === occ
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-50 text-purple-600 border border-purple-200'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-purple-400 mb-2">Оценка:</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setOutfitRating(i + 1)}
                    className={`text-2xl transition-transform ${i < outfitRating ? 'scale-110' : 'opacity-40'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-purple-400 mb-2">Выбери вещи из гардероба:</p>
              {wardrobe.length === 0 ? (
                <p className="text-xs text-purple-400 italic">Сначала добавь вещи в гардероб</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {wardrobe.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        selectedItems.includes(item.id)
                          ? 'bg-purple-100 border-2 border-purple-400'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: item.color, backgroundColor: selectedItems.includes(item.id) ? item.color : 'transparent' }}
                      >
                        {selectedItems.includes(item.id) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span>{item.emoji}</span>
                      <span className="text-sm text-purple-700">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={createOutfit} className="gradient-btn w-full">
              ✨ Создать лук
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
