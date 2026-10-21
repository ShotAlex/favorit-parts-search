# Favorit Parts — поиск запчастей

React-приложение для поиска производителей автозапчасти и получения аналогов и складских предложений через API Favorit Parts.

## Запуск локально

```bash
npm install
npm run dev
```

Для тестирования используется демонстрационный ключ из документации API. Чтобы указать собственный ключ, создайте `.env.local` на основе `.env.example` и задайте `VITE_FAVORIT_API_KEY`.

## Сборка

```bash
npm run build
npm run preview
```

## Публикация на Vercel

Импортируйте репозиторий в Vercel. Команда сборки — `npm run build`, папка результата — `dist`. При необходимости задайте `VITE_FAVORIT_API_KEY` в настройках проекта.

## API

- Поиск производителей: `GET https://api.favorit-parts.ru/hs/hsprice/?key=…&number=…&info=on`
- Аналоги и предложения: те же параметры плюс `brand=…&analogues=on`
- Цена берётся из предложений каждого склада (`warehouses[].price`), остаток — из `warehouses[].stock`.
