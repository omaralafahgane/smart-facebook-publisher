# دليل النشر والتطوير

## المتطلبات الأساسية

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Meta App ID و Secret
- OpenAI API Key

## خطوات التثبيت المحلي

### 1. استنساخ المستودع

```bash
git clone https://github.com/omaralafahgane/smart-facebook-publisher.git
cd smart-facebook-publisher
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env.local
```

ثم قم بتحرير ملف `.env.local` وأضف البيانات التالية:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smart_facebook_publisher"

# Redis
REDIS_URL="redis://localhost:6379"

# Facebook / Meta
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/facebook

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key

# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
npm run prisma:migrate

# توليد Prisma Client
npm run prisma:generate
```

### 5. تشغيل خادم التطوير

```bash
npm run dev
```

التطبيق سيكون متاحاً على: http://localhost:3000

## مسارات API الرئيسية

### الصفحات
- `GET /api/pages` - جلب جميع الصفحات
- `POST /api/pages` - إنشاء صفحة جديدة

### المجموعات
- `GET /api/groups` - جلب جميع المجموعات
- `POST /api/groups` - إنشاء مجموعة جديدة

### المنشورات
- `GET /api/posts` - جلب جميع المنشورات
- `POST /api/posts` - إنشاء منشور جديد
- `POST /api/posts/[id]/publish` - نشر منشور
- `POST /api/posts/[id]/ai-variant` - توليد نسخة ذكية
- `GET/POST /api/posts/[id]/schedule` - جدولة منشور

### المصادقة
- `GET /api/auth/facebook` - معالجة Meta OAuth

### التحميل
- `POST /api/upload` - تحميل صورة

## النشر على الإنتاج

### على Vercel (موصى به)

```bash
# تثبيت Vercel CLI
npm install -g vercel

# النشر
vercel
```

### على خادم مخصص

```bash
# بناء التطبيق
npm run build

# تشغيل التطبيق
npm start
```

## متغيرات البيئة المطلوبة للإنتاج

تأكد من تعيين جميع المتغيرات التالية في بيئة الإنتاج:

- `DATABASE_URL` - رابط قاعدة البيانات
- `REDIS_URL` - رابط Redis
- `FACEBOOK_APP_ID` - معرّف تطبيق Meta
- `FACEBOOK_APP_SECRET` - سر تطبيق Meta
- `FACEBOOK_REDIRECT_URI` - رابط إعادة التوجيه
- `OPENAI_API_KEY` - مفتاح OpenAI API
- `ENCRYPTION_KEY` - مفتاح التشفير (32 حرف)
- `NODE_ENV` - يجب أن يكون "production"

## الاختبار

```bash
# تشغيل الاختبارات
npm test

# مع تغطية الكود
npm run test:coverage
```

## استكشاف الأخطاء

### مشكلة: فشل الاتصال بـ Redis

```bash
# تأكد من تشغيل Redis
redis-cli ping

# إذا لم يكن مثبتاً، قم بتثبيته:
# على macOS:
brew install redis

# على Ubuntu:
sudo apt-get install redis-server
```

### مشكلة: فشل الاتصال بـ PostgreSQL

```bash
# تأكد من تشغيل PostgreSQL
psql -U postgres

# تحقق من رابط DATABASE_URL
```

### مشكلة: فشل Meta OAuth

- تأكد من صحة `FACEBOOK_APP_ID` و `FACEBOOK_APP_SECRET`
- تأكد من تعيين `FACEBOOK_REDIRECT_URI` بشكل صحيح في إعدادات تطبيق Meta
- تأكد من أن التطبيق موثوق من Meta

## المساهمة

نرحب بمساهماتك! يرجى:

1. Fork المستودع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

MIT License - انظر LICENSE للتفاصيل
