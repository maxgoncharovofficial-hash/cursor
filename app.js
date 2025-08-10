// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderSections();
    updateProgressBar();
});

// Генерация уникального ID для урока
function getLessonId(sectionIndex, lessonIndex) {
    return `lesson-${sectionIndex}-${lessonIndex}`;
}

// Загрузка прогресса из localStorage
function loadProgress() {
    const saved = localStorage.getItem('courseProgress');
    if (saved) {
        return JSON.parse(saved);
    }
    return {};
}

// Сохранение прогресса в localStorage
function saveProgress(progress) {
    localStorage.setItem('courseProgress', JSON.stringify(progress));
}

// Отрисовка секций курса
function renderSections() {
    const sectionsContainer = document.getElementById('sections');
    const progress = loadProgress();
    
    courseData.forEach((section, sectionIndex) => {
        const sectionEl = document.createElement('div');
        sectionEl.className = 'section';
        
        const completedInSection = section.lessons.filter((_, lessonIndex) => {
            const lessonId = getLessonId(sectionIndex, lessonIndex);
            return progress[lessonId];
        }).length;
        
        sectionEl.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">${section.section}</h2>
                <span class="section-progress">${completedInSection}/${section.lessons.length}</span>
            </div>
            <div class="lessons">
                ${section.lessons.map((lesson, lessonIndex) => {
                    const lessonId = getLessonId(sectionIndex, lessonIndex);
                    const isCompleted = progress[lessonId];
                    
                    return `
                        <div class="lesson ${isCompleted ? 'completed' : ''}" 
                             data-section="${sectionIndex}" 
                             data-lesson="${lessonIndex}"
                             onclick="toggleLesson(${sectionIndex}, ${lessonIndex})">
                            <div class="checkbox ${isCompleted ? 'checked' : ''}"></div>
                            <div class="lesson-content">
                                <div class="lesson-number">Урок ${lessonIndex + 1}</div>
                                <div class="lesson-title">${lesson}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        sectionsContainer.appendChild(sectionEl);
    });
}

// Переключение состояния урока
function toggleLesson(sectionIndex, lessonIndex) {
    const progress = loadProgress();
    const lessonId = getLessonId(sectionIndex, lessonIndex);
    
    if (progress[lessonId]) {
        delete progress[lessonId];
    } else {
        progress[lessonId] = true;
    }
    
    saveProgress(progress);
    updateUI();
}

// Обновление UI
function updateUI() {
    const sectionsContainer = document.getElementById('sections');
    sectionsContainer.innerHTML = '';
    renderSections();
    updateProgressBar();
}

// Обновление прогресс-бара и статистики
function updateProgressBar() {
    const progress = loadProgress();
    const totalLessons = courseData.reduce((sum, section) => sum + section.lessons.length, 0);
    const completedLessons = Object.keys(progress).length;
    const percentage = Math.round((completedLessons / totalLessons) * 100);
    
    // Обновление прогресс-бара
    document.querySelector('.progress-fill').style.width = `${percentage}%`;
    document.querySelector('.progress-percentage').textContent = `${percentage}%`;
    
    // Обновление статистики
    document.querySelector('.completed-count').textContent = completedLessons;
    document.querySelector('.total-count').textContent = totalLessons;
    document.querySelector('.remaining-count').textContent = totalLessons - completedLessons;
}

// Сброс прогресса
function resetProgress() {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
        localStorage.removeItem('courseProgress');
        updateUI();
    }
}

// Экспорт прогресса
function exportProgress() {
    const progress = loadProgress();
    const totalLessons = courseData.reduce((sum, section) => sum + section.lessons.length, 0);
    const completedLessons = Object.keys(progress).length;
    const percentage = Math.round((completedLessons / totalLessons) * 100);
    
    // Создание детального отчета
    let report = `Прогресс курса Cursor AI\n`;
    report += `========================\n\n`;
    report += `Общий прогресс: ${percentage}%\n`;
    report += `Пройдено уроков: ${completedLessons} из ${totalLessons}\n`;
    report += `Осталось уроков: ${totalLessons - completedLessons}\n\n`;
    
    courseData.forEach((section, sectionIndex) => {
        report += `\n${section.section}\n`;
        report += '-'.repeat(section.section.length) + '\n';
        
        section.lessons.forEach((lesson, lessonIndex) => {
            const lessonId = getLessonId(sectionIndex, lessonIndex);
            const isCompleted = progress[lessonId];
            const status = isCompleted ? '✓' : '○';
            report += `${status} Урок ${lessonIndex + 1}: ${lesson}\n`;
        });
    });
    
    // Добавление даты экспорта
    report += `\n\nДата экспорта: ${new Date().toLocaleString('ru-RU')}\n`;
    
    // Создание и скачивание файла
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cursor-course-progress-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}