import { useState, useEffect } from 'react';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  date: string;
}

interface DailyGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const mealTypes = [
  { id: 'breakfast' as const, label: 'Завтрак', emoji: '🌅' },
  { id: 'lunch' as const, label: 'Обед', emoji: '☀️' },
  { id: 'dinner' as const, label: 'Ужин', emoji: '🌙' },
  { id: 'snack' as const, label: 'Перекус', emoji: '🍎' },
];

const quickFoods = [
  { name: 'Овсянка', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Куриная грудка (100г)', calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: 'Рис (100г)', calories: 130, protein: 3, carbs: 28, fat: 0 },
  { name: 'Яблоко', calories: 52, protein: 0, carbs: 14, fat: 0 },
  { name: 'Банан', calories: 89, protein: 1, carbs: 23, fat: 0 },
  { name: 'Яйцо (1 шт)', calories: 78, protein: 6, carbs: 1, fat: 5 },
  { name: 'Творог (100г)', calories: 98, protein: 18, carbs: 3, fat: 2 },
  { name: 'Салат овощной', calories: 35, protein: 2, carbs: 6, fat: 0 },
  { name: 'Гречка (100г)', calories: 110, protein: 4, carbs: 21, fat: 1 },
  { name: 'Лосось (100г)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Авокадо (1/2)', calories: 120, protein: 1, carbs: 6, fat: 11 },
  { name: 'Йогурт натуральный', calories: 59, protein: 10, carbs: 4, fat: 1 },
  { name: 'Хлеб цельнозерновой', calories: 80, protein: 4, carbs: 14, fat: 1 },
  { name: 'Орехи (30г)', calories: 180, protein: 5, carbs: 6, fat: 16 },
  { name: 'Протеиновый коктейль', calories: 120, protein: 24, carbs: 3, fat: 1 },
];

const today = new Date().toISOString().split('T')[0];

export default function FoodTracker() {
  const [entries, setEntries] = useState<FoodEntry[]>(() => {
    const saved = localStorage.getItem('food-entries');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(() => {
    const saved = localStorage.getItem('daily-nutrition-goal');
    if (saved) return JSON.parse(saved);
    return { calories: 1800, protein: 100, carbs: 200, fat: 60 };
  });

  const [showAddFood, setShowAddFood] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Add food form
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFat, setFoodFat] = useState('');
  const [mealType, setMealType] = useState<FoodEntry['mealType']>('breakfast');

  useEffect(() => {
    localStorage.setItem('food-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('daily-nutrition-goal', JSON.stringify(dailyGoal));
  }, [dailyGoal]);

  const todayEntries = entries.filter(e => e.date === selectedDate);
  
  const totals = todayEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const addFood = () => {
    if (!foodName.trim() || !foodCalories) return;
    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: foodName,
      calories: parseInt(foodCalories) || 0,
      protein: parseInt(foodProtein) || 0,
      carbs: parseInt(foodCarbs) || 0,
      fat: parseInt(foodFat) || 0,
      mealType,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      date: selectedDate,
    };
    setEntries(prev => [...prev, entry]);
    resetForm();
    setShowAddFood(false);
  };

  const addQuickFood = (food: typeof quickFoods[0]) => {
    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      mealType,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      date: selectedDate,
    };
    setEntries(prev => [...prev, entry]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const resetForm = () => {
    setFoodName('');
    setFoodCalories('');
    setFoodProtein('');
    setFoodCarbs('');
    setFoodFat('');
  };

  const getCaloriePercentage = () => Math.min((totals.calories / dailyGoal.calories) * 100, 100);
  const getCalorieColor = () => {
    const pct = (totals.calories / dailyGoal.calories) * 100;
    if (pct > 100) return 'from-red-400 to-red-500';
    if (pct > 80) return 'from-yellow-400 to-orange-400';
    return 'from-green-400 to-emerald-500';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-purple-800">🥗 Питание</h2>
          <p className="text-xs text-purple-400 mt-1">Трекер калорий и нутриентов</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="w-9 h-9 rounded-full bg-white/70 border border-purple-200 flex items-center justify-center text-sm"
        >
          ⚙️
        </button>
      </div>

      {/* Date Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateStr = date.toISOString().split('T')[0];
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
          const dayEntries = entries.filter(e => e.date === dateStr);
          const dayCalories = dayEntries.reduce((sum, e) => sum + e.calories, 0);
          
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-500 to-pink-500 text-white'
                  : 'bg-white/70 text-purple-600 border border-purple-100'
              }`}
            >
              <span className="text-[10px] font-medium">
                {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
              </span>
              <span className={`text-lg font-bold ${isSelected ? '' : 'text-purple-800'}`}>
                {date.getDate()}
              </span>
              {dayCalories > 0 && (
                <span className={`text-[9px] ${isSelected ? 'text-white/80' : 'text-purple-400'}`}>
                  {dayCalories} ккал
                </span>
              )}
              {isToday && (
                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-purple-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Calorie Summary */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-purple-400">Съедено сегодня</p>
            <p className="text-3xl font-bold text-purple-800">{totals.calories}</p>
            <p className="text-xs text-purple-400">из {dailyGoal.calories} ккал</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e9d5ff"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${getCaloriePercentage()}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-purple-600">{Math.round(getCaloriePercentage())}%</span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Белки', value: totals.protein, goal: dailyGoal.protein, color: 'bg-blue-400', unit: 'г' },
            { label: 'Углеводы', value: totals.carbs, goal: dailyGoal.carbs, color: 'bg-yellow-400', unit: 'г' },
            { label: 'Жиры', value: totals.fat, goal: dailyGoal.fat, color: 'bg-pink-400', unit: 'г' },
          ].map(macro => (
            <div key={macro.label} className="text-center">
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-1 overflow-hidden">
                <div
                  className={`h-full ${macro.color} rounded-full transition-all`}
                  style={{ width: `${Math.min((macro.value / macro.goal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs font-bold text-purple-700">{macro.value}{macro.unit}</p>
              <p className="text-[10px] text-purple-400">{macro.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-2">
        {mealTypes.map(meal => {
          const mealEntries = todayEntries.filter(e => e.mealType === meal.id);
          const mealCalories = mealEntries.reduce((sum, e) => sum + e.calories, 0);
          
          return (
            <div key={meal.id} className="glass-card p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span>{meal.emoji}</span>
                  <span className="text-sm font-bold text-purple-700">{meal.label}</span>
                </div>
                <span className="text-xs text-purple-400">{mealCalories} ккал</span>
              </div>
              
              {mealEntries.length > 0 && (
                <div className="space-y-1 mb-2">
                  {mealEntries.map(entry => (
                    <div key={entry.id} className="flex justify-between items-center py-1 px-2 bg-purple-50 rounded-lg">
                      <div>
                        <span className="text-xs font-medium text-purple-700">{entry.name}</span>
                        <span className="text-[10px] text-purple-400 ml-2">{entry.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-500">{entry.calories} ккал</span>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-400 text-xs hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Food Button */}
      <button onClick={() => setShowAddFood(true)} className="gradient-btn w-full text-sm">
        + Записать приём пищи
      </button>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddFood(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-800 mb-4">Записать еду</h3>
            
            {/* Meal Type */}
            <div className="flex gap-2 mb-4">
              {mealTypes.map(mt => (
                <button
                  key={mt.id}
                  onClick={() => setMealType(mt.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                    mealType === mt.id
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                      : 'bg-purple-50 text-purple-600 border border-purple-200'
                  }`}
                >
                  {mt.emoji}
                </button>
              ))}
            </div>

            {/* Quick Add */}
            <div className="mb-4">
              <p className="text-xs text-purple-400 mb-2">Быстрый выбор:</p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {quickFoods.map(food => (
                  <button
                    key={food.name}
                    onClick={() => addQuickFood(food)}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-purple-50 border border-purple-200 text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    {food.name} ({food.calories})
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-purple-100 pt-4">
              <p className="text-xs text-purple-400 mb-2">Или введи вручную:</p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Название блюда..."
                  className="input-field"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={foodCalories}
                    onChange={(e) => setFoodCalories(e.target.value)}
                    placeholder="Калории"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={foodProtein}
                    onChange={(e) => setFoodProtein(e.target.value)}
                    placeholder="Белки (г)"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={foodCarbs}
                    onChange={(e) => setFoodCarbs(e.target.value)}
                    placeholder="Углеводы (г)"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={foodFat}
                    onChange={(e) => setFoodFat(e.target.value)}
                    placeholder="Жиры (г)"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <button onClick={addFood} className="gradient-btn w-full mt-4">
              ✨ Добавить
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-800 mb-4">⚙️ Дневные цели</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-purple-400 mb-1 block">Калории (ккал)</label>
                <input
                  type="number"
                  value={dailyGoal.calories}
                  onChange={(e) => setDailyGoal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-purple-400 mb-1 block">Белки (г)</label>
                <input
                  type="number"
                  value={dailyGoal.protein}
                  onChange={(e) => setDailyGoal(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-purple-400 mb-1 block">Углеводы (г)</label>
                <input
                  type="number"
                  value={dailyGoal.carbs}
                  onChange={(e) => setDailyGoal(prev => ({ ...prev, carbs: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-purple-400 mb-1 block">Жиры (г)</label>
                <input
                  type="number"
                  value={dailyGoal.fat}
                  onChange={(e) => setDailyGoal(prev => ({ ...prev, fat: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-xl">
              <p className="text-xs text-purple-600">
                💡 Совет: для здорового похудения рекомендуется дефицит 300-500 ккал от нормы. 
                Для набора массы — профицит 200-300 ккал.
              </p>
            </div>

            <button onClick={() => setShowSettings(false)} className="gradient-btn w-full mt-4">
              Сохранить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
