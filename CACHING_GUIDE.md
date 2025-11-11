# 🚀 NgRx Caching Guide - React Query Style

Angular loyihangizda React Query'dagi kabi caching mexanizmi qo'shildi.

## 📦 Qo'shilgan Funksiyalar

### 1. **NgRx Entity Adapter**
- Avtomatik normalizatsiya
- Optimallashtirilgan CRUD operatsiyalar
- ID bo'yicha tez qidiruv

### 2. **Cache Management**
- 5 daqiqalik cache timeout
- Avtomatik cache validation
- Force refresh imkoniyati

### 3. **Optimized Selectors**
- Memoized selectors
- Entity-based queries
- Cache status tracking

## 🎯 Qanday Ishlaydi?

### Cache Lifecycle

```typescript
// 1. Birinchi sahifa yuklash
loadRegions({ page: 1, limit: 10 }) // API request, cache: "1_10"

// 2. Ikkinchi sahifa yuklash
loadRegions({ page: 2, limit: 10 }) // API request, cache: "2_10"

// 3. Birinchi sahifaga qaytish (5 daqiqa ichida)
loadRegions({ page: 1, limit: 10 }) // Cache'dan! API request YO'Q ⚡

// 4. Ikkinchi sahifaga qaytish (5 daqiqa ichida)
loadRegions({ page: 2, limit: 10 }) // Cache'dan! API request YO'Q ⚡

// 5. 5 daqiqadan keyin
loadRegions({ page: 1, limit: 10 }) // Cache invalid, yangi request

// 6. Force refresh
loadRegions({ page: 1, limit: 10, force: true }) // Cache ignore, yangi request
```

### Per-Page Caching

Har bir sahifa uchun alohida cache:
- Sahifa 1: `pageCache["1_10"]` → 5 daqiqa
- Sahifa 2: `pageCache["2_10"]` → 5 daqiqa
- Sahifa 3: `pageCache["3_10"]` → 5 daqiqa

### Cache Timeout

```typescript
// region.reducer.ts
cacheTimeout: 5 * 60 * 1000  // 5 minutes (default)

// O'zgartirish uchun:
cacheTimeout: 10 * 60 * 1000  // 10 minutes
cacheTimeout: 60 * 1000       // 1 minute
```

## 💻 Ishlatish

### 1. Oddiy Yuklash (Cache bilan)

```typescript
// Component
ngOnInit() {
  // Agar cache valid bo'lsa, API request yuborilmaydi
  this.store.dispatch(RegionsActions.loadRegions({ 
    page: 1, 
    limit: 10 
  }));
}
```

### 2. Force Refresh (Cache'siz)

```typescript
// Yangi region yaratilganda
this.store.dispatch(RegionsActions.createRegionSuccess({ region }));

// Cache'ni yangilash
this.store.dispatch(RegionsActions.loadRegions({ 
  page: 1, 
  limit: 10, 
  force: true  // ✅ Cache ignore qilinadi
}));
```

### 3. Cache Status Tekshirish

```typescript
// Component
isCacheValid$ = this.store.select(selectIsCacheValid);
lastFetched$ = this.store.select(selectLastFetched);

// Template
@if (isCacheValid$ | async) {
  <span>Ma'lumotlar cache'dan</span>
} @else {
  <span>Yangi ma'lumotlar yuklanmoqda...</span>
}
```

### 4. ID bo'yicha Region Olish

```typescript
// Component
regionId = '123';
region$ = this.store.select(selectRegionById(this.regionId));

// Template
{{ region$ | async | json }}
```

## 🔧 Konfiguratsiya

### Cache Timeout O'zgartirish

```typescript
// region.reducer.ts
export const initialState: RegionsState = regionsAdapter.getInitialState({
  // ...
  cacheTimeout: 10 * 60 * 1000, // 10 daqiqa
});
```

### Entity Adapter Sozlamalari

```typescript
// region.reducer.ts
export const regionsAdapter = createEntityAdapter<Region>({
  selectId: (region) => region.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name), // Alfabetik tartiblash
});
```

## 📊 Afzalliklari

### React Query bilan Taqqoslash

| Xususiyat | React Query | NgRx + Entity Adapter |
|-----------|-------------|----------------------|
| Caching | ✅ | ✅ |
| Auto-refetch | ✅ | ✅ (manual) |
| Optimistic updates | ✅ | ✅ |
| Normalization | ❌ | ✅ |
| DevTools | ✅ | ✅ (Redux DevTools) |
| SSR Support | ✅ | ✅ |
| Bundle size | ~13KB | ~20KB |

### Afzalliklari

1. **Performance** - Memoized selectors, tez qidiruv
2. **Normalization** - Bir xil ma'lumot bir marta saqlanadi
3. **Type Safety** - TypeScript to'liq qo'llab-quvvatlash
4. **DevTools** - Redux DevTools bilan debug
5. **SSR** - Server-side rendering qo'llab-quvvatlash

## 🎨 Misol: Optimistic Update

```typescript
// Component
updateRegion(id: string, changes: Partial<Region>) {
  // 1. Optimistic update (darhol UI'da ko'rsatish)
  this.store.dispatch(RegionsActions.updateRegionSuccess({ 
    region: { id, ...changes } 
  }));
  
  // 2. Backend'ga yuborish
  this.store.dispatch(RegionsActions.updateRegion({ id, changes }));
}

// Effect
update$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RegionsActions.updateRegion),
    mergeMap(({ id, changes }) =>
      this.http.put(`${this.apiUrl}/${id}`, changes).pipe(
        map((updated) => RegionsActions.updateRegionSuccess({ region: updated })),
        catchError((err) => {
          // Xatolik bo'lsa, eski holatga qaytarish
          return of(RegionsActions.updateRegionFailure({ error: err.message }));
        })
      )
    )
  )
);
```

## 🔍 Debug

### Redux DevTools

```typescript
// Browser console
// State'ni ko'rish
$ngRedux.getState().regions

// Cache status
$ngRedux.getState().regions.lastFetched
$ngRedux.getState().regions.cacheTimeout

// Entities
$ngRedux.getState().regions.entities
$ngRedux.getState().regions.ids
```

### Console Logging

```typescript
// Effect'da logging
load$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RegionsActions.loadRegions),
    withLatestFrom(this.store.select(selectIsCacheValid)),
    tap(([action, isCacheValid]) => {
      console.log('Cache valid:', isCacheValid);
      console.log('Force refresh:', action.force);
    }),
    // ...
  )
);
```

## 📝 Best Practices

### 1. Cache'ni To'g'ri Vaqtda Yangilash

```typescript
// ✅ Yaxshi
createRegion() {
  this.store.dispatch(RegionsActions.createRegion({ region }));
  // Success'da avtomatik cache yangilanadi
}

// ❌ Yomon
createRegion() {
  this.http.post('/api/regions', region).subscribe(() => {
    // Cache yangilanmaydi!
  });
}
```

### 2. Force Refresh Faqat Kerakda

```typescript
// ✅ Yaxshi - CRUD operatsiyalardan keyin
this.store.dispatch(RegionsActions.loadRegions({ force: true }));

// ❌ Yomon - Har safar
ngOnInit() {
  this.store.dispatch(RegionsActions.loadRegions({ force: true }));
}
```

### 3. Selector'larni Qayta Ishlatish

```typescript
// ✅ Yaxshi
export const selectActiveRegions = createSelector(
  selectAllRegions,
  (regions) => regions.filter(r => !r.is_deleted)
);

// ❌ Yomon
this.regions$.pipe(
  map(regions => regions.filter(r => !r.is_deleted))
);
```

## 🚀 Keyingi Qadamlar

1. **Background Sync** - Offline qo'llab-quvvatlash
2. **Optimistic Updates** - UI'da darhol ko'rsatish
3. **Pagination Cache** - Har bir sahifa uchun alohida cache
4. **Infinite Scroll** - Cheksiz scroll qo'llab-quvvatlash

## 📚 Qo'shimcha Resurslar

- [NgRx Entity](https://ngrx.io/guide/entity)
- [NgRx Best Practices](https://ngrx.io/guide/eslint-plugin/rules)
- [React Query Comparison](https://tanstack.com/query/latest)

---

**Muallif:** Cascade AI  
**Sana:** 2025-11-12  
**Versiya:** 1.0.0
