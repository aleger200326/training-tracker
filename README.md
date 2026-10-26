# GEORGRAD

Трекер тренировок для дома и зала. Интерфейс доступен на русском, узбекском и английском языках, со светлой и тёмной темой. Каталог включает упражнения [free-exercise-db](https://github.com/yuhonas/free-exercise-db) ([Unlicense](https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md)).

Рабочий сайт: [georgrad.vercel.app](https://georgrad.vercel.app/). Neon Auth, Data API, таблица с RLS и переменные окружения Vercel уже настроены.

## Что нужно сделать пользователю

1. **Сохраните старые тренировки.** Откройте [старый сайт на GitHub Pages](https://aleger200326.github.io/training-tracker/), перейдите в «Профиль» и нажмите «Экспорт JSON». Сохраните файл. Браузер не разрешает новому адресу Vercel напрямую прочитать данные старого адреса.
2. **Создайте личный вход.** Откройте [GEORGRAD на Vercel](https://georgrad.vercel.app/), нажмите «Регистрация» и введите свою почту и пароль. При необходимости подтвердите почту и войдите.
3. **Перенесите тренировки.** В «Профиле» нажмите «Импорт JSON» и выберите файл из шага 1. Перезагрузите страницу, чтобы проверить сохранение. Затем проверьте вход с другого браузера.

Репозиторий `aleger200326/training-tracker` связан с проектом Vercel `georgrad`: изменения в ветке `main` автоматически запускают новую публикацию сайта.

Старый сайт GitHub Pages остаётся доступным для экспорта. Данные облачной версии хранятся в Neon, отдельно для каждого аккаунта. JSON файл содержит данные профиля и тренировок: храните его как личную резервную копию.

## Локальная разработка

```bash
pnpm install
Copy-Item .env.example .env.local
```

Заполните `.env.local` двумя HTTPS адресами Neon, затем запустите `pnpm dev`. Производственная проверка: `pnpm build`. `.env.local` исключён из Git.

Регистрация и сессия работают через Neon Auth. Записи загружаются через Neon Data API. Сайт не содержит пароля базы данных. При ошибке загрузки данных редактор блокируется, чтобы случайно не перезаписать сохранённые тренировки.

## Облачная конфигурация

Проект Neon: `patient-mode-65011168`. Включены Managed Better Auth и Data API. Схема из [`neon/schema.sql`](neon/schema.sql) применена в SQL Editor: у таблицы `workout_data` включён RLS, который разрешает каждому вошедшему пользователю доступ только к собственной записи. Домен `https://georgrad.vercel.app` добавлен в доверенные домены Neon Auth.

Проект Vercel: `georgrad` в аккаунте `aleger200326-5244`. Framework Preset: Vite; Build Command: `pnpm build`; Output Directory: `dist`. Публичные адреса Neon переданы через `VITE_NEON_AUTH_URL` и `VITE_NEON_DATA_API_URL` для Production, Preview и Development. PostgreSQL URL с паролем в клиентском приложении не используется.
