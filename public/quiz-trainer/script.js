// @ts-nocheck
// Quiz Trainer Application
class QuizTrainer {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.isAnswered = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // File upload events
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');
        
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
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
        document.getElementById('upload-new').addEventListener('click', () => this.uploadNewFile());
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
            } catch (error) {
                this.showError('Invalid JSON file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    validateAndLoadQuestions(data, fileName) {
        // Validate JSON structure
        if (!Array.isArray(data)) {
            this.showError('JSON file must contain an array of questions.');
            return;
        }

        // Validate each question
        for (let i = 0; i < data.length; i++) {
            const question = data[i];
            if (!question.question || !question.choices || !question.correct_answer || !question.explanation) {
                this.showError(`Invalid question format at index ${i}. Each question must have: question, choices, correct_answer, and explanation.`);
                return;
            }
        }

        this.questions = data;
        this.showFileInfo(fileName, data.length);
    }

    showFileInfo(fileName, questionCount) {
        document.getElementById('file-name').textContent = fileName;
        document.getElementById('question-count').textContent = `${questionCount} questions`;
        document.getElementById('file-info').style.display = 'flex';
    }

    showError(message) {
        alert(message); // In a production app, you'd want a better error display
    }

    startQuiz() {
        if (this.questions.length === 0) return;

        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.isAnswered = false;

        document.getElementById('upload-section').style.display = 'none';
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
        
        // Update score
        const attemptedCount = this.userAnswers.filter(answer => answer !== null).length;
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('attempted-questions').textContent = attemptedCount;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        
        document.getElementById('question-number').textContent = this.currentQuestionIndex + 1;
        
        // Display question text with code highlighting
        const questionElement = document.getElementById('question-text');
        questionElement.innerHTML = this.formatQuestionText(question.question);
        
        // Highlight code blocks
        Prism.highlightAllUnder(questionElement);
        
        // Display choices
        this.displayChoices(question.choices, userAnswer, question.correct_answer);
        
        // Show feedback if question was already answered
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
        // Convert code blocks to proper HTML with syntax highlighting
        return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'cpp';
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
            
            // Add selection state
            if (userAnswer === letter) {
                choiceElement.classList.add('selected');
            }
            
            // Add correct/incorrect state if answered
            if (userAnswer !== null) {
                if (letter === correctAnswer) {
                    choiceElement.classList.add('correct');
                } else if (letter === userAnswer && letter !== correctAnswer) {
                    choiceElement.classList.add('incorrect');
                }
            }
            
            choiceElement.innerHTML = `
                <div class="choice-letter">${letter}</div>
                <div class="choice-text">${text}</div>
            `;
            
            // Add click event only if not answered
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
        
        // Update user answers
        this.userAnswers[this.currentQuestionIndex] = selectedChoice;
        
        // Update score
        if (isCorrect) {
            this.score++;
        }
        
        // Update choice display
        this.displayChoices(question.choices, selectedChoice, question.correct_answer);
        
        // Show feedback
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
        
        if (isCorrect) {
            feedbackIcon.className = 'fas fa-check-circle';
            feedbackTitle.textContent = 'Correct!';
        } else {
            feedbackIcon.className = 'fas fa-times-circle';
            feedbackTitle.textContent = 'Incorrect';
        }
        
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
            nextBtn.textContent = 'Finish Quiz';
            nextBtn.innerHTML = 'Finish Quiz <i class="fas fa-flag-checkered"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        }
        
        // Enable next button if question is answered or if we're navigating back
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
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
        
        document.getElementById('final-score').textContent = percentage;
        document.getElementById('correct-count').textContent = correctAnswers;
        document.getElementById('total-count').textContent = totalQuestions;
        document.getElementById('accuracy').textContent = `${percentage}%`;
        
        // Animate score circle
        this.animateScoreCircle(percentage);
    }

    animateScoreCircle(percentage) {
        const circle = document.querySelector('.score-circle');
        const degrees = (percentage / 100) * 360;
        
        // Create gradient based on score
        let color1, color2;
        if (percentage >= 80) {
            color1 = '#28a745';
            color2 = '#20c997';
        } else if (percentage >= 60) {
            color1 = '#ffc107';
            color2 = '#fd7e14';
        } else {
            color1 = '#dc3545';
            color2 = '#e83e8c';
        }
        
        circle.style.background = `conic-gradient(${color1} 0deg, ${color2} ${degrees}deg, #e9ecef ${degrees}deg, #e9ecef 360deg)`;
    }

    restartQuiz() {
        this.startQuiz();
    }

    uploadNewFile() {
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('file-info').style.display = 'none';
        document.getElementById('file-input').value = '';
        
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.isAnswered = false;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizTrainer();
});

// Add some utility functions for better UX
document.addEventListener('keydown', (e) => {
    // Allow keyboard navigation
    if (document.getElementById('quiz-section').style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            document.getElementById('prev-btn').click();
        } else if (e.key === 'ArrowRight') {
            document.getElementById('next-btn').click();
        } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
            const choice = e.key.toUpperCase();
            const choiceElement = document.querySelector(`[data-choice="${choice}"]`);
            if (choiceElement && !choiceElement.classList.contains('selected')) {
                choiceElement.click();
            }
        }
    }
});

// Prevent accidental page refresh during quiz
window.addEventListener('beforeunload', (e) => {
    if (document.getElementById('quiz-section').style.display === 'block') {
        e.preventDefault();
        e.returnValue = '';
    }
});