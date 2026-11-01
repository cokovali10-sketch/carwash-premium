<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:38bdf8,100:a78bfa&height=160&section=header&text=carwash-premium&fontSize=48&fontColor=ffffff&fontAlignY=38&animation=fadeIn" alt="header" />

</div>

<div align="center">

# 💧 АкваПремиум — Car Wash & Detailing Platform

**Immersive 3D landing page for a premium car wash & detailing service**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r169-black?style=flat&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02.svg)](https://greensock.com/gsap/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

</div>

---

## 📋 О проекте

**АкваПремиум** — премиум-автомойка и детейлинг нового уровня. Современный 3D-лендинг с интерактивной WebGL-сценой, плавной анимацией и адаптивным качеством рендеринга. Создан для привлечения клиентов и демонстрации услуг автосервиса.

### ✨ Ключевые особенности

- **Иммерсивная 3D-сцена** — WebGL-фон с анимированными водными эффектами, частицами и постобработкой
- **Адаптивное качество** — автоматическая регулировка DPR, FPS и эффектов на основе производительности устройства
- **Плавный скролл** — Lenis + GSAP ScrollTrigger в одном такте анимации
- **Магнитный курсор** — кастомный курсор с притяжением к интерактивным элементам
- **Прелоадер** — реальный прогресс загрузки через `useProgress`, без лишних ре-рендеров
- **Аудио-движок** — тактильные звуковые эффекты (hover, click, scroll)
- **Бронирование** — интерактивная форма записи с выбором услуг и времени
- **Цены и пакеты** — прозрачная система тарифов (Экспресс, Премиум, Детейлинг, Подписки)
- **SEO-оптимизация** — мета-теги, семантическая разметка, OG-теги

---

## 🏗️ Архитектура

```
src/
├── three/                  3D-сцена (WebGL)
│   ├── SceneCanvas.jsx     Ленивая загрузка (отдельный чанк)
│   ├── Experience.jsx     Композиция сцены
│   ├── PostFX.jsx         Постобработка (Bloom, CA, Vignette)
│   ├── CameraAndLights.jsx  Камера, свет, окружение
│   ├── CarModel.jsx       3D-модель автомобиля
│   └── WaterScene.jsx     Водная поверхность, частицы
├── components/             React-компоненты
│   ├── sections/          Секции страницы (Hero, Services, Pricing, Booking, Contact)
│   ├── ui/                UI-элементы (Overlay, Preloader, CustomCursor, BackToTop, SmoothScroll)
│   └── background/        Фоновые эффекты (NexaBackground)
├── hooks/                  React-хуки
├── lib/                    Утилиты (performanceTier, audioEngine)
├── config/                 Конфигурация сцены
├── nexa/                   Ядро 3D-движка (TypeScript)
├── background/             Фоновые эффекты (WebGL)
└── App.jsx                 Главный компонент
```

---

## 🚀 Быстрый старт

### Требования

- Node.js 20+
- npm 10+

### Установка

```bash
git clone https://github.com/cokovali10-sketch/carwash-premium.git
cd carwash-premium
npm install
```

### Разработка

```bash
npm run dev       # http://localhost:5173
npm run build     # Production build → /dist
npm run preview   # Preview production build
```

### Деплой

Статическая папка `dist/` — деплой на GitHub Pages, Netlify, Vercel или любой статический хостинг.

```bash
npm run build
# Загрузите содержимое dist/ на хостинг
```

---

## 🎨 Секции сайта

| Секция | Описание |
|--------|----------|
| **Hero** | Главный экран с 3D-фоном, заголовком и CTA |
| **Services** | 6 карточек услуг (мойка, керамика, детейлинг, экспресс, антидождь, полировка) |
| **Pricing** | Тарифы (Экспресс 800₽, Премиум 3500₽, Детейлинг 55000₽) + Подписки (Silver/Gold/Platinum) |
| **Booking** | Форма бронирования с выбором услуги, даты и времени |
| **Contact** | Контакты, FAQ, соцсети |

---

## ⚡ Оптимизация

- **Code splitting** — 3D-движок в отдельном чанке (`SceneCanvas`), грузится после первого экрана
- **Lazy loading** — `React.lazy()` + `requestIdleCallback` для отложенной загрузки WebGL
- **Adaptive quality** — динамическая регулировка DPR (0.75–1.25), FPS-мониторинг, отключение PostFX на слабых устройствах
- **Render throttling** — 30 FPS cap для low-tier устройств
- **Zero re-renders** — scroll-state и preloader обновляются без React re-render
- **Single draw call** — 500 частиц огня в одном draw call
- **GPU-only embers** — SideEmbers рендерится только на GPU (zero CPU per frame)

---

## 🛠️ Технологии

| Категория | Технология |
|-----------|------------|
| 3D / WebGL | React Three Fiber 8.17, drei 9.114, postprocessing 2.19, Three.js r169 |
| Анимация | GSAP 3.12 + ScrollTrigger |
| Скролл | Lenis 1.1 |
| UI | React 18, Tailwind 3.4, PostCSS, framer-motion 14, lucide-react |
| Сборка | Vite 5.4 |
| Типизация | TypeScript (nexa/) |
| Качество | performanceTier.js + PerfGovernor |

---

## 📊 Производительность

| Метрика | Значение |
|---------|----------|
| Initial bundle | ~85 KB (gzip: 25 KB) |
| Vendor chunk | ~170 KB (gzip: 53 KB) |
| Three.js chunk | ~703 KB (gzip: 182 KB, lazy) |
| CSS | ~31 KB (gzip: 6.6 KB) |
| Build time | ~8 s |
| Modules | 2015 |

---

## 🔧 Исправленные ошибки

- `ReferenceError: React is not defined` — добавлен импорт `Component` из React
- `ReferenceError: MapPin/Clock/Shield is not defined` — добавлены импорты из `lucide-react`
- `TypeError: Cannot read properties of undefined (reading 'replace')` — исправлен парсинг цветов (разделитель `' '` вместо `' to '`)
- `Function components cannot be given refs` — обёрнуты в `forwardRef`
- `shadowMapType` warning — удалён невалидный проп
- Белый экран — исправлены все ошибки рендера, добавлен `CanvasErrorBoundary`

---

## 📄 Лицензия

MIT — см. [LICENSE](LICENSE).

---

## 👤 Автор

**cokovali10-sketch**

Репозиторий: `https://github.com/cokovali10-sketch/carwash-premium`
