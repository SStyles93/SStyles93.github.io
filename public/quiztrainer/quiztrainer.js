// @ts-nocheck
// Quiz Trainer Application
class QuizTrainer {
    constructor() {
        // Holds the original, full set of questions from the loaded file
        this.allQuestions = [];
        // Holds the active set of questions for the current quiz session (after randomization/slicing)
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.isAnswered = false;
        
        this.initializeEventListeners();
        this.fetchQuizFiles();
    }

    initializeEventListeners() {
        // Element references
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');
        const quizSelect = document.getElementById('quiz-select');
        
        // Event listeners
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        quizSelect.addEventListener('change', (e) => this.handleQuizSelect(e));
        
        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Quiz control events
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
        document.getElementById('upload-new').addEventListener('click', () => this.resetToSetup());
    }

    async fetchQuizFiles() {
        const select = document.getElementById('quiz-select');
        try {
            // IMPORTANT: This endpoint must be created on your server.
            // It should return a JSON array of strings, e.g., ["Quiz1.json", "Quiz2.json"]
            const response = await fetch('/api/quizzes'); 
            if (!response.ok) {
                throw new Error(`Network response was not ok (status: ${response.status})`);
            }
            const files = await response.json();
            
            select.innerHTML = '<option value="">-- Select a quiz from the server --</option>';
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                // Display a cleaner name in the dropdown
                option.textContent = file.replace('.json', '').replace(/_/g, ' ');
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to fetch quiz files:', error);
            select.innerHTML = '<option value="">Could not load server quizzes</option>';
        }
    }

    async handleQuizSelect(e) {
        const fileName = e.target.value;
        if (!fileName) {
            document.getElementById('file-info').style.display = 'none';
            this.allQuestions = [];
            return;
        }

        try {
            // This assumes your quiz files are served from a public directory, e.g., '/quizzes/'
            const response = await fetch(`/quizzes/${fileName}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}`);
            }
            const jsonData = await response.json();
            this.validateAndLoadQuestions(jsonData, fileName);
            // Clear file input in case a file was previously selected
            document.getElementById('file-input').value = '';
        } catch (error) {
            this.showError(error.message);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('upload-area').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('upload-area').classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        document.getElementById('upload-area').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!file.name.toLowerCase().endsWith('.json')) {
            this.showError('Please select a valid JSON file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                this.validateAndLoadQuestions(jsonData, file.name);
                // Reset dropdown selection
                document.getElementById('quiz-select').value = '';
            } catch (error) {
                this.showError('Invalid JSON file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    validateAndLoadQuestions(data, fileName) {
        const isValid = Array.isArray(data) && data.length > 0 && 
                        data.every(q => q.question && q.choices && q.correct_answer && q.explanation);

        if (!isValid) {
            this.showError(`Invalid JSON format in "${fileName}". It must be an array of questions, each with 'question', 'choices', 'correct_answer', and 'explanation' properties.`);
            document.getElementById('file-info').style.display = 'none';
            this.allQuestions = [];
            return;
        }

        this.allQuestions = data;
        this.showFileInfo(fileName, data.length);
    }

    showFileInfo(fileName, questionCount) {
        document.getElementById('file-name').textContent = fileName;
        
        const questionAmountInput = document.getElementById('question-amount');
        questionAmountInput.max = questionCount;
        questionAmountInput.value = questionCount;
        
        document.getElementById('question-count').textContent = `/ ${questionCount}`;
        document.getElementById('file-info').style.display = 'flex';
    }

    prepareQuizQuestions() {
        let preparedQuestions = [...this.allQuestions];

        // 1. Randomize if checked
        if (document.getElementById('randomize-questions').checked) {
            // Fisher-Yates shuffle algorithm
            for (let i = preparedQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [preparedQuestions[i], preparedQuestions[j]] = [preparedQuestions[j], preparedQuestions[i]];
            }
        }

        // 2. Limit question count
        const questionAmountInput = document.getElementById('question-amount');
        const desiredCount = parseInt(questionAmountInput.value, 10);
        
        if (!isNaN(desiredCount) && desiredCount > 0 && desiredCount < preparedQuestions.length) {
            preparedQuestions = preparedQuestions.slice(0, desiredCount);
        }

        this.questions = preparedQuestions;
    }

    startQuiz() {
        if (this.allQuestions.length === 0) {
            this.showError("No quiz loaded. Please select or upload a quiz file.");
            return;
        }

        this.prepareQuizQuestions();

        if (this.questions.length === 0) {
            this.showError("The selected number of questions is invalid.");
            return;
        }

        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.isAnswered = false;

        document.getElementById('setup-section').style.display = 'none';
        document.getElementById('quiz-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';

        this.updateQuizInfo();
        this.displayQuestion();
    }

    updateQuizInfo() {
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.questions.length;
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        const attemptedCount = this.userAnswers.filter(answer => answer !== null).length;
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('attempted-questions').textContent = attemptedCount;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        
        document.getElementById('question-number').textContent = this.currentQuestionIndex + 1;
        
        const questionElement = document.getElementById('question-text');
        questionElement.innerHTML = this.formatQuestionText(question.question);
        Prism.highlightAllUnder(questionElement);
        
        this.displayChoices(question.choices, userAnswer, question.correct_answer);
        
        if (userAnswer !== null) {
            this.showFeedback(userAnswer === question.correct_answer, question.explanation);
            this.isAnswered = true;
        } else {
            this.hideFeedback();
            this.isAnswered = false;
        }
        
        this.updateNavigation();
    }

    formatQuestionText(text) {
        return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'plaintext';
            return `<pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    displayChoices(choices, userAnswer, correctAnswer) {
        const container = document.getElementById('choices-container');
        container.innerHTML = '';
        
        Object.entries(choices).forEach(([letter, text]) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice';
            choiceElement.dataset.choice = letter;
            
            if (userAnswer === letter) choiceElement.classList.add('selected');
            
            if (userAnswer !== null) {
                if (letter === correctAnswer) choiceElement.classList.add('correct');
                else if (letter === userAnswer) choiceElement.classList.add('incorrect');
            }
            
            choiceElement.innerHTML = `
                <div class="choice-letter">${letter}</div>
                <div class="choice-text">${this.escapeHtml(text)}</div>
            `;
            
            if (userAnswer === null) {
                choiceElement.addEventListener('click', () => this.selectAnswer(letter));
            }
            
            container.appendChild(choiceElement);
        });
    }

    selectAnswer(selectedChoice) {
        if (this.isAnswered) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedChoice === question.correct_answer;
        
        this.userAnswers[this.currentQuestionIndex] = selectedChoice;
        if (isCorrect) this.score++;
        
        this.displayChoices(question.choices, selectedChoice, question.correct_answer);
        this.showFeedback(isCorrect, question.explanation);
        
        this.isAnswered = true;
        this.updateQuizInfo();
        this.updateNavigation();
    }

    showFeedback(isCorrect, explanation) {
        const feedbackSection = document.getElementById('feedback-section');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackTitle = document.getElementById('feedback-title');
        const explanationElement = document.getElementById('explanation');
        
        feedbackSection.style.display = 'block';
        feedbackSection.className = `feedback-section ${isCorrect ? 'correct' : 'incorrect'}`;
        
        feedbackIcon.className = isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle';
        feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';
        explanationElement.textContent = explanation;
    }

    hideFeedback() {
        document.getElementById('feedback-section').style.display = 'none';
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.innerHTML = 'Finish Quiz <i class="fas fa-flag-checkered"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        }
        
        nextBtn.disabled = !this.isAnswered && this.userAnswers[this.currentQuestionIndex] === null;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateQuizInfo();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateQuizInfo();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        this.showResults();
    }

    showResults() {
        const totalQuestions = this.questions.length;
        const correctAnswers = this.score;
        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
        
        document.getElementById('final-score').textContent = percentage;
        document.getElementById('correct-count').textContent = correctAnswers;
        document.getElementById('total-count').textContent = totalQuestions;
        document.getElementById('accuracy').textContent = `${percentage}%`;
        
        this.animateScoreCircle(percentage);
    }

    animateScoreCircle(percentage) {
        const circle = document.querySelector('.score-circle');
        const degrees = (percentage / 100) * 360;
        
        let color1 = '#dc3545', color2 = '#e83e8c'; // Default to red
        if (percentage >= 80) {
            color1 = '#28a745'; color2 = '#20c997'; // Green
        } else if (percentage >= 50) {
            color1 = '#ffc107'; color2 = '#fd7e14'; // Yellow/Orange
        }
        
        circle.style.background = `conic-gradient(${color1} 0deg, ${color2} ${degrees}deg, #e9ecef ${degrees}deg, #e9ecef 360deg)`;
    }

    restartQuiz() {
        // This will re-use the same settings (randomization, question count)
        this.startQuiz();
    }

    resetToSetup() {
        document.getElementById('setup-section').style.display = 'block';
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('file-info').style.display = 'none';
        document.getElementById('file-input').value = '';
        document.getElementById('quiz-select').value = '';
        
        this.allQuestions = [];
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.isAnswered = false;
    }

    showError(message) {
        // A simple alert, but can be replaced with a more sophisticated modal/toast notification
        alert(`Error: ${message}`);
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizTrainer();
});

// Add global event listeners for better UX
document.addEventListener('keydown', (e) => {
    if (document.getElementById('quiz-section').style.display === 'block') {
        if (e.key === 'ArrowLeft' && !document.getElementById('prev-btn').disabled) {
            document.getElementById('prev-btn').click();
        } else if (e.key === 'ArrowRight' && !document.getElementById('next-btn').disabled) {
            document.getElementById('next-btn').click();
        } else if (['a', 'b', 'c', 'd', 'e'].includes(e.key.toLowerCase())) {
            const choiceElement = document.querySelector(`[data-choice="${e.key.toUpperCase()}"]`);
            if (choiceElement) {
                choiceElement.click();
            }
        }
    }
});

// Prevent accidental page refresh while a quiz is active
window.addEventListener('beforeunload', (e) => {
    if (document.getElementById('quiz-section').style.display === 'block') {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.';
    }
});
