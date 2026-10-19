# QA Sprint Report

Приложение для формирования QA-отчётов по спринтам на основе данных Jira.

Позволяет анализировать задачи, дефекты, приоритеты, переносы между спринтами и результаты тестирования. Поддерживает ручное заполнение целей спринта, оценку QA и экспорт отчёта в PDF.

## Требования

- Node.js 22.12+
- npm
- Доступ к Jira API

## Установка

Клонировать репозиторий:

```bash
git clone https://github.com/mikuhann/qa-sprint-report.git
cd qa-sprint-report
```

Установить зависимости:

```bash
npm ci
npm --prefix dashboard ci
```

## Настройка окружения

### Backend

Создать `.env` в корне проекта на основе `.env.example`:

```env
JIRA_DOMAIN=icontext-dev.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-token
JIRA_BOARD_ID=7
JIRA_PROJECT_KEY=ERPBACK
REPORT_TIME_ZONE=Europe/Minsk
DASHBOARD_URL=http://localhost:5173
```

Для доступа к Jira API необходим API-токен Atlassian.

### Dashboard

Создать `dashboard/.env` на основе `dashboard/.env.example`:

```env
VITE_JIRA_BASE_URL=https://icontext-dev.atlassian.net
```

## Запуск

Из корня проекта выполнить:

```bash
npm run dev
```

Команда сформирует отчёт для активного спринта и запустит API-сервер вместе с Dashboard.

После запуска:

- Dashboard: http://localhost:5173
- API: http://localhost:3001

В интерфейсе можно выбрать нужный спринт, посмотреть статистику и заполнить дополнительные данные через «Настройки отчёта».

## Генерация отчёта

Для активного спринта:

```bash
npm run report
```

Для конкретного спринта:

```bash
npm run report -- --sprint 1108
```

Сгенерированные данные сохраняются в:

- `output/sprint-<id>/report.json` — данные отчёта.
- `dashboard/public/report.json` — копия для Dashboard.

Ручные настройки спринтов сохраняются в `config/sprints/<id>.json`.

## Экспорт PDF

Перед первым экспортом установить Chromium:

```bash
npx playwright install chromium
```

Запустить приложение:

```bash
npm run dev
```

Выбрать нужный спринт и нажать кнопку «Экспорт PDF».

PDF формируется с учётом статистики Jira и вручную заполненных данных.

## Дополнительные команды

| Команда             | Описание                        |
| ------------------- | ------------------------------- |
| `npm run dev`       | Запуск приложения               |
| `npm run report`    | Генерация отчёта                |
| `npm run server`    | Запуск API-сервера              |
| `npm run dashboard` | Запуск Dashboard                |
| `npm run build`     | Сборка проекта                  |
| `npm run lint`      | Проверка Dashboard через ESLint |

## Структура проекта

```text
qa-sprint-report/
├── src/
│   ├── jira/           # Работа с Jira API
│   ├── report/         # Формирование отчётов
│   ├── pdf/            # Экспорт PDF
│   └── server.ts       # API-сервер
├── dashboard/          # React-приложение
├── config/
│   └── sprints/        # Ручные настройки спринтов
├── output/             # Сгенерированные отчёты
└── .env.example        # Пример конфигурации
```
