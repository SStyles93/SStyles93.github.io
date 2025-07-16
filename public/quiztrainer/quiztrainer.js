// @ts-nocheck
class QuizTrainer {
    constructor() {
        this.allQuestions = [];
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.isAnswered = false;
        this.selectedChoices = [];
        this.currentChoicesMap = {};
    }

    bindEventListeners() {
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('quiz-select').addEventListener('change', (e) => this.handleQuizSelect(e));
        
        const uploadArea = document.getElementById('upload-area');
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
        
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz(false));
        document.getElementById('submit-answer-btn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
        document.getElementById('upload-new').addEventListener('click', () => this.resetToSetup());
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async fetchQuizFiles() {
        const select = document.getElementById('quiz-select');
        try {
            const response = await fetch('/api/quizzes');
            if (!response.ok) throw new Error(`Network response was not ok`);
            const files = await response.json();
            
            select.innerHTML = '<option value="">-- Select a quiz from the server --</option>';
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
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
        document.getElementById('file-info').style.display = 'none';
        this.allQuestions = [];
        if (!fileName) return;

        try {
            const response = await fetch(`/quizzes/${fileName}`);
            if (!response.ok) throw new Error(`Failed to load ${fileName}`);
            const jsonData = await response.json();
            this.validateAndLoadQuestions(jsonData, fileName);
            document.getElementById('file-input').value = '';
        } catch (error) {
            this.showError(error.message);
        }
    }

    handleDragOver(e) { e.preventDefault(); document.getElementById('upload-area').classList.add('dragover'); }
    handleDragLeave(e) { e.preventDefault(); document.getElementById('upload-area').classList.remove('dragover'); }

    handleFileDrop(e) {
        e.preventDefault();
        document.getElementById('upload-area').classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) this.processFile(e.dataTransfer.files[0]);
    }

    handleFileSelect(e) { if (e.target.files.length > 0) this.processFile(e.target.files[0]); }

    processFile(file) {
        if (!file.name.toLowerCase().endsWith('.json')) return this.showError('Please select a valid JSON file.');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                this.validateAndLoadQuestions(jsonData, file.name);
                document.getElementById('quiz-select').value = '';
            } catch (error) {
                this.showError('Invalid JSON file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    validateAndLoadQuestions(data, fileName) {
        const isValid = Array.isArray(data) && data.length > 0 && data.every(q => q.question && q.choices && q.correct_answer && q.explanation);
        if (!isValid) return this.showError(`Invalid JSON format in "${fileName}".`);
        this.allQuestions = data;
        this.showFileInfo(fileName, data.length);
    }

    showFileInfo(fileName, count) {
        document.getElementById('file-name').textContent = fileName;
        const amountInput = document.getElementById('question-amount');
        amountInput.max = count;
        amountInput.value = count;
        document.getElementById('question-count').textContent = `/ ${count}`;
        document.getElementById('file-info').style.display = 'flex';
    }

    prepareQuizQuestions() {
        let prepared = [...this.allQuestions];
        if (document.getElementById('randomize-questions').checked) {
            // MODIFIED: Use the new robust shuffle function
            this.shuffleArray(prepared);
        }
        const amount = parseInt(document.getElementById('question-amount').value, 10);
        if (!isNaN(amount) && amount > 0 && amount < prepared.length) {
            prepared = prepared.slice(0, amount);
        }
        this.questions = prepared;
    }

    startQuiz(isRestart = false) {
        if (this.allQuestions.length === 0) return this.showError("No quiz loaded.");
        
        if (!isRestart) {
            this.prepareQuizQuestions();
        }

        if (this.questions.length === 0) return this.showError("Invalid number of questions.");

        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;

        document.getElementById('setup-section').style.display = 'none';
        document.getElementById('contribution-section').style.display = 'none';
        document.getElementById('quiz-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';

        this.displayQuestion();
    }

    displayQuestion() {
        this.selectedChoices = [];
        this.isAnswered = false;
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];

        document.getElementById('question-number').textContent = this.currentQuestionIndex + 1;
        
        const isMultiChoice = Array.isArray(question.correct_answer);
        document.getElementById('question-type-info').textContent = isMultiChoice ? "(Select all that apply)" : "(Select one answer)";
        
        const questionElement = document.getElementById('question-text');
        questionElement.innerHTML = this.formatQuestionText(question.question);
        Prism.highlightAllUnder(questionElement);
        
        this.displayAndMapChoices(question, userAnswer);
        
        if (userAnswer !== null) {
            this.isAnswered = true;
            const correctAnswers = this.getRemappedCorrectAnswers();
            const isCorrect = this.validateAnswer(userAnswer, correctAnswers);
            this.showFeedback(isCorrect, question.explanation);
        } else {
            this.hideFeedback();
        }
        
        this.updateQuizInfo();
        this.updateNavigation();
    }

    displayAndMapChoices(question, userAnswer) {
        const { choices } = question;
        const container = document.getElementById('choices-container');
        container.innerHTML = '';

        let originalKeys = Object.keys(choices);
        this.shuffleArray(originalKeys);

        this.currentChoicesMap = {};
        originalKeys.forEach((originalKey, index) => {
            const newKey = String.fromCharCode(65 + index);
            this.currentChoicesMap[newKey] = {
                originalKey: originalKey,
                text: choices[originalKey]
            };
        });

        const correctAnswers = this.getRemappedCorrectAnswers();
        const isMultiChoice = correctAnswers.length > 1;

        Object.entries(this.currentChoicesMap).forEach(([newKey, choiceData]) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice';
            choiceElement.dataset.choice = newKey;

            if (userAnswer !== null) {
                const isCorrectChoice = correctAnswers.includes(newKey);
                const wasSelected = userAnswer.includes(newKey);

                if (isCorrectChoice) choiceElement.classList.add('correct');
                if (wasSelected && !isCorrectChoice) choiceElement.classList.add('incorrect');
                if (wasSelected) choiceElement.classList.add('selected');
            }
            
            const indicatorType = isMultiChoice ? 'checkbox' : 'letter';
            const indicatorContent = isMultiChoice ? '<i class="fas fa-check"></i>' : newKey;
            
            choiceElement.innerHTML = `
                <div class="choice-indicator ${indicatorType}">${indicatorContent}</div>
                <div class="choice-text">${this.escapeHtml(choiceData.text)}</div>
            `;
            
            if (userAnswer === null) {
                choiceElement.addEventListener('click', () => this.handleChoiceClick(newKey, isMultiChoice));
            }
            
            container.appendChild(choiceElement);
        });
    }

    getRemappedCorrectAnswers() {
        const originalCorrect = this.questions[this.currentQuestionIndex].correct_answer;
        const correctAnswers = Array.isArray(originalCorrect) ? originalCorrect : [originalCorrect];
        
        const remappedCorrect = [];
        Object.entries(this.currentChoicesMap).forEach(([newKey, choiceData]) => {
            if (correctAnswers.includes(choiceData.originalKey)) {
                remappedCorrect.push(newKey);
            }
        });
        return remappedCorrect;
    }

    handleChoiceClick(selectedChoice, isMultiChoice) {
        if (this.isAnswered) return;

        if (isMultiChoice) {
            const choiceElement = document.querySelector(`[data-choice="${selectedChoice}"]`);
            const index = this.selectedChoices.indexOf(selectedChoice);
            if (index > -1) {
                this.selectedChoices.splice(index, 1);
                choiceElement.classList.remove('selected');
            } else {
                this.selectedChoices.push(selectedChoice);
                choiceElement.classList.add('selected');
            }
            document.getElementById('submit-answer-btn').disabled = this.selectedChoices.length === 0;
        } else {
            this.selectedChoices = [selectedChoice];
            this.submitAnswer();
        }
    }

    submitAnswer() {
        if (this.isAnswered || this.selectedChoices.length === 0) return;

        const userSelection = [...this.selectedChoices].sort();
        this.userAnswers[this.currentQuestionIndex] = userSelection;
        
        const correctAnswers = this.getRemappedCorrectAnswers();
        const isCorrect = this.validateAnswer(userSelection, correctAnswers);
        if (isCorrect) this.score++;
        
        this.isAnswered = true;
        this.displayAndMapChoices(this.questions[this.currentQuestionIndex], userSelection);
        this.showFeedback(isCorrect, this.questions[this.currentQuestionIndex].explanation);
        this.updateQuizInfo();
        this.updateNavigation();
    }

    validateAnswer(userSelection, correctAnswers) {
        const sortedUserSelection = [...userSelection].sort();
        const sortedCorrectAnswers = [...correctAnswers].sort();

        return sortedUserSelection.length === sortedCorrectAnswers.length && sortedUserSelection.every((value, index) => value === sortedCorrectAnswers[index]);
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

    updateNavigation() {
        const correctAnswers = this.getRemappedCorrectAnswers();
        const isMultiChoice = correctAnswers.length > 1;
        const submitBtn = document.getElementById('submit-answer-btn');
        
        submitBtn.style.display = (isMultiChoice && !this.isAnswered) ? 'inline-block' : 'none';
        submitBtn.disabled = this.selectedChoices.length === 0;
        
        document.getElementById('prev-btn').disabled = this.currentQuestionIndex === 0;
        const nextBtn = document.getElementById('next-btn');
        nextBtn.disabled = !this.isAnswered;
        nextBtn.innerHTML = (this.currentQuestionIndex === this.questions.length - 1) ? 'Finish Quiz <i class="fas fa-flag-checkered"></i>' : 'Next <i class="fas fa-chevron-right"></i>';
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

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
        const total = this.questions.length;
        const percentage = total > 0 ? Math.round((this.score / total) * 100) : 0;
        document.getElementById('final-score').textContent = percentage;
        document.getElementById('correct-count').textContent = this.score;
        document.getElementById('total-count').textContent = total;
        document.getElementById('accuracy').textContent = `${percentage}%`;
        this.animateScoreCircle(percentage);
    }

    animateScoreCircle(percentage) {
        const circle = document.querySelector('.score-circle');
        const degrees = (percentage / 100) * 360;
        let color1 = '#dc3545', color2 = '#e83e8c';
        if (percentage >= 80) { color1 = '#28a745'; color2 = '#20c997'; }
        else if (percentage >= 50) { color1 = '#ffc107'; color2 = '#fd7e14'; }
        circle.style.background = `conic-gradient(${color1} 0deg, ${color2} ${degrees}deg, #e9ecef ${degrees}deg, #e9ecef 360deg)`;
    }

    restartQuiz() { 
        this.startQuiz(true); 
    }

    resetToSetup() {
        document.getElementById('setup-section').style.display = 'block';
        document.getElementById('contribution-section').style.display = 'block';
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('file-info').style.display = 'none';
        document.getElementById('file-input').value = '';
        document.getElementById('quiz-select').value = '';
        this.allQuestions = [];
        this.questions = [];
    }

    showError(message) { alert(`Error: ${message}`); }
    
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
}

// Initialize the application
new QuizTrainer();
