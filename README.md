# Smart Facebook Publisher 🚀

منصة ذكية لنشر المحتوى التلقائي على فيسبوك مع قوة الذكاء الاصطناعي

## الميزات الرئيسية

✅ **Facebook Connection** - الاتصال الآمن برسالة Meta OAuth
✅ **Groups Manager** - إدارة المجموعات والتصنيفات
✅ **Post Creator** - إنشاء منشورات مع صور وفيديوهات
✅ **AI Variants** - توليد نسخ متعددة بالذكاء الاصطناعي
✅ **Scheduler** - جدولة المنشورات بأوقات مختلفة
✅ **Dashboard** - لوحة تحكم شاملة

## المكدس التقني

### Frontend
- **Next.js 15** - React Framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **TypeScript** - Type Safety

### Backend
- **Next.js API Routes** - API
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **TypeScript** - Type Safety

### Queue & Jobs
- **Redis** - Caching & Queue
- **BullMQ** - Job Queue

### AI & External APIs
- **OpenAI API** - Content Generation
- **Meta Graph API** - Facebook Integration

## التثبيت

### المتطلبات
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Meta App ID
- OpenAI API Key

### خطوات التثبيت

```bash
# 1. Clone the repository
git clone https://github.com/omaralafahgane/smart-facebook-publisher.git
cd smart-facebook-publisher

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Setup database
npm run prisma:migrate

# 5. Generate Prisma client
npm run prisma:generate

# 6. Start development server
npm run dev
```

التطبيق سيكون متاحاً على: http://localhost:3000

## البنية

```
smart-facebook-publisher/
├── src/
│   ├── app/                    # Next.js App
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Authentication
│   │   ├── dashboard/         # Dashboard Pages
│   │   └── layout.tsx         # Root Layout
│   ├── components/            # Reusable Components
│   ├── lib/                   # Utilities & Libraries
│   │   ├── auth.ts           # Auth helpers
│   │   ├── facebook.ts       # Facebook API
│   │   ├── openai.ts         # OpenAI Integration
│   │   ├── queue.ts          # BullMQ Queue
│   │   └── prisma.ts         # Prisma Client
│   └── types/                 # TypeScript Types
├── prisma/
│   └── schema.prisma          # Database Schema
├── .env.example               # Environment Template
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript Config
├── tailwind.config.ts        # Tailwind Config
└── next.config.js            # Next.js Config
```

## الخطوات التالية

- [ ] بناء صفحة تسجيل الدخول
- [ ] بناء Dashboard
- [ ] بناء Page Manager
- [ ] بناء Group Manager
- [ ] بناء Post Creator
- [ ] بناء AI Variant Generator
- [ ] بناء Scheduler
- [ ] بناء Publish Queue Worker
- [ ] بناء Logs & Analytics

## المساهمة

نرحب بمساهماتك! يرجى فتح Pull Request مع وصف التغييرات.

## الترخيص

MIT License - انظر LICENSE للتفاصيل

## التواصل

للأسئلة والمساعدة، يرجى فتح Issue في المستودع.
