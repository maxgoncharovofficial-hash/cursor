# Инструкция по деплою на GitHub Pages

## Шаги для деплоя:

1. **Создайте новый репозиторий на GitHub**
   - Зайдите на https://github.com/new
   - Назовите репозиторий `cursor-course-tracker`
   - Сделайте его публичным (Public)
   - НЕ инициализируйте репозиторий с README

2. **Подключите локальный репозиторий к GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cursor-course-tracker.git
   git branch -M main
   git push -u origin main
   ```

3. **Настройте GitHub Pages**
   - Перейдите в Settings репозитория
   - Слева найдите раздел "Pages"
   - В разделе "Source" выберите "Deploy from a branch"
   - Выберите ветку "main" и папку "/ (root)"
   - Нажмите "Save"

4. **Дождитесь деплоя**
   - GitHub автоматически задеплоит ваш сайт
   - Это может занять несколько минут
   - Сайт будет доступен по адресу: https://YOUR_USERNAME.github.io/cursor-course-tracker/

## Альтернативный способ через GitHub Actions

Если вы хотите использовать GitHub Actions для автоматического деплоя:

1. После пуша кода на GitHub, перейдите в Settings → Pages
2. В разделе "Source" выберите "GitHub Actions"
3. Workflow уже настроен в файле `.github/workflows/deploy.yml`
4. При каждом пуше в main ветку сайт будет автоматически обновляться