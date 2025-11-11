# Exchange App - Loyiha Hujjati

## 📋 Umumiy Ma'lumot

**Loyiha nomi:** Exchange App (Valyuta Almashinuv Tizimi)  
**Texnologiya:** Angular 20.2.0  
**Til:** TypeScript 5.9.2  
**State Management:** NgRx (Store, Effects, Entity)  
**Styling:** TailwindCSS 4.1.12  
**Icons:** FontAwesome 7.0.0  
**Server:** Express.js 5.1.0 (SSR uchun)

## 🎯 Loyihaning Maqsadi

Bu loyiha valyuta almashinuv punktlari uchun mo'ljallangan boshqaruv tizimi bo'lib, turli viloyatlar o'rtasida pul o'tkazmalarini kuzatish, balanslarni boshqarish va buyurtmalar tarixini saqlash imkonini beradi.

## 🏗️ Arxitektura

### Asosiy Komponentlar

```
src/app/
├── pages/              # Sahifalar
│   ├── home/          # Viloyatlar boshqaruvi
│   ├── dashboard/     # Buyurtma yaratish
│   ├── orders-history/ # Buyurtmalar tarixi
│   ├── login/         # Kirish va ro'yxatdan o'tish
│   └── settings/      # Sozlamalar
├── store/             # NgRx State Management
│   ├── auth/          # Autentifikatsiya
│   ├── regions/       # Viloyatlar
│   ├── orders/        # Buyurtmalar
│   └── analytics/     # Analitika
├── shared/            # Umumiy komponentlar va xizmatlar
├── layout/            # Asosiy layout
├── sidebar/           # Yon panel
├── top-navbar/        # Yuqori navigatsiya
└── types/             # TypeScript type definitions
```

## 📱 Sahifalar va Funksiyalar

### 1. Login Sahifasi (`/login`)
**Maqsad:** Foydalanuvchilarni tizimga kiritish va ro'yxatdan o'tkazish

**Funksiyalar:**
- ✅ Kirish (Sign In) - telefon va parol orqali
- ✅ Ro'yxatdan o'tish (Sign Up) - username, telefon, parol va maxfiy kalit
- ✅ Telefon raqamini avtomatik formatlash (+998 XX XXX XX XX)
- ✅ Parolni ko'rsatish/yashirish
- ✅ Animatsiyali tab o'tish (Sign In ↔ Sign Up)
- ✅ Form validatsiyasi

**Rollar:**
- `admin` - to'liq huquqlar
- `user` - cheklangan huquqlar

### 2. Home Sahifasi (`/home`) - Admin
**Maqsad:** Viloyatlarni boshqarish va umumiy statistikani ko'rish

**Funksiyalar:**
- ✅ Viloyatlar ro'yxati
- ✅ Yangi viloyat qo'shish
- ✅ Viloyat ma'lumotlarini tahrirlash:
  - Nomi
  - Kirim balansi (UZS/USD)
  - Chiqim balansi (UZS/USD)
- ✅ Viloyatni o'chirish (tasdiqlash modal bilan)
- ✅ Umumiy analitika:
  - Jami kirim (UZS/USD)
  - Jami chiqim (UZS/USD)
  - Jami balans (UZS/USD)
  - Flow balansi (UZS/USD)
- ✅ Raqamlarni avtomatik formatlash (1 000 000)
- ✅ Real-time yangilanishlar

### 3. Dashboard Sahifasi (`/dashboard`) - User/Admin
**Maqsad:** Yangi buyurtma yaratish

**Funksiyalar:**
- ✅ Ikki bosqichli buyurtma yaratish:
  1. **Kirim viloyatini tanlash** yoki **Chiqim viloyatini tanlash**
  2. Ikkinchi viloyatni tanlash
- ✅ Buyurtma ma'lumotlarini kiritish:
  - Mijoz telefon raqami (avtomatik formatlash)
  - Kirim summasi (UZS/USD)
  - Chiqim summasi (UZS/USD)
- ✅ Avtomatik tekshiruvlar:
  - USD farqi 1000 dan oshsa ogohlantirish
  - UZS farqi 5,000,000 dan oshsa ogohlantirish
  - Chiqim kirimdan katta bo'lsa ogohlantirish
- ✅ Keyboard navigatsiyasi (Enter, Space, Escape)
- ✅ Buyurtma yaratilgandan keyin balanslar avtomatik yangilanadi

### 4. Orders History Sahifasi (`/orders-history`) - Admin
**Maqsad:** Barcha buyurtmalar tarixini ko'rish va boshqarish

**Funksiyalar:**
- ✅ Buyurtmalar ro'yxati (pagination bilan)
- ✅ Qidiruv (3 soniya debounce)
- ✅ Sana bo'yicha filtrlash (dan-gacha)
- ✅ Har bir buyurtmada ko'rsatiladi:
  - Telefon raqami
  - Chiqim viloyati
  - Kirim viloyati
  - Summalar (UZS/USD)
  - Flow balansi (rang bilan: yashil/qizil)
  - Yaratilgan sana
- ✅ Buyurtmani o'chirish (tasdiqlash modal bilan)
- ✅ Sahifalash (oldinga/orqaga)
- ✅ Keyboard shortcut'lar (Escape - tozalash)

### 5. Settings Sahifasi (`/settings`) - Admin
**Maqsad:** Tizim sozlamalarini boshqarish

### 6. Profile Sahifasi (`/profile`) - Admin
**Maqsad:** Foydalanuvchi profilini ko'rish va tahrirlash

## 🔐 Autentifikatsiya va Avtorizatsiya

### Guards
- **authGuard** - foydalanuvchi tizimga kirganligini tekshiradi
- **authChildGuard** - child route'lar uchun tekshirish
- **roleGuard** - foydalanuvchi rolini tekshiradi

### Interceptor
- **authInterceptor** - har bir HTTP so'rovga token qo'shadi

### Token Saqlash
- LocalStorage da `token` va `user` ma'lumotlari saqlanadi
- Token muddati tugasa avtomatik logout

## 📊 State Management (NgRx)

### Store Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    loading: boolean,
    error: string | null
  },
  regions: {
    ids: string[],
    entities: { [id: string]: RegionModel },
    loading: boolean,
    error: string | null
  },
  orders: {
    ids: string[],
    entities: { [id: string]: OrderEntity },
    loading: boolean,
    error: string | null
  },
  analytics: {
    data: Analytics | null,
    loading: boolean,
    error: string | null
  }
}
```

### Actions

**Auth Actions:**
- `login` - tizimga kirish
- `register` - ro'yxatdan o'tish
- `logout` - tizimdan chiqish
- `loginSuccess` / `loginFailure`
- `registerSuccess` / `registerFailure`

**Regions Actions:**
- `loadRegions` - viloyatlarni yuklash
- `createRegion` - yangi viloyat qo'shish
- `updateRegion` - viloyatni yangilash
- `deleteRegion` - viloyatni o'chirish
- Success/Failure variantlari

**Orders Actions:**
- `loadOrders` - buyurtmalarni yuklash (pagination bilan)
- `createOrder` - yangi buyurtma yaratish
- `deleteOrder` - buyurtmani o'chirish
- Success/Failure variantlari

**Analytics Actions:**
- `loadAnalytics` - umumiy statistikani yuklash
- `loadAnalyticsSuccess` / `loadAnalyticsFailure`

## 🌐 API Endpoints

**Base URL:** `https://api.moneychange.uz`

### Auth
- `POST /auth/login` - kirish
- `POST /auth/register` - ro'yxatdan o'tish

### Regions
- `GET /regions` - barcha viloyatlar
- `POST /regions` - yangi viloyat
- `PATCH /regions/:id` - viloyatni yangilash
- `DELETE /regions/:id` - viloyatni o'chirish

### Orders
- `GET /orders?page=1&limit=15&search=...&dateFrom=...&dateTo=...` - buyurtmalar
- `POST /orders` - yangi buyurtma
- `DELETE /orders/:id` - buyurtmani o'chirish

### Analytics
- `GET /analytics` - umumiy statistika

## 🎨 UI/UX Xususiyatlari

### Design System
- **Ranglar:** Tailwind CSS default palette
- **Shriftlar:** System fonts
- **Spacing:** Tailwind spacing scale
- **Responsiv:** Mobile-first approach

### Animatsiyalar
- Smooth transitions (300ms)
- Modal fade in/out
- Card hover effects
- Loading spinners

### Accessibility
- Keyboard navigation
- ARIA labels
- Focus indicators
- Screen reader support

## 🛠️ Ishga Tushirish

### 1. Dependencies o'rnatish
```bash
npm install
```

### 2. Development Server
```bash
npm start
# yoki
ng serve
```
Brauzerda: `http://localhost:4200`

### 3. Production Build
```bash
npm run build
```
Build fayllari: `dist/exchange-app/`

### 4. SSR Server
```bash
npm run serve:ssr:exchange-app
```

### 5. Docker bilan ishga tushirish
```bash
docker-compose up
```

## 📁 Muhim Fayllar

### Konfiguratsiya
- `angular.json` - Angular CLI konfiguratsiyasi
- `tsconfig.json` - TypeScript konfiguratsiyasi
- `package.json` - Dependencies va scripts
- `.env` - Environment variables
- `tailwind.config.js` - TailwindCSS sozlamalari (postcss orqali)

### Environment
- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

### Routing
- `src/app/app.routes.ts` - Asosiy marshrutlar
- `src/app/app.routes.server.ts` - Server-side routing

### State
- `src/app/store/*/` - NgRx store, actions, effects, selectors

## 🔧 Texnik Tafsilotlar

### Angular Features
- ✅ Standalone Components
- ✅ Signals API
- ✅ Zoneless Change Detection
- ✅ Server-Side Rendering (SSR)
- ✅ Hydration with Event Replay
- ✅ Reactive Forms
- ✅ RxJS Operators

### NgRx Features
- ✅ Entity Adapter
- ✅ Effects for side effects
- ✅ Selectors with memoization
- ✅ DevTools integration

### Performance Optimizations
- ✅ Lazy loading (potentsial)
- ✅ OnPush change detection
- ✅ TrackBy functions
- ✅ Debounce for search
- ✅ Pagination

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
ng e2e
```

## 📦 Build va Deploy

### Production Build
```bash
ng build --configuration production
```

### Build Optimizations
- Tree shaking
- Minification
- Code splitting
- AOT compilation
- Prerendering (7 static routes)

### Bundle Size
- **Main bundle:** ~560 KB (raw), ~143 KB (gzipped)
- **Styles:** ~26 KB (raw), ~5 KB (gzipped)
- **Total:** ~586 KB (raw), ~147 KB (gzipped)

⚠️ **Warning:** Bundle size 500 KB limitdan 86 KB oshib ketgan. Optimizatsiya kerak.

## 🔒 Xavfsizlik

### Best Practices
- ✅ JWT token authentication
- ✅ HTTP-only cookies (potentsial)
- ✅ CORS configuration
- ✅ Input sanitization
- ✅ XSS protection
- ✅ CSRF protection

### Environment Variables
```
BASE_URL=http://localhost:3000
API_URL=https://api.moneychange.uz
```

## 🐛 Ma'lum Muammolar va Yechimlar

### 1. Bundle Size Warning
**Muammo:** Initial bundle 500 KB dan oshib ketgan  
**Yechim:** 
- Lazy loading qo'shish
- Unused dependencies olib tashlash
- Code splitting yaxshilash

### 2. Phone Validation
**Muammo:** Telefon raqami validatsiyasi murakkab  
**Yechim:** Custom validator va formatlash funksiyalari

### 3. Number Formatting
**Muammo:** Katta raqamlarni o'qish qiyin  
**Yechim:** Custom pipe va input handler'lar (1 000 000)

## 📚 Qo'shimcha Resurslar

- [Angular Documentation](https://angular.dev)
- [NgRx Documentation](https://ngrx.io)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [RxJS Documentation](https://rxjs.dev)

## 👥 Rollar va Huquqlar

| Sahifa | Admin | User |
|--------|-------|------|
| Home | ✅ | ❌ |
| Dashboard | ✅ | ✅ |
| Orders History | ✅ | ❌ |
| Settings | ✅ | ❌ |
| Profile | ✅ | ❌ |

## 🎯 Kelajakdagi Rejalar

- [ ] Lazy loading qo'shish
- [ ] PWA qilish
- [ ] Real-time updates (WebSocket)
- [ ] Export to Excel/PDF
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (Ionic/Capacitor)

## 📞 Yordam

Savollar yoki muammolar bo'lsa:
1. README.md faylini o'qing
2. Angular CLI documentation ga murojaat qiling
3. NgRx documentation ga murojaat qiling

---

**Loyiha holati:** ✅ Ishlab chiqish bosqichida  
**Oxirgi yangilanish:** 2024  
**Angular versiyasi:** 20.2.0  
**Node versiyasi:** 20.17.19+
