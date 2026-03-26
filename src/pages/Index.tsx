import { useState } from "react";
import Icon from "@/components/ui/icon";

const SUPPORT_URL = "https://functions.poehali.dev/8ce22cd5-a01b-45d8-96fe-60574ef3f408";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/e9b14329-2bf0-46bc-a8cf-9efb93a312b4/files/16887d49-bbd3-4afc-b312-e38790e6cc9f.jpg";

const PACKAGES = [
  { id: 1, amount: 400, price: 99, popular: false, bonus: null, icon: "💎" },
  { id: 2, amount: 800, price: 179, popular: false, bonus: "+80 бонус", icon: "💎" },
  { id: 3, amount: 1700, price: 349, popular: true, bonus: "+170 бонус", icon: "👑" },
  { id: 4, amount: 4500, price: 849, popular: false, bonus: "+450 бонус", icon: "🔥" },
  { id: 5, amount: 10000, price: 1790, popular: false, bonus: "+1000 бонус", icon: "⚡" },
  { id: 6, amount: 22500, price: 3490, popular: false, bonus: "+2500 бонус", icon: "🚀" },
];

const REVIEWS = [
  { id: 1, name: "Кирилл_Pro", avatar: "🎮", rating: 5, text: "Моментально пришли робуксы! Уже третий раз покупаю — всё чисто и быстро. Верификация даёт уверенность.", date: "20 марта 2026", verified: true, amount: 1700 },
  { id: 2, name: "MarinaGames", avatar: "⭐", rating: 5, text: "Лучший магазин! Поддержка ответила за 5 минут. Купила для дочери, всё без проблем.", date: "18 марта 2026", verified: true, amount: 800 },
  { id: 3, name: "DarkRider228", avatar: "🔥", rating: 5, text: "Брал 10к робуксов — пришли быстро. Никакого обмана, проверенный магаз!", date: "15 марта 2026", verified: true, amount: 10000 },
  { id: 4, name: "SkyWarrior", avatar: "💫", rating: 4, text: "Хороший магазин, цены норм. Чуть дольше обычного обрабатывалось, но в итоге всё ок.", date: "12 марта 2026", verified: true, amount: 4500 },
  { id: 5, name: "ProGamer_RU", avatar: "🎯", rating: 5, text: "Покупаю уже 4-й раз. Каждый раз всё чётко. Рекомендую всем!", date: "10 марта 2026", verified: true, amount: 400 },
  { id: 6, name: "NinjaBlox", avatar: "🥷", rating: 5, text: "Отличный сервис! Нравится значок верификации — сразу понятно что не лохотрон.", date: "8 марта 2026", verified: false, amount: 1700 },
];

const STATS = [
  { value: "50 000+", label: "Довольных покупателей", icon: "👥" },
  { value: "1 200 000", label: "Робуксов продано", icon: "💎" },
  { value: "2 минуты", label: "Среднее время доставки", icon: "⚡" },
  { value: "100%", label: "Защита покупателей", icon: "🛡️" },
];

type Section = "home" | "catalog" | "reviews" | "profile" | "support";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [cartItem, setCartItem] = useState<typeof PACKAGES[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [showVerifySuccess, setShowVerifySuccess] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportTopic, setSupportTopic] = useState("");
  const [supportUsername, setSupportUsername] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(0);

  // Admin panel
  const [adminSection, setAdminSection] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [tickets, setTickets] = useState<Array<{id:number;username:string;topic:string;message:string;status:string;created_at:string}>>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const navItems: { id: Section; label: string; emoji: string }[] = [
    { id: "home", label: "Главная", emoji: "🏠" },
    { id: "catalog", label: "Каталог", emoji: "💎" },
    { id: "reviews", label: "Отзывы", emoji: "⭐" },
    { id: "profile", label: "Профиль", emoji: "👤" },
    { id: "support", label: "Поддержка", emoji: "💬" },
  ];

  const handleBuy = (pkg: typeof PACKAGES[0]) => {
    setCartItem(pkg);
    setShowModal(true);
  };

  const handleVerify = () => {
    if (verifyInput.trim().length >= 4) {
      setIsVerified(true);
      setShowVerifySuccess(true);
      setTimeout(() => setShowVerifySuccess(false), 3000);
    }
  };

  const handleSupportSend = async () => {
    if (supportMsg.trim().length < 5) return;
    setSupportLoading(true);
    setSupportError("");
    try {
      const res = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: supportUsername, topic: supportTopic, message: supportMsg }),
      });
      if (res.ok) {
        setSupportSent(true);
        setSupportMsg("");
        setSupportTopic("");
        setSupportUsername("");
      } else {
        setSupportError("Ошибка отправки. Попробуй ещё раз.");
      }
    } catch {
      setSupportError("Нет соединения. Попробуй ещё раз.");
    }
    setSupportLoading(false);
  };

  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);
    if (next >= 5) {
      setAdminSection(true);
      setLogoClickCount(0);
    }
  };

  const handleAdminLogin = async () => {
    setAdminLoading(true);
    setAdminError("");
    try {
      const res = await fetch(SUPPORT_URL + "/list", {
        headers: { 'x-admin-password': adminPassword },
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        setAdminLoggedIn(true);
      } else {
        setAdminError("Неверный пароль");
      }
    } catch {
      setAdminError("Ошибка соединения");
    }
    setAdminLoading(false);
  };

  const handleStatusUpdate = async (ticketId: number, status: string) => {
    await fetch(SUPPORT_URL + "/status", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
      body: JSON.stringify({ ticket_id: ticketId, status }),
    });
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  return (
    <div className="min-h-screen font-rubik" style={{ backgroundColor: '#0A0E1A', color: '#F8FAFF' }}>
      {/* Stars */}
      <div className="stars pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Ticker */}
      <div className="relative overflow-hidden py-2" style={{ backgroundColor: '#FFD700' }}>
        <div className="flex animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-8 text-sm font-bold" style={{ color: '#0A0E1A' }}>
              ⚡ БЫСТРАЯ ДОСТАВКА &nbsp;&nbsp;🛡️ ЗАЩИТА ПОКУПАТЕЛЕЙ &nbsp;&nbsp;💎 БОНУСЫ ЗА КАЖДУЮ ПОКУПКУ &nbsp;&nbsp;✅ ВЕРИФИКАЦИЯ АККАУНТОВ &nbsp;&nbsp;🔥 ЛУЧШИЕ ЦЕНЫ
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(10,14,26,0.95)', borderColor: 'rgba(255,215,0,0.15)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveSection("home"); handleLogoClick(); }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}>
              R
            </div>
            <div>
              <div className="font-russo text-lg leading-none" style={{ color: '#FFD700' }}>RobuxShop</div>
              <div className="text-xs" style={{ color: '#64748b' }}>Официальный магазин</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: activeSection === item.id ? 'rgba(255,215,0,0.15)' : 'transparent',
                  color: activeSection === item.id ? '#FFD700' : '#94a3b8',
                  border: activeSection === item.id ? '1px solid rgba(255,215,0,0.3)' : '1px solid transparent',
                }}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isVerified && (
              <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                ✅ Верифицирован
              </div>
            )}
            <button
              onClick={() => setActiveSection("catalog")}
              className="glow-btn px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}
            >
              Купить
            </button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-3 flex flex-col gap-2"
            style={{ borderColor: 'rgba(255,215,0,0.1)', backgroundColor: '#0A0E1A' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-left"
                style={{ color: activeSection === item.id ? '#FFD700' : '#94a3b8' }}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="relative z-10">

        {/* ===== HOME ===== */}
        {activeSection === "home" && (
          <div>
            <section className="relative min-h-[85vh] flex items-center overflow-hidden grid-bg">
              <div className="absolute inset-0">
                <img src={HERO_IMAGE} alt="hero" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,14,26,0.92) 40%, rgba(59,130,246,0.1) 100%)' }} />
              </div>
              <div className="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 animate-slide-up"
                    style={{ backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}>
                    🔥 Лучшие цены на Robux в России
                  </div>
                  <h1 className="font-russo text-5xl md:text-6xl leading-tight mb-6 animate-slide-up delay-100">
                    <span style={{ color: '#F8FAFF' }}>Купи </span>
                    <span className="neon-yellow" style={{ color: '#FFD700' }}>Robux</span>
                    <br />
                    <span style={{ color: '#F8FAFF' }}>быстро и </span>
                    <span style={{ color: '#FF6B35' }}>безопасно</span>
                  </h1>
                  <p className="text-lg mb-8 animate-slide-up delay-200" style={{ color: '#94a3b8' }}>
                    Официальная верификация аккаунтов, мгновенная доставка и полная защита от мошенников. Уже 50 000+ довольных геймеров.
                  </p>
                  <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
                    <button
                      onClick={() => setActiveSection("catalog")}
                      className="glow-btn px-8 py-4 rounded-2xl text-lg font-bold"
                      style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}
                    >
                      💎 Купить Robux
                    </button>
                    <button
                      onClick={() => setActiveSection("reviews")}
                      className="px-8 py-4 rounded-2xl text-lg font-medium border"
                      style={{ borderColor: 'rgba(255,215,0,0.3)', color: '#FFD700', backgroundColor: 'rgba(255,215,0,0.05)' }}
                    >
                      ⭐ Отзывы
                    </button>
                  </div>
                </div>

                <div className="hidden md:flex justify-center">
                  <div className="relative animate-float">
                    <div className="w-64 h-64 rounded-3xl flex flex-col items-center justify-center text-center p-6 glow-card"
                      style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,107,53,0.08))', border: '1px solid rgba(255,215,0,0.25)' }}>
                      <div className="text-7xl mb-4">💎</div>
                      <div className="font-russo text-3xl" style={{ color: '#FFD700' }}>1700</div>
                      <div className="text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Robux</div>
                      <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
                        ✅ Топ продажа
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl flex items-center justify-center text-xl animate-spin-slow"
                      style={{ background: 'linear-gradient(135deg, #3B82F6, #A855F7)' }}>
                      ⚡
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.35)' }}>
                      🛡️
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-12 border-y" style={{ borderColor: 'rgba(255,215,0,0.1)', backgroundColor: 'rgba(255,215,0,0.02)' }}>
              <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                {STATS.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="font-russo text-2xl md:text-3xl" style={{ color: '#FFD700' }}>{s.value}</div>
                    <div className="text-sm mt-1" style={{ color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-20 max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-russo text-3xl md:text-4xl mb-4" style={{ color: '#F8FAFF' }}>
                  Почему выбирают <span style={{ color: '#FFD700' }}>RobuxShop</span>?
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: "🛡️", title: "Верификация аккаунтов", desc: "Каждый продавец проходит проверку. Ваш аккаунт защищён от блокировок и мошенничества.", color: '#10B981' },
                  { icon: "⚡", title: "Мгновенная доставка", desc: "Robux поступают на ваш аккаунт в течение 1–5 минут после оплаты. Гарантировано.", color: '#3B82F6' },
                  { icon: "💰", title: "Лучшие цены", desc: "Мы мониторим рынок 24/7 и предлагаем самые выгодные цены на Robux в России.", color: '#FFD700' },
                  { icon: "🔒", title: "Безопасная оплата", desc: "Принимаем карты, СБП, электронные кошельки. Все транзакции зашифрованы.", color: '#A855F7' },
                  { icon: "💬", title: "Поддержка 24/7", desc: "Наша команда всегда на связи. Ответим в течение 5 минут в любое время суток.", color: '#FF6B35' },
                  { icon: "🎁", title: "Бонусная программа", desc: "Получайте бонусные робуксы с каждой покупки. Чем больше покупаете — тем больше бонусов.", color: '#F59E0B' },
                ].map((f, i) => (
                  <div key={i} className="glow-card p-6 rounded-2xl"
                    style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="text-4xl mb-4">{f.icon}</div>
                    <h3 className="font-russo text-lg mb-2" style={{ color: f.color }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-16 mx-4 rounded-3xl mb-12 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,107,53,0.08))', border: '1px solid rgba(255,215,0,0.18)' }}>
              <div className="relative z-10 max-w-2xl mx-auto px-4">
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="font-russo text-3xl md:text-4xl mb-4" style={{ color: '#F8FAFF' }}>Готов к покупке?</h2>
                <p className="mb-8" style={{ color: '#94a3b8' }}>Присоединяйся к 50 000+ геймеров, которые доверяют RobuxShop</p>
                <button
                  onClick={() => setActiveSection("catalog")}
                  className="glow-btn px-10 py-4 rounded-2xl text-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}
                >
                  💎 Перейти в каталог
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ===== CATALOG ===== */}
        {activeSection === "catalog" && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <div className="text-5xl mb-4">💎</div>
              <h2 className="font-russo text-4xl mb-4" style={{ color: '#F8FAFF' }}>
                Каталог <span style={{ color: '#FFD700' }}>Robux</span>
              </h2>
              <p style={{ color: '#64748b' }}>Выберите подходящий пакет — доставка за 1–5 минут</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="glow-card rounded-2xl p-6 relative flex flex-col"
                  style={{
                    backgroundColor: '#0F1525',
                    border: pkg.popular ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}>
                      🔥 ХИТ ПРОДАЖ
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{pkg.icon}</div>
                    <div className="font-russo text-3xl" style={{ color: '#FFD700' }}>{pkg.amount.toLocaleString()}</div>
                    <div className="text-sm font-medium" style={{ color: '#94a3b8' }}>Robux</div>
                    {pkg.bonus && (
                      <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
                        🎁 {pkg.bonus}
                      </div>
                    )}
                  </div>
                  <div className="flex-1" />
                  <div className="mt-4 mb-6 flex items-end justify-between">
                    <div>
                      <div className="font-russo text-2xl" style={{ color: '#F8FAFF' }}>{pkg.price} ₽</div>
                      <div className="text-xs" style={{ color: '#64748b' }}>{(pkg.price / pkg.amount * 1000).toFixed(1)} ₽ за 1000 R</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: '#10B981' }}>
                      <span>⚡</span> 1–5 мин
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(pkg)}
                    className="glow-btn w-full py-3 rounded-xl font-bold text-sm"
                    style={{
                      background: pkg.popular
                        ? 'linear-gradient(135deg, #FFD700, #FF6B35)'
                        : 'rgba(255,215,0,0.1)',
                      color: pkg.popular ? '#0A0E1A' : '#FFD700',
                      border: pkg.popular ? 'none' : '1px solid rgba(255,215,0,0.25)',
                    }}
                  >
                    💳 Купить сейчас
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {["🛡️ Защита покупателей", "🔒 Безопасная оплата", "✅ Верифицированные продавцы", "⚡ Мгновенная доставка"].map((b, i) => (
                <div key={i} className="px-4 py-2 rounded-full text-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                  {b}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== REVIEWS ===== */}
        {activeSection === "reviews" && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="font-russo text-4xl mb-4" style={{ color: '#F8FAFF' }}>
                Отзывы <span style={{ color: '#FFD700' }}>покупателей</span>
              </h2>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex gap-1 text-2xl">{"⭐".repeat(5)}</div>
                <div>
                  <span className="font-russo text-3xl" style={{ color: '#FFD700' }}>4.9</span>
                  <span className="ml-2" style={{ color: '#64748b' }}>из 5 на основе 2 847 отзывов</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {REVIEWS.map((r) => (
                <div key={r.id} className="glow-card p-5 rounded-2xl"
                  style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255,215,0,0.1)' }}>
                      {r.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm" style={{ color: '#F8FAFF' }}>{r.name}</span>
                        {r.verified && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
                            ✅ Верифицирован
                          </span>
                        )}
                      </div>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(r.rating)].map((_, i) => <span key={i} className="text-xs">⭐</span>)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: '#94a3b8' }}>{r.text}</p>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#475569' }}>
                    <span>{r.date}</span>
                    <span style={{ color: '#FFD700' }}>💎 {r.amount.toLocaleString()} R</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl text-center"
              style={{ backgroundColor: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)' }}>
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="font-russo text-xl mb-2" style={{ color: '#F8FAFF' }}>Оставьте отзыв</h3>
              <p className="text-sm mb-4" style={{ color: '#64748b' }}>Поделитесь своим опытом покупки и помогите другим геймерам</p>
              <button
                className="glow-btn px-6 py-3 rounded-xl font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}
                onClick={() => alert("Форма отзыва — настраивается по запросу!")}
              >
                📝 Написать отзыв
              </button>
            </div>
          </section>
        )}

        {/* ===== PROFILE ===== */}
        {activeSection === "profile" && (
          <section className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="font-russo text-4xl mb-2" style={{ color: '#F8FAFF' }}>
                Мой <span style={{ color: '#FFD700' }}>профиль</span>
              </h2>
            </div>

            <div className="glow-card p-6 rounded-2xl mb-6"
              style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,53,0.15))', border: '1px solid rgba(255,215,0,0.25)' }}>
                  🎮
                </div>
                <div>
                  <div className="font-russo text-xl" style={{ color: '#F8FAFF' }}>{username || "Гость"}</div>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-bold verified-badge" style={{ color: '#fff' }}>
                      ✅ Аккаунт верифицирован
                    </span>
                  ) : (
                    <div className="text-sm mt-1" style={{ color: '#FF6B35' }}>⚠️ Аккаунт не верифицирован</div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Никнейм в Roblox</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Введи свой ник..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: '#141B2E', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Покупок", value: "0" },
                  { label: "Robux куплено", value: "0" },
                  { label: "Бонусов", value: "0 R" },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 rounded-xl" style={{ backgroundColor: '#141B2E' }}>
                    <div className="font-russo text-xl" style={{ color: '#FFD700' }}>{s.value}</div>
                    <div className="text-xs mt-1" style={{ color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div className="glow-card p-6 rounded-2xl mb-6"
              style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-russo text-lg mb-2" style={{ color: '#F8FAFF' }}>🛡️ Верификация аккаунта</h3>
              <p className="text-sm mb-4" style={{ color: '#64748b' }}>
                Верифицируй свой Roblox аккаунт для защиты от мошенничества и получения приоритетной поддержки.
              </p>

              {showVerifySuccess && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
                  ✅ Аккаунт успешно верифицирован! Теперь ты под защитой RobuxShop.
                </div>
              )}

              {!isVerified ? (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>ID аккаунта Roblox</label>
                    <input
                      type="text"
                      value={verifyInput}
                      onChange={e => setVerifyInput(e.target.value)}
                      placeholder="Введи свой Roblox User ID..."
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: '#141B2E', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                    />
                  </div>
                  <button
                    onClick={handleVerify}
                    className="glow-btn w-full py-3 rounded-xl font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}
                  >
                    🛡️ Верифицировать аккаунт
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["🔒 Данные защищены", "✅ Без доступа к паролю", "⚡ Проверка за 30 сек"].map((b, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-md"
                        style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#64748b' }}>{b}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
                  <span className="text-3xl">✅</span>
                  <div>
                    <div className="font-medium" style={{ color: '#10B981' }}>Аккаунт верифицирован</div>
                    <div className="text-xs" style={{ color: '#64748b' }}>Ты защищён системой RobuxShop</div>
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            <div className="glow-card p-6 rounded-2xl"
              style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-russo text-lg mb-4" style={{ color: '#F8FAFF' }}>📋 История покупок</h3>
              <div className="flex flex-col items-center justify-center py-10" style={{ color: '#475569' }}>
                <div className="text-5xl mb-4">🛒</div>
                <div className="text-sm">Покупок пока нет</div>
                <button
                  onClick={() => setActiveSection("catalog")}
                  className="mt-4 px-5 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.18)', color: '#FFD700' }}
                >
                  Перейти в каталог →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ===== SUPPORT ===== */}
        {activeSection === "support" && (
          <section className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="font-russo text-4xl mb-2" style={{ color: '#F8FAFF' }}>
                Поддержка <span style={{ color: '#FFD700' }}>24/7</span>
              </h2>
              <p style={{ color: '#64748b' }}>Ответим в течение 5 минут в любое время</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: "⚡", title: "Не пришли Robux", desc: "Решаем в течение 15 минут" },
                { icon: "🔒", title: "Проблема с оплатой", desc: "Возврат гарантирован" },
                { icon: "🛡️", title: "Подозрительная активность", desc: "Заблокируем мошенника" },
                { icon: "🎁", title: "Вопрос по бонусам", desc: "Расскажем как накопить больше" },
              ].map((item, i) => (
                <div key={i} className="glow-card p-4 rounded-xl flex items-start gap-3 cursor-pointer"
                  style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#F8FAFF' }}>{item.title}</div>
                    <div className="text-xs mt-1" style={{ color: '#64748b' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glow-card p-6 rounded-2xl"
              style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-russo text-lg mb-4" style={{ color: '#F8FAFF' }}>📨 Написать в поддержку</h3>

              {supportSent ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <div className="font-russo text-xl mb-2" style={{ color: '#10B981' }}>Сообщение отправлено!</div>
                  <div className="text-sm" style={{ color: '#64748b' }}>Мы ответим в течение 5 минут</div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Ваш Roblox никнейм</label>
                    <input
                      type="text"
                      value={supportUsername}
                      onChange={e => setSupportUsername(e.target.value)}
                      placeholder="Введи ник..."
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: '#141B2E', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Тема обращения</label>
                    <select
                      value={supportTopic}
                      onChange={e => setSupportTopic(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: '#141B2E', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                    >
                      <option value="">Выбери тему...</option>
                      <option>Не пришли Robux</option>
                      <option>Проблема с оплатой</option>
                      <option>Подозрение на мошенничество</option>
                      <option>Вопрос по бонусам</option>
                      <option>Другое</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Описание проблемы</label>
                    <textarea
                      rows={4}
                      value={supportMsg}
                      onChange={e => setSupportMsg(e.target.value)}
                      placeholder="Опиши ситуацию подробнее..."
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ backgroundColor: '#141B2E', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                    />
                  </div>
                  {supportError && (
                    <div className="mb-4 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                      ⚠️ {supportError}
                    </div>
                  )}
                  <button
                    onClick={handleSupportSend}
                    disabled={supportLoading}
                    className="glow-btn w-full py-3 rounded-xl font-bold"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A', opacity: supportLoading ? 0.7 : 1 }}
                  >
                    {supportLoading ? '⏳ Отправляем...' : '📨 Отправить обращение'}
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {[
                { icon: "💬", title: "Telegram", value: "@robuxshop_support" },
                { icon: "📧", title: "Email", value: "support@robuxshop.ru" },
                { icon: "📞", title: "Телефон", value: "8-800-555-ROBUX" },
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="text-xs mb-1" style={{ color: '#64748b' }}>{c.title}</div>
                  <div className="text-sm font-medium" style={{ color: '#94a3b8' }}>{c.value}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== ADMIN PANEL ===== */}
        {adminSection && (
          <section className="max-w-5xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="font-russo text-4xl mb-2" style={{ color: '#F8FAFF' }}>
                Админ <span style={{ color: '#FFD700' }}>панель</span>
              </h2>
            </div>

            {!adminLoggedIn ? (
              <div className="max-w-sm mx-auto glow-card p-6 rounded-2xl"
                style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,215,0,0.2)' }}>
                <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Пароль администратора</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="Введи пароль..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4"
                  style={{ backgroundColor: '#141B2E', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                />
                {adminError && (
                  <div className="mb-4 text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
                    ⚠️ {adminError}
                  </div>
                )}
                <button
                  onClick={handleAdminLogin}
                  disabled={adminLoading}
                  className="glow-btn w-full py-3 rounded-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}
                >
                  {adminLoading ? '⏳ Проверяем...' : '🔓 Войти'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
                      ✅ Вы в системе
                    </span>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Всего обращений: {tickets.length}</span>
                  </div>
                  <button
                    onClick={() => { setAdminLoggedIn(false); setAdminPassword(""); setTickets([]); }}
                    className="text-xs px-3 py-1 rounded-lg"
                    style={{ color: '#64748b', backgroundColor: 'rgba(255,255,255,0.04)' }}
                  >
                    Выйти
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-16" style={{ color: '#475569' }}>
                    <div className="text-5xl mb-4">📭</div>
                    <div>Обращений пока нет</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {tickets.map(t => (
                      <div key={t.id} className="glow-card p-5 rounded-2xl"
                        style={{ backgroundColor: '#0F1525', border: `1px solid ${t.status === 'new' ? 'rgba(255,215,0,0.2)' : t.status === 'resolved' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)'}` }}>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="font-russo text-sm" style={{ color: '#FFD700' }}>#{t.id}</span>
                              <span className="font-medium text-sm" style={{ color: '#F8FAFF' }}>👤 {t.username || 'Аноним'}</span>
                              {t.topic && <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>{t.topic}</span>}
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold`}
                                style={{
                                  backgroundColor: t.status === 'new' ? 'rgba(255,215,0,0.15)' : t.status === 'resolved' ? 'rgba(16,185,129,0.15)' : 'rgba(255,107,53,0.15)',
                                  color: t.status === 'new' ? '#FFD700' : t.status === 'resolved' ? '#10B981' : '#FF6B35'
                                }}>
                                {t.status === 'new' ? '🆕 Новое' : t.status === 'resolved' ? '✅ Решено' : '⏳ В работе'}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed mb-2" style={{ color: '#94a3b8' }}>{t.message}</p>
                            <div className="text-xs" style={{ color: '#475569' }}>
                              {new Date(t.created_at).toLocaleString('ru-RU')}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {t.status !== 'in_progress' && (
                              <button
                                onClick={() => handleStatusUpdate(t.id, 'in_progress')}
                                className="px-3 py-1 rounded-lg text-xs font-medium"
                                style={{ backgroundColor: 'rgba(255,107,53,0.15)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.2)' }}
                              >
                                ⏳ В работу
                              </button>
                            )}
                            {t.status !== 'resolved' && (
                              <button
                                onClick={() => handleStatusUpdate(t.id, 'resolved')}
                                className="px-3 py-1 rounded-lg text-xs font-medium"
                                style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
                              >
                                ✅ Решено
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-10" style={{ borderColor: 'rgba(255,215,0,0.1)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-russo text-xs"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}>
                R
              </div>
              <span className="font-russo" style={{ color: '#FFD700' }}>RobuxShop</span>
            </div>
            <div className="flex gap-6 text-sm" style={{ color: '#475569' }}>
              <span className="cursor-pointer hover:text-yellow-400 transition-colors">Политика конфиденциальности</span>
              <span className="cursor-pointer hover:text-yellow-400 transition-colors">Условия использования</span>
              <span className="cursor-pointer hover:text-yellow-400 transition-colors">Возврат средств</span>
            </div>
            <div className="text-xs" style={{ color: '#334155' }}>© 2026 RobuxShop</div>
          </div>
          <div className="mt-4 text-center text-xs" style={{ color: '#1e293b' }}>
            RobuxShop не является официальным партнёром Roblox Corporation.
          </div>
        </div>
      </footer>

      {/* Buy Modal */}
      {showModal && cartItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-scale-in"
            style={{ backgroundColor: '#0F1525', border: '1px solid rgba(255,215,0,0.2)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-russo text-xl" style={{ color: '#F8FAFF' }}>Оформление покупки</h3>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="p-4 rounded-xl mb-4 flex items-center justify-between"
              style={{ backgroundColor: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.15)' }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cartItem.icon}</span>
                <div>
                  <div className="font-russo text-xl" style={{ color: '#FFD700' }}>{cartItem.amount.toLocaleString()} Robux</div>
                  {cartItem.bonus && <div className="text-xs" style={{ color: '#10B981' }}>🎁 {cartItem.bonus}</div>}
                </div>
              </div>
              <div className="font-russo text-2xl" style={{ color: '#F8FAFF' }}>{cartItem.price} ₽</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Никнейм в Roblox</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Твой Roblox никнейм..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ backgroundColor: '#141B2E', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Способ оплаты</label>
              <div className="grid grid-cols-2 gap-2">
                {["💳 Банковская карта", "📱 СБП", "💰 QIWI", "🎮 ЮMoney"].map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPayment(i)}
                    className="py-2 px-3 rounded-lg text-xs font-medium text-left transition-all"
                    style={{
                      backgroundColor: selectedPayment === i ? 'rgba(255,215,0,0.12)' : '#141B2E',
                      border: selectedPayment === i ? '1px solid rgba(255,215,0,0.35)' : '1px solid rgba(255,255,255,0.06)',
                      color: selectedPayment === i ? '#FFD700' : '#64748b',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="glow-btn w-full py-4 rounded-xl font-bold text-base"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', color: '#0A0E1A' }}
              onClick={() => { setShowModal(false); alert("Подключение платёжной системы настраивается отдельно!"); }}
            >
              💳 Оплатить {cartItem.price} ₽
            </button>

            <div className="mt-3 flex justify-center gap-4 text-xs" style={{ color: '#475569' }}>
              <span>🔒 SSL защита</span>
              <span>🛡️ Гарантия возврата</span>
              <span>⚡ Доставка за 5 мин</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}