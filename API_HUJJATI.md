# 🌐 API Hujjati

## Base URL

```
https://api.moneychange.uz
```

## Authentication

Barcha himoyalangan endpoint'lar JWT token talab qiladi.

### Headers

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### 1. Login (Kirish)

Tizimga kirish va JWT token olish.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "phone": "+998901234567",
  "password": "your_password"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "username": "john_doe",
    "phone": "+998901234567",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Telefon yoki parol noto'g'ri",
  "statusCode": 401
}
```

---

### 2. Register (Ro'yxatdan o'tish)

Yangi foydalanuvchi yaratish.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "phone": "+998901234567",
  "password": "secure_password",
  "role": "user",
  "secretKey": "admin_secret_key"
}
```

**Response (Success - 201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "username": "john_doe",
    "phone": "+998901234567",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Bu telefon raqami allaqachon ro'yxatdan o'tgan",
  "statusCode": 400
}
```

**Response (Error - 403):**
```json
{
  "message": "Maxfiy kalit noto'g'ri",
  "statusCode": 403
}
```

---

## 🏙️ Regions Endpoints

### 1. Get All Regions (Barcha viloyatlar)

Barcha viloyatlar ro'yxatini olish.

**Endpoint:** `GET /regions`

**Headers:** Authorization required

**Response (Success - 200):**
```json
[
  {
    "id": "uuid-1",
    "name": "Toshkent",
    "totalBalanceUzs": "10000000.00",
    "totalBalanceUsd": "1000.00",
    "balanceIncomeUzs": "15000000.00",
    "balanceIncomeUsd": "1500.00",
    "balanceExpenseUzs": "5000000.00",
    "balanceExpenseUsd": "500.00",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "outgoingOrders": [],
    "incomingOrders": []
  },
  {
    "id": "uuid-2",
    "name": "Samarqand",
    "totalBalanceUzs": "8000000.00",
    "totalBalanceUsd": "800.00",
    "balanceIncomeUzs": "12000000.00",
    "balanceIncomeUsd": "1200.00",
    "balanceExpenseUzs": "4000000.00",
    "balanceExpenseUsd": "400.00",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "outgoingOrders": [],
    "incomingOrders": []
  }
]
```

---

### 2. Create Region (Yangi viloyat)

Yangi viloyat yaratish.

**Endpoint:** `POST /regions`

**Headers:** Authorization required (Admin only)

**Request Body:**
```json
{
  "name": "Buxoro"
}
```

**Response (Success - 201):**
```json
{
  "id": "uuid-3",
  "name": "Buxoro",
  "totalBalanceUzs": "0.00",
  "totalBalanceUsd": "0.00",
  "balanceIncomeUzs": "0.00",
  "balanceIncomeUsd": "0.00",
  "balanceExpenseUzs": "0.00",
  "balanceExpenseUsd": "0.00",
  "created_at": "2024-01-20T12:00:00.000Z",
  "updated_at": "2024-01-20T12:00:00.000Z",
  "outgoingOrders": [],
  "incomingOrders": []
}
```

**Response (Error - 400):**
```json
{
  "message": "Viloyat nomi majburiy",
  "statusCode": 400
}
```

**Response (Error - 409):**
```json
{
  "message": "Bu nomli viloyat allaqachon mavjud",
  "statusCode": 409
}
```

---

### 3. Update Region (Viloyatni yangilash)

Viloyat ma'lumotlarini yangilash.

**Endpoint:** `PATCH /regions/:id`

**Headers:** Authorization required (Admin only)

**Request Body:**
```json
{
  "name": "Toshkent shahri",
  "balanceIncomeUzs": "20000000.00",
  "balanceIncomeUsd": "2000.00",
  "balanceExpenseUzs": "8000000.00",
  "balanceExpenseUsd": "800.00"
}
```

**Response (Success - 200):**
```json
{
  "id": "uuid-1",
  "name": "Toshkent shahri",
  "totalBalanceUzs": "12000000.00",
  "totalBalanceUsd": "1200.00",
  "balanceIncomeUzs": "20000000.00",
  "balanceIncomeUsd": "2000.00",
  "balanceExpenseUzs": "8000000.00",
  "balanceExpenseUsd": "800.00",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-20T14:30:00.000Z",
  "outgoingOrders": [],
  "incomingOrders": []
}
```

**Response (Error - 404):**
```json
{
  "message": "Viloyat topilmadi",
  "statusCode": 404
}
```

---

### 4. Delete Region (Viloyatni o'chirish)

Viloyatni o'chirish.

**Endpoint:** `DELETE /regions/:id`

**Headers:** Authorization required (Admin only)

**Response (Success - 200):**
```json
{
  "message": "Viloyat muvaffaqiyatli o'chirildi",
  "id": "uuid-1"
}
```

**Response (Error - 404):**
```json
{
  "message": "Viloyat topilmadi",
  "statusCode": 404
}
```

**Response (Error - 409):**
```json
{
  "message": "Bu viloyatda aktiv buyurtmalar mavjud, o'chirib bo'lmaydi",
  "statusCode": 409
}
```

---

## 📦 Orders Endpoints

### 1. Get Orders (Buyurtmalar ro'yxati)

Buyurtmalar ro'yxatini pagination, qidiruv va filtrlash bilan olish.

**Endpoint:** `GET /orders`

**Headers:** Authorization required

**Query Parameters:**
- `page` (optional, default: 1) - Sahifa raqami
- `limit` (optional, default: 15) - Har sahifada nechta element
- `search` (optional) - Telefon raqami yoki viloyat nomi bo'yicha qidiruv
- `fromRegionId` (optional) - Chiqim viloyati ID si
- `toRegionId` (optional) - Kirim viloyati ID si
- `dateFrom` (optional) - Boshlanish sanasi (ISO format)
- `dateTo` (optional) - Tugash sanasi (ISO format)

**Example Request:**
```
GET /orders?page=1&limit=15&search=998901234567&dateFrom=2024-01-01&dateTo=2024-01-31
```

**Response (Success - 200):**
```json
{
  "data": [
    {
      "id": "order-uuid-1",
      "phone": "+998901234567",
      "from_region": {
        "id": "region-uuid-1",
        "name": "Toshkent",
        "totalBalanceUzs": "10000000.00",
        "totalBalanceUsd": "1000.00",
        "balanceIncomeUzs": "15000000.00",
        "balanceIncomeUsd": "1500.00",
        "balanceExpenseUzs": "5000000.00",
        "balanceExpenseUsd": "500.00",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      },
      "to_region": {
        "id": "region-uuid-2",
        "name": "Samarqand",
        "totalBalanceUzs": "8000000.00",
        "totalBalanceUsd": "800.00",
        "balanceIncomeUzs": "12000000.00",
        "balanceIncomeUsd": "1200.00",
        "balanceExpenseUzs": "4000000.00",
        "balanceExpenseUsd": "400.00",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      },
      "incomeUzs": "5000000.00",
      "expenseUzs": "5500000.00",
      "incomeUsd": "500.00",
      "expenseUsd": "520.00",
      "flowBalanceUzs": -500000,
      "flowBalanceUsd": -20,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "is_deleted": false
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 15,
  "totalPages": 3
}
```

---

### 2. Create Order (Yangi buyurtma)

Yangi buyurtma yaratish.

**Endpoint:** `POST /orders`

**Headers:** Authorization required

**Request Body:**
```json
{
  "fromRegionId": "region-uuid-1",
  "toRegionId": "region-uuid-2",
  "phone": "+998901234567",
  "incomeUzs": 5000000,
  "expenseUzs": 5500000,
  "incomeUsd": 500,
  "expenseUsd": 520
}
```

**Response (Success - 201):**
```json
{
  "id": "order-uuid-new",
  "phone": "+998901234567",
  "from_region": {
    "id": "region-uuid-1",
    "name": "Toshkent"
  },
  "to_region": {
    "id": "region-uuid-2",
    "name": "Samarqand"
  },
  "incomeUzs": "5000000.00",
  "expenseUzs": "5500000.00",
  "incomeUsd": "500.00",
  "expenseUsd": "520.00",
  "flowBalanceUzs": -500000,
  "flowBalanceUsd": -20,
  "created_at": "2024-01-20T15:00:00.000Z",
  "updated_at": "2024-01-20T15:00:00.000Z",
  "is_deleted": false
}
```

**Response (Error - 400):**
```json
{
  "message": "Barcha maydonlar to'ldirilishi kerak",
  "statusCode": 400
}
```

**Response (Error - 404):**
```json
{
  "message": "Viloyat topilmadi",
  "statusCode": 404
}
```

**Response (Error - 422):**
```json
{
  "message": "Chiqim viloyatida yetarli balans yo'q",
  "statusCode": 422
}
```

---

### 3. Delete Order (Buyurtmani o'chirish)

Buyurtmani o'chirish (soft delete).

**Endpoint:** `DELETE /orders/:id`

**Headers:** Authorization required (Admin only)

**Response (Success - 200):**
```json
{
  "message": "Buyurtma muvaffaqiyatli o'chirildi",
  "id": "order-uuid-1"
}
```

**Response (Error - 404):**
```json
{
  "message": "Buyurtma topilmadi",
  "statusCode": 404
}
```

---

## 📊 Analytics Endpoints

### 1. Get Analytics (Umumiy statistika)

Tizimning umumiy statistikasini olish.

**Endpoint:** `GET /analytics`

**Headers:** Authorization required (Admin only)

**Response (Success - 200):**
```json
{
  "totalIncomeUzs": 50000000,
  "totalIncomeUsd": 5000,
  "totalExpenseUzs": 30000000,
  "totalExpenseUsd": 3000,
  "totalBalanceUzs": 20000000,
  "totalBalanceUsd": 2000,
  "totalFlowBalanceUzs": -5000000,
  "totalFlowBalanceUsd": -500
}
```

**Tushuntirish:**
- `totalIncomeUzs/Usd` - Barcha viloyatlardagi jami kirim
- `totalExpenseUzs/Usd` - Barcha viloyatlardagi jami chiqim
- `totalBalanceUzs/Usd` - Barcha viloyatlardagi jami balans
- `totalFlowBalanceUzs/Usd` - Barcha buyurtmalardagi flow balansi

---

## 🔒 Error Codes

| Status Code | Ma'nosi | Tavsif |
|-------------|---------|--------|
| 200 | OK | So'rov muvaffaqiyatli bajarildi |
| 201 | Created | Yangi resurs yaratildi |
| 400 | Bad Request | Noto'g'ri so'rov ma'lumotlari |
| 401 | Unauthorized | Autentifikatsiya talab qilinadi |
| 403 | Forbidden | Ruxsat yo'q |
| 404 | Not Found | Resurs topilmadi |
| 409 | Conflict | Konflikt (masalan, dublikat) |
| 422 | Unprocessable Entity | Validatsiya xatosi |
| 500 | Internal Server Error | Server xatosi |

---

## 📝 Request/Response Examples

### Example 1: Login va Region yaratish

```bash
# 1. Login
curl -X POST https://api.moneychange.uz/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "password": "admin123"
  }'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { ... }
# }

# 2. Region yaratish
curl -X POST https://api.moneychange.uz/regions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Farg'ona"
  }'
```

### Example 2: Buyurtma yaratish

```bash
curl -X POST https://api.moneychange.uz/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "fromRegionId": "region-uuid-1",
    "toRegionId": "region-uuid-2",
    "phone": "+998901234567",
    "incomeUzs": 5000000,
    "expenseUzs": 5500000,
    "incomeUsd": 500,
    "expenseUsd": 520
  }'
```

### Example 3: Buyurtmalarni qidirish

```bash
curl -X GET "https://api.moneychange.uz/orders?page=1&limit=10&search=998901234567&dateFrom=2024-01-01&dateTo=2024-01-31" \
  -H "Authorization: Bearer your_token_here"
```

---

## 🔐 Token Management

### Token Format

JWT token quyidagi ma'lumotlarni o'z ichiga oladi:

```json
{
  "userId": "uuid-string",
  "phone": "+998901234567",
  "role": "admin",
  "iat": 1705824000,
  "exp": 1705910400
}
```

### Token Expiration

- Token muddati: 24 soat
- Token muddati tugaganda qayta login qilish kerak
- Frontend avtomatik logout qiladi

### Token Storage

Frontend da token localStorage da saqlanadi:

```typescript
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

---

## 📱 Frontend Integration

### Angular Service Example

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Headers with token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all regions
  getRegions() {
    return this.http.get(`${this.baseUrl}/regions`, {
      headers: this.getHeaders()
    });
  }

  // Create order
  createOrder(dto: CreateOrderDto) {
    return this.http.post(`${this.baseUrl}/orders`, dto, {
      headers: this.getHeaders()
    });
  }
}
```

---

## 🧪 Testing

### Postman Collection

API ni test qilish uchun Postman collection yaratish mumkin:

1. Yangi collection yarating
2. Environment variables qo'shing:
   - `baseUrl`: `https://api.moneychange.uz`
   - `token`: `your_jwt_token`
3. Har bir endpoint uchun request yarating

### Example Postman Request

```
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "phone": "+998901234567",
  "password": "admin123"
}
```

---

## 📞 Support

API bilan bog'liq muammolar yoki savollar uchun:

- Backend developer bilan bog'laning
- API documentation ni tekshiring
- Error response'larni diqqat bilan o'qing

---

**API Version:** 1.0  
**Last Updated:** 2024  
**Base URL:** https://api.moneychange.uz
