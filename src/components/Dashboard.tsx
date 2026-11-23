import { useState, useEffect } from 'react';

const affirmations = [
  "Я достойна всего самого лучшего 💖",
  "Каждый день я становлюсь лучшей версией себя 🌟",
  "Моё тело — мой храм, и я забочусь о нём 🌿",
  "Я излучаю уверенность и красоту ✨",
  "Я выбираю здоровье и счастье каждый день 🦋",
  "Мои цели достижимы, и я двигаюсь к ним 🎯",
  "Я заслуживаю любви и заботы 💕",
  "Моя энергия привлекает только хорошее 🌈",
  "Я горжусь каждым своим маленьким шагом вперёд 🌸",
  "Я — автор своей прекрасной жизни 📖",
  "Мой стиль — отражение моей внутренней красоты 👑",
  "Я наполнена силой, grace и вдохновением 🕊️",
  "Сегодня я делаю выбор в пользу себя 💪",
  "Я окружена любовью и поддержкой 🤗",
  "Мой путь уникален и прекрасен 🌺",
];

const dailyGoals = [
  { id: 1, text: "Выпить 8 стаканов воды 💧", done: false },
  { id: 2, text: "10 минут медитации 🧘‍♀️", done: false },
  { id: 3, text: "Прогулка на свежем воздухе 🌳", done: false },
  { id: 4, text: "Прочитать 10 страниц 📚", done: false },
  { id: 5, text: "Здоровый завтрак 🥑", done: false },
];

const motivationalQuotes = [
  { text: "Будь той девушкой, которая решила пойти до конца.", author: "Неизвестный" },
  { text: "Ты не должна быть идеальной, чтобы быть потрясающей.", author: "Неизвестный" },
  { text: "Забота о себе — это не эгоизм, это самосохранение.", author: "Одри Лорд" },
  { text: "Маленькие шаги каждый день приводят к большим переменам.", author: "Неизвестный" },
  { text: "Твоя единственная конкуренция — это ты вчерашняя.", author: "Неизвестный" },
];

interface Goal {
  id: number;
  text: string;
  done: boolean;
}

export default function Dashboard() {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('daily-goals');
    if (saved) return JSON.parse(saved);
    return dailyGoals;
  });
  const [currentQuote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('streak') || '0');
  });

  useEffect(() => {
    localStorage.setItem('daily-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAffirmation(prev => (prev + 1) % affirmations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleGoal = (id: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const completedCount = goals.filter(g => g.done).length;
  const progress = (completedCount / goals.length) * 100;

  useEffect(() => {
    if (completedCount === goals.length && goals.length > 0) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('streak', newStreak.toString());
    }
  }, [completedCount, goals.length, streak]);

  return (
    <div className="space-y-4">
      {/* Affirmation Card */}
      <div className="glass-card p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-purple-100/50"></div>
        <div className="relative z-10">
          <p className="text-xs text-purple-400 font-medium mb-2 uppercase tracking-wider">Аффирмация дня</p>
          <p className="text-xl font-bold text-purple-800 leading-relaxed transition-all duration-500">
            {affirmations[currentAffirmation]}
          </p>
          <div className="flex justify-center gap-1 mt-3">
            {affirmations.slice(0, 5).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentAffirmation % 5 ? 'bg-purple-500 w-4' : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Streak & Progress */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-purple-700">{streak}</div>
          <div className="text-xs text-purple-400">дней подряд</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl mb-1">🎯</div>
          <div className="text-2xl font-bold text-purple-700">{completedCount}/{goals.length}</div>
          <div className="text-xs text-purple-400">целей сегодня</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-purple-700">Прогресс дня</span>
          <span className="text-sm font-bold text-purple-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Daily Goals */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
          <span>🌟</span> Цели на сегодня
        </h3>
        <div className="space-y-2">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                goal.done
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-purple-50 border border-purple-100 hover:bg-purple-100'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                goal.done
                  ? 'bg-green-400 text-white'
                  : 'border-2 border-purple-300'
              }`}>
                {goal.done && <span className="text-xs">✓</span>}
              </div>
              <span className={`text-sm ${goal.done ? 'line-through text-green-600' : 'text-purple-700'}`}>
                {goal.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="glass-card p-5 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-2xl mb-2">💭</div>
        <p className="text-purple-700 italic text-sm leading-relaxed">"{currentQuote.text}"</p>
        <p className="text-purple-400 text-xs mt-2 text-right">— {currentQuote.author}</p>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-purple-700 mb-3">⚡ Быстрые действия</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200 text-sm text-pink-700 font-medium hover:scale-105 transition-transform">
            📸 Добавить в мудборд
          </button>
          <button className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 text-sm text-purple-700 font-medium hover:scale-105 transition-transform">
            👗 Новый лук
          </button>
          <button className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 text-sm text-blue-700 font-medium hover:scale-105 transition-transform">
            📌 Сохранить пин
          </button>
          <button className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50 border border-green-200 text-sm text-green-700 font-medium hover:scale-105 transition-transform">
            🥗 Записать еду
          </button>
        </div>
      </div>
    </div>
  );
}
