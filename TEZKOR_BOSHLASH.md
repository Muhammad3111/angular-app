# 🚀 Tezkor Boshlash Qo'llanmasi

## 1-Qadam: Loyihani Yuklab Olish

Loyiha allaqachon mavjud: `/media/max/Ramzes1/Angular/angular-app`

## 2-Qadam: Dependencies Tekshirish

Dependencies allaqachon o'rnatilgan. Agar qayta o'rnatish kerak bo'lsa:

```bash
cd /media/max/Ramzes1/Angular/angular-app
npm install
```

## 3-Qadam: Loyihani Ishga Tushirish

### Development Mode

```bash
npm start
```

Brauzerda ochish: `http://localhost:4200`

### Production Build

```bash
npm run build
```

Build natijasi: `dist/exchange-app/browser/`

## 4-Qadam: Tizimga Kirish

### Test Foydalanuvchilar

**Admin:**
- Telefon: `+998 90 123 45 67` (misol)
- Parol: `admin123`
- Rol: `admin`

**User:**
- Telefon: `+998 91 234 56 78` (misol)
- Parol: `user123`
- Rol: `user`

> ⚠️ **Eslatma:** Haqiqiy login ma'lumotlari backend API dan keladi. Yuqoridagi ma'lumotlar faqat misol.

## 5-Qadam: Asosiy Funksiyalarni Sinab Ko'rish

### Admin sifatida:

1. **Home sahifasiga o'ting** (`/home`)
   - Yangi viloyat qo'shing
   - Viloyat balanslarini tahrirlang
   - Umumiy statistikani ko'ring

2. **Dashboard sahifasiga o'ting** (`/dashboard`)
   - Yangi buyurtma yarating
   - Kirim va chiqim viloyatlarini tanlang
   - Summalarni kiriting

3. **Orders History sahifasiga o'ting** (`/orders-history`)
   - Buyurtmalar tarixini ko'ring
   - Qidiruv va filtrlash funksiyalarini sinab ko'ring
   - Buyurtmani o'chiring

### User sifatida:

1. **Dashboard sahifasiga o'ting** (`/dashboard`)
   - Yangi buyurtma yarating

> ℹ️ User faqat Dashboard sahifasiga kirish huquqiga ega.

## 📁 Loyiha Strukturasi (Qisqacha)

```
angular-app/
├── src/
│   ├── app/
│   │   ├── pages/           # Sahifalar
│   │   ├── store/           # NgRx state
│   │   ├── shared/          # Umumiy komponentlar
│   │   ├── layout/          # Layout
│   │   └── types/           # TypeScript types
│   ├── environments/        # Environment config
│   └── styles.css          # Global styles
├── package.json            # Dependencies
├── angular.json            # Angular config
└── tsconfig.json           # TypeScript config
```

## 🔧 Foydali Komandalar

### Development

```bash
# Serverni ishga tushirish
npm start

# Build qilish (watch mode)
npm run watch

# Testlarni ishga tushirish
npm test
```

### Production

```bash
# Production build
npm run build

# SSR server ishga tushirish
npm run serve:ssr:exchange-app
```

### Docker

```bash
# Docker container ishga tushirish
docker-compose up

# Background rejimda
docker-compose up -d

# To'xtatish
docker-compose down
```

## 🌐 API Konfiguratsiyasi

### Development
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://api.moneychange.uz'
};
```

### Production
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.moneychange.uz'
};
```

## 🎨 UI Komponentlari

### Ranglar (TailwindCSS)

- **Primary:** Blue (500, 600, 700)
- **Success:** Green (500, 600)
- **Danger:** Red (500, 600)
- **Warning:** Yellow (500, 600)
- **Gray:** Neutral tones

### Iconlar (FontAwesome)

```typescript
import { faUser, faHome, faChartBar } from '@fortawesome/free-solid-svg-icons';
```

## 🔐 Autentifikatsiya

### Login Flow

1. Foydalanuvchi `/login` sahifasiga kiradi
2. Telefon va parol kiritadi
3. Backend JWT token qaytaradi
4. Token localStorage ga saqlanadi
5. Foydalanuvchi asosiy sahifaga yo'naltiriladi

### Logout Flow

1. Foydalanuvchi "Chiqish" tugmasini bosadi
2. Token localStorage dan o'chiriladi
3. Foydalanuvchi `/login` sahifasiga yo'naltiriladi

## 📊 State Management

### Store'dan ma'lumot olish

```typescript
import { Store } from '@ngrx/store';
import { selectAllRegions } from './store/regions/region.selectors';

constructor(private store: Store) {}

ngOnInit() {
  this.regions$ = this.store.select(selectAllRegions);
}
```

### Action dispatch qilish

```typescript
import * as RegionsActions from './store/regions/region.action';

createRegion(name: string) {
  this.store.dispatch(RegionsActions.createRegion({ region: { name } }));
}
```

## 🐛 Debugging

### Browser DevTools

1. Chrome DevTools ni oching (F12)
2. **Redux DevTools** extension o'rnating
3. NgRx state'ni kuzating

### Angular DevTools

1. Chrome extension o'rnating: "Angular DevTools"
2. Component tree va change detection ni kuzating

### Console Logs

```typescript
// Development mode da console.log ishlaydi
console.log('Debug:', data);
```

## 📱 Responsive Design

Loyiha quyidagi breakpoint'larni qo'llab-quvvatlaydi:

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## ⚡ Performance Tips

1. **Lazy Loading:** Katta modullarni lazy load qiling
2. **OnPush:** Change detection strategiyasini OnPush qiling
3. **TrackBy:** ngFor da trackBy funksiyasini ishlating
4. **Debounce:** Search input'larda debounce qo'llang

## 🔍 Qidiruv va Filtrlash

### Orders History sahifasida

```typescript
// Qidiruv (3 soniya debounce)
searchCtrl.valueChanges
  .pipe(debounceTime(3000))
  .subscribe(() => this.fetch());

// Sana filtri
onFromDate(date: string) {
  this.fromDate = date;
  if (this.fromDate && this.toDate) {
    this.fetch();
  }
}
```

## 🎯 Keyboard Shortcuts

- **Escape:** Modal yoki input'ni tozalash
- **Enter:** Form submit yoki element tanlash
- **Space:** Element tanlash (accessibility)
- **Tab:** Keyingi element'ga o'tish

## 📞 Yordam

### Tez-tez so'raladigan savollar

**Q: Loyiha ishga tushmayapti?**  
A: `npm install` ni qayta ishga tushiring va portni tekshiring.

**Q: API bilan bog'lanish xatosi?**  
A: Environment faylida API URL ni tekshiring.

**Q: Build xatosi?**  
A: `node_modules` ni o'chirib, qayta `npm install` qiling.

**Q: Token muddati tugadi?**  
A: Qayta login qiling.

### Foydali Linklar

- [Angular CLI Commands](https://angular.dev/cli)
- [NgRx Documentation](https://ngrx.io/docs)
- [TailwindCSS Classes](https://tailwindcss.com/docs)

---

**Muvaffaqiyatli ishlar!** 🎉
