document.addEventListener('DOMContentLoaded', () => {
  const questionContainer = document.getElementById('question');
  const agreeButton = document.getElementById('agree');
  const disagreeButton = document.getElementById('disagree');
  let currentQuestionIndex = 0;
  let userResponses = [];
  
  // Initialize class scores
  let classScores = {
    1: { name: 'Mage', score: 0 },
    2: { name: 'Tank', score: 0 },
    3: { name: 'Marksman', score: 0 },
    4: { name: 'Fighter', score: 0 },
    5: { name: 'Slayer', score: 0 },
    6: { name: 'Controller', score: 0 },
  };

  const questions = [
    {
      question_text: 'Do you prefer ranged attacks?',
      role_id: 1,
      agree_score: 3,
      disagree_score: -3
    },
    {
      question_text: 'Do you enjoy tanking damage?',
      role_id: 2,
      agree_score: 3,
      disagree_score: -3
    }
    // Add more questions as needed
  ];

  const displayQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      questionContainer.innerHTML = currentQuestion.question_text;
    } else {
      displayResults();
    }
  };

  const updateScores = (roleId, points) => {
    if (classScores[roleId]) {
      classScores[roleId].score += points;
    }
  };

  const displayResults = () => {
    // Determine the highest-scoring class
    let highestScoringClass = '';
    let highestScore = -Infinity;

    for (const roleId in classScores) {
      const totalScore = classScores[roleId].score;
      if (totalScore > highestScore) {
        highestScore = totalScore;
        highestScoringClass = classScores[roleId].name;
      }
    }

    // Display results
    let resultHTML = '<h3>Quiz completed! Your scores are:</h3><ul>';
    for (const roleId in classScores) {
      resultHTML += `<li>${classScores[roleId].name}: ${classScores[roleId].score}</li>`;
    }
    resultHTML += '</ul>';
    resultHTML += `<p>Your highest-scoring role is: ${highestScoringClass}.</p>`;
    
    questionContainer.innerHTML = resultHTML;
    agreeButton.style.display = 'none';
    disagreeButton.style.display = 'none';
  };

  const handleAnswer = (isAgree) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      userResponses.push({ question_id: currentQuestion.question_id, answer: isAgree ? 'Agree' : 'Disagree' });

      const score = isAgree ? Number(currentQuestion.agree_score) : Number(currentQuestion.disagree_score);
      if (!isNaN(score)) {
        updateScores(currentQuestion.role_id, score);
      } else {
        console.error(`Invalid score value: ${isAgree ? currentQuestion.agree_score : currentQuestion.disagree_score}`);
      }

      currentQuestionIndex++;
      displayQuestion();
    }
  };

  agreeButton.addEventListener('click', () => handleAnswer(true));
  disagreeButton.addEventListener('click', () => handleAnswer(false));

  // Start the quiz
  displayQuestion();
});
