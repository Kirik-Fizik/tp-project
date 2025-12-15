# Startup Flow

Платформа для соединения стартаперов с потенциальными клиентами и инвесторами. Стартаперы могут публиковать свои проекты, а пользователи - находить инновационные решения, оставлять отзывы и поддерживать понравившиеся проекты.

## Основные функции

- **Стартап Flow** — лента с проектами стартапов
- **Аналитика** — диаграммы популярных проектов (на основе лайков)
- **Правила** — правила использования платформы
- **Загрузить свой проект** — публикация новых проектов
- **Донаты** — поддержка проектов финансово
- **Лайки** — возможность лайкать проекты
- **Отзывы** — система отзывов с рейтингом (1-5 звёзд)

## Технологии

### Backend
- **Python 3.11**
- **FastAPI** — веб-фреймворк
- **SQLAlchemy 2.0** — ORM
- **Pydantic 2** — валидация данных
- **PostgreSQL** — база данных
- **Argon2** — хеширование паролей
- **JWT** — аутентификация

### Frontend
- **React 19** / **JavaScript**
- **MobX** — управление состоянием
- **React Router** — маршрутизация
- **Axios** — HTTP-клиент

### Инфраструктура
- **Docker & Docker Compose** — контейнеризация
- **Nginx** — веб-сервер для frontend
- **Pytest** — тестирование

## Структура проекта

```
tp-project/
├── backend/
│   ├── auth/           # Модуль аутентификации
│   │   ├── models.py   # SQLAlchemy модели User
│   │   ├── router.py   # API роуты /auth/*
│   │   ├── schemas.py  # Pydantic схемы
│   │   └── utils.py    # Утилиты (хеширование, JWT)
│   ├── projects/       # Модуль проектов
│   │   ├── models.py   # Модели Project, Like, Review
│   │   ├── router.py   # API роуты /projects/*
│   │   └── schemas.py  # Pydantic схемы
│   ├── database/       # Подключение к БД
│   ├── tests/          # Pytest тесты
│   ├── main.py         # Точка входа FastAPI
│   ├── config.py       # Конфигурация
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   ├── stores/     # MobX stores
│   │   ├── services/   # API сервисы
│   │   └── utils/      # Утилиты
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Запуск с Docker Compose

```bash
# Запуск всех сервисов
docker-compose up --build

# Backend доступен на http://localhost:8000
# Frontend доступен на http://localhost:3000
# API документация: http://localhost:8000/docs
```

## Запуск тестов

```bash
# Запуск тестов в контейнере
docker-compose --profile test run test

# Или локально
cd backend
pip install -r requirements.txt
pytest -v
```

## API Endpoints

### Аутентификация
- `POST /auth/register` — регистрация
- `POST /auth/login` — вход
- `GET /auth/me` — получение текущего пользователя

### Проекты
- `GET /projects/` — список всех проектов
- `POST /projects/` — создание проекта
- `GET /projects/my` — проекты текущего пользователя
- `GET /projects/{id}` — детали проекта
- `POST /projects/{id}/like` — лайк проекта
- `DELETE /projects/{id}/like` — убрать лайк
- `GET /projects/{id}/liked` — проверка лайка
- `POST /projects/{id}/review` — создание отзыва
- `GET /projects/{id}/reviews` — отзывы проекта
- `GET /projects/analytics/top` — аналитика и топ проектов

## Архитектура Backend

### 1. Слоистая архитектура (Layered Architecture)

Трехуровневая архитектура для разделения ответственности:
- Presentation Layer (API Gateway, Controllers) - обработка HTTP запросов и валидация
- Application Layer (Modules, Services) - бизнес-логика и оркестрация
- Data Layer (Repositories) - работа с данными

### 2. Strategy Pattern

В модуле аутентификации используется Strategy Pattern:
- JWT аутентификация
- OAuth провайдеры (с возможностью расширения)
- Инкапсуляция алгоритмов аутентификации

### 3. Adapter Pattern

Для работы с платежными системами:
- Унифицированный интерфейс для разных платежных шлюзов
- Легкое добавление новых провайдеров (Stripe, ЮKassa, PayPal)
- Изоляция специфичной логики каждого шлюза

### 4. Observer Pattern

Система уведомлений:
- События (лайки, донаты, отзывы) генерируют уведомления
- Подписчики получают уведомления асинхронно
- Легкое добавление новых каналов уведомлений

### 5. Factory Pattern

Для создания сложных объектов:
- Инкапсуляция логики создания
- Гарантия корректного состояния объектов
- Упрощение тестирования

## Архитектура Frontend

### 1. Component-Based Architecture

Компонентный подход:
- Переиспользуемые UI компоненты (ProjectCard, LikeButton)
- Разделение ответственности между компонентами
- Иерархическая структура приложения

### 2. State Management (Singleton)

Глобальное состояние приложения:
- Единый источник истины для данных
- Предсказуемое изменение состояния
- Интеграция с devtools для отладки

### 3. Facade Pattern

API Client как Facade:
- Упрощенный интерфейс для работы с бэкендом
- Инкапсуляция сложной логики запросов
- Единая точка для обработки ошибок и интерсепторов

## Диаграммы

### UML Диаграмма базы данных
![alt text](https://github.com/Kirik-Fizik/tp-project/blob/dev/information/DB/db_UML.png)

### UML Диаграмма бэкенда
![alt text](https://github.com/Kirik-Fizik/tp-project/blob/dev/information/Back/UML_backend.svg)

### BPMN Диаграмма процессов
![alt text](https://github.com/Kirik-Fizik/tp-project/blob/dev/information/BPMN/BPMN.png)

## Дизайн

Предварительный дизайн системы доступен по ссылке:
https://www.figma.com/design/Q5X1EX364JipFprc4espFd/babarik-razrabik

## Требования к кодстайлу (выполнено)

- ✅ Логическая структура с разделением на модули
- ✅ Применение Single Responsibility Principle
- ✅ Корректное использование классов и наследования
- ✅ Соблюдение PEP8
- ✅ Документация модулей, классов и функций
- ✅ Type hints с использованием typing
- ✅ Pydantic с валидаторами
- ✅ Корректная обработка ошибок
- ✅ Тесты (pytest)
