$(document).ready(() => {
   const containerDiv = document.querySelector('.container');
   const testDiv = document.querySelector('.container .test');
   const headingEl = document.querySelector('.heading');
   const question = document.querySelector('.container .test .question');
   const answers = document.querySelectorAll('.container .test .answer');
   const startButton = document.querySelector('.container .start-test');
   const nextQuestionBtn = document.querySelector('.next-btn');
   const list = document.querySelector('.answer-list');
   const answerCounter = document.querySelector('.answer-counter')
   const resultEl = document.createElement('span');
   const finishTestDiv = document.querySelector('.finish-test');
   const scoreEl = document.querySelector('.score');
   const startAgainBtn = document.querySelector('.start-again');
   const loader = document.querySelector('.scaling-dots');
   let dataNumber = -1;
   let correctAnswerCounter = 0;
   let dataHolder;
   containerDiv.style.display = 'none';


   async function loadQuestion() {
      const APIUrl = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple';
      const result = await fetch(`${APIUrl}`);
      const data = await result.json();
      dataHolder = data.results;

      loader.style.display = 'none';
      $(containerDiv).fadeIn(500);
      startButton.addEventListener('click', () => {
         displayTest(data.results);
         $(startButton).fadeOut(0);
      });
   }

   function displayTest(data) {
      dataNumber++;
      const arrayLength = data.length;
      let apiQuestion;
      let apiCorrectAnswer;
      if (dataNumber !== arrayLength) {
         apiQuestion = data[dataNumber].question;
         apiCorrectAnswer = data[dataNumber].correct_answer;
      }

      $(testDiv).fadeIn(1000);
      answerCounter.innerText = `Correct Answers: ${correctAnswerCounter}/${arrayLength}`;

      if (dataNumber !== arrayLength) {
         answers.forEach(item => {
            item.removeAttribute('style');
            item.disabled = false;
            resultEl.innerHTML = '';
         });
         const questionToAsk = replaceEntities(apiQuestion);
         const correctAnswer = replaceEntities(apiCorrectAnswer);
         const incorrectAnswers = data[dataNumber].incorrect_answers;
         const apiAnswers = [correctAnswer, replaceEntities(incorrectAnswers[0]),replaceEntities(incorrectAnswers[1]), replaceEntities(incorrectAnswers[2])];
         const shuffledArray = apiAnswers.sort((a, b) => 0.5 - Math.random());
         const [a, b, c, d] = shuffledArray;
         const answersArray = [a, b, c, d];
         question.innerText = questionToAsk;
         answers.forEach((item, index) => {
            item.innerText = answersArray[index];
         });

         answers.forEach(item => {
            item.addEventListener('click', (e) => {
               const currentAnswer = e.target.innerText;
               displayAnswer(answers, correctAnswer, currentAnswer, arrayLength);
               disableButtons(answers);
            });
         });

         function disableButtons(answers) {
            answers.forEach(item => item.disabled = true);
         }
         if (dataNumber === arrayLength - 1) {
            nextQuestionBtn.innerText = 'Finish';
            nextQuestionBtn.addEventListener('click', () => {
               $(testDiv).fadeOut(0);
               headingEl.innerText = 'You have finished the Computer Science Quiz!';
               headingEl.style.width = '80%';
               $(finishTestDiv).fadeIn(500);
               scoreEl.innerText += ` ${correctAnswerCounter}`;
            });
         }
      }
   }

   function displayAnswer(answers, correctAnswer, currentAnswer, arrayLength) {
      resultEl.style.display = 'none';
      if (currentAnswer == correctAnswer) {
         correctAnswerCounter++;
         answerCounter.innerText = `Correct Answers: ${correctAnswerCounter}/${arrayLength}`;
         resultEl.innerText = 'Correct!';
         resultEl.style.color = 'green';
         list.appendChild(resultEl);
      }
      else {
         resultEl.innerText = 'Incorrect!';
         resultEl.style.color = 'red';
         list.appendChild(resultEl);
      };
      $(resultEl).fadeIn(300);
      answers.forEach(item => {
         if (item.innerText == correctAnswer) item.style.backgroundColor = 'green';
         else item.style.backgroundColor = 'red';
      });
   }
   nextQuestionBtn.addEventListener('click', () => {
      displayTest(dataHolder);
   });
   startAgainBtn.addEventListener('click', () => startAgain());
   function startAgain() {
      window.location.reload();
   }

   function replaceEntities(str) {
      return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#039;/g, "'").replace(/&quot;/g, '"');
   }

   loadQuestion();
});