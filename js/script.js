let currentQuestionIndex = 0;
let userAnswers = [];
const totalQuestions = 10;
const correctAnswers = ['A', 'B', 'C', 'D', 'A', 'A', 'B', 'C', 'D', 'A']; 
let timerExpired = false; 
let questions = [];

const fetchQuestions = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    return data.slice(0, totalQuestions);
};

const startQuiz = async () => {
    questions = await fetchQuestions();
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
        displayQuestion(questions[currentQuestionIndex], questions);
        

        if (currentQuestionIndex === totalQuestions - 1) {
            document.getElementById('next-button').innerText = "Sonuçları Gör";
        } else {
            document.getElementById('next-button').innerText = "Sonraki Soru";
        }
    } else {
        displayResults();
    }
};

const displayQuestion = (question, questions) => {
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    
    document.getElementById('question').innerText = `Soru ${currentQuestionIndex + 1}: ${capitalizeFirstLetter(question.title)}`;

    const bodyText = question.body.split('\n').map(line => line.trim()).filter(line => line);
    const options = ['A', 'B', 'C', 'D'].map((option, index) => {
        const button = document.createElement('button');
        button.innerText = `${option}: ${capitalizeFirstLetter(bodyText[index] || 'Şık Yok')}`;
        button.disabled = true;
        button.style.cursor = "not-allowed"
        button.onclick = () => handleAnswer(option);
        return button;
    });

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    options.forEach(button => optionsContainer.appendChild(button));

    startTimer(30, options);
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

let timer;

const startTimer = (duration, options) => {
    let timeLeft = duration;
    document.getElementById('timer').innerText = `Kalan Süre: ${timeLeft} saniye`;
    timerExpired = false; 

    clearInterval(timer); 
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Kalan Süre: ${timeLeft} saniye`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerExpired = true; 
            handleAnswer(null); 
        }
    }, 1000);

    setTimeout(() => {
        options.forEach(button => button.disabled = false); 
        options.forEach(button => button.style.cursor = "pointer"); 
    }, 10000); 
};

const handleAnswer = (answer) => {
    const correctAnswer = correctAnswers[currentQuestionIndex];

    if (questions[currentQuestionIndex]) {
        userAnswers[currentQuestionIndex] = {
            question: questions[currentQuestionIndex].title,
            answer: answer || 'Cevap Verilmedi',
            isCorrect: answer === correctAnswer
        };
    } else {
        console.error("Soru mevcut değil", currentQuestionIndex);
        return;
    }

    clearInterval(timer);
    showNextButton();
};

const showNextButton = () => {
    document.getElementById('next-button').style.display = 'block';
    document.querySelectorAll('#options button').forEach(button => button.disabled = true);
    document.querySelectorAll('#options button').forEach(button => button.style.cursor = "not-allowed");
};

document.getElementById('start-quiz-button').onclick = () => {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    startQuiz();
};

document.getElementById('next-button').onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        startQuiz();
    } else {
        displayResults();
    }
};

const displayResults = () => {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<h2>Tebrikler, testi tamamladınız. Quiz sonuçlarınız aşağıdadır.</h2><table><tr><th>Soru</th><th>Cevap</th><th>Doğru Cevap</th></tr>' + 
        Array.from({ length: totalQuestions }).map((_, index) => {
            const answer = userAnswers[index] || {
                question: questions[index]?.title || `Soru ${index + 1}`, 
                answer: 'Cevap Verilmedi',
                isCorrect: false
            };

            return `
                <tr>
                    <td>${answer.question}</td>
                    <td>${answer.answer}</td>
                    <td>${correctAnswers[index]}</td>
                </tr>
            `;
        }).join('') + 
        '</table>';
    resultsContainer.style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
};

startQuiz();
