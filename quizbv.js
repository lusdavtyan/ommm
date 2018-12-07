let thissQuestion = 0;
let score = 0;
let total = questions.length;

let store = document.getElementById('storesQuiz');
let Questt = document.getElementById('question');
let optn1 = document.getElementById('optn1');
let optn2 = document.getElementById('optn2');
let optn3 = document.getElementById('optn3');
let optn4 = document.getElementById('optn4');
let nextBtn = document.getElementById('nextBtn');
let theResult = document.getElementById('result');

function loadQuestion(questionIndex) {
	let q = questions[questionIndex];
	Questt.textContent = (questionIndex + 1) + '. ' + q.question;
	optn1.textContent = q.option1;
	optn2.textContent = q.option2;
	optn3.textContent = q.option3;
	optn4.textContent = q.option4;
};

function loadNextQuestion () {
	let selectedOption = document.querySelector('input[type=radio]:checked');
	if(!selectedOption){
		alert('Please select one of the answers)');
		return;
	}
	let answer = selectedOption.value;
	if(questions[thissQuestion].answer == answer){
		score+=10;
	}
	selectedOption.checked = false;
	thissQuestion++;
	if(thissQuestion == total - 1){
		nextBtn.textContent = 'Finish';
	}
	if(thissQuestion == total){
		store.style.display = 'none';
		theResult.style.display = '';
		theResult.textContent = 'Your Score: ' + score;
		return;
	}
	loadQuestion(thissQuestion);
}

loadQuestion(thissQuestion);