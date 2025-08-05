# Facebook Conversions API - Vercel

Цей проект реалізує Facebook Conversions API для відстеження подій на веб-сайті.

## Налаштування

### 1. Змінні середовища (Environment Variables)

Для роботи з Facebook Conversions API потрібно налаштувати змінні середовища:

#### Локальна розробка
Створіть файл `.env` в корені проекту:

```env
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token_here
FACEBOOK_PIXEL_ID=your_pixel_id_here
```

#### Vercel Deployment
Додайте змінні середовища в налаштуваннях Vercel:

1. Перейдіть до вашого проекту в Vercel Dashboard
2. Виберіть вкладку "Settings"
3. Перейдіть до "Environment Variables"
4. Додайте:
   - `FACEBOOK_ACCESS_TOKEN` = ваш Facebook access token
   - `FACEBOOK_PIXEL_ID` = ваш Pixel ID

### 2. Як отримати Facebook Access Token

1. Перейдіть до [Facebook Developers](https://developers.facebook.com/)
2. Створіть або виберіть ваш додаток
3. Перейдіть до "Tools" → "Graph API Explorer"
4. Виберіть ваш додаток та потрібні дозволи
5. Натисніть "Generate Access Token"
6. Скопіюйте токен

### 3. Як знайти Pixel ID

1. Перейдіть до [Facebook Business Manager](https://business.facebook.com/)
2. Виберіть "Events Manager"
3. Знайдіть ваш Pixel
4. Pixel ID буде показаний у форматі: `123456789012345`

## Зміна токена або API ключа

### Спосіб 1: Через змінні середовища (РЕКОМЕНДУЄТЬСЯ)

1. **Локально**: Оновіть файл `.env`
2. **На Vercel**: Оновіть змінні середовища в Dashboard

### Спосіб 2: Пряма зміна в коді (НЕ РЕКОМЕНДУЄТЬСЯ)

Якщо потрібно змінити токен прямо в коді, відредагуйте файл `api/collect.js`:

```javascript
const response = await fetch(
  `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=YOUR_NEW_TOKEN_HERE`,
  // ...
);
```

## Безпека

⚠️ **ВАЖЛИВО**: Ніколи не комітьте токени в Git репозиторій. Використовуйте змінні середовища.

## Використання

API endpoint: `POST /api/collect`

Приклад запиту:
```javascript
fetch('/api/collect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event_name: 'Purchase',
    event_id: 'evt_123',
    user_data: {
      email: 'user@example.com',
      phone: '+1234567890',
      fbp: 'fbp_123',
      fbc: 'fbc_123'
    }
  })
});
```

## Розгортання

```bash
# Встановлення залежностей
npm install

# Локальний запуск
npm run dev

# Розгортання на Vercel
vercel --prod
```
