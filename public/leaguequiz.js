document.addEventListener('DOMContentLoaded', () => {
  const questionContainer = document.getElementById('question');
  const agreeButton = document.getElementById('agree');
  const disagreeButton = document.getElementById('disagree');
  const backButton = document.getElementById('back');
  let currentQuestionIndex = 0;
  let userResponses = [];
  let previousStates = [];

  let classScores = {
    1: { name: 'Tank', score: 0 },
    2: { name: 'Fighter', score: 0 },
    3: { name: 'Slayer', score: 0 },
    4: { name: 'Mage', score: 0 },
    5: { name: 'Marksman', score: 0 },
    6: { name: 'Controller', score: 0 },
  };

  const questions = [
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will gladly sacrifice a greater health pool and defensive capabilities, if it means that I can increase my damage potential.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
    {
      question_text: 'I will sacrifice power early if it means I get to be a stronger threat later.',
      role_scores: { 1: 2, 2: 3 } // role_id: score
    },
  ];

  const displayQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      questionContainer.innerHTML = currentQuestion.question_text;
    } else {
      displayResults();
    }
  };

  const updateScores = (roleScores, points) => {
    for (const [roleId, score] of Object.entries(roleScores)) {
      if (classScores[roleId]) {
        classScores[roleId].score += points * score;
      }
    }
  };

  const handleAnswer = (isAgree) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      previousStates.push({
        index: currentQuestionIndex,
        responses: [...userResponses],
        scores: { ...classScores }
      });

      userResponses.push({
        question_id: currentQuestion.question_id,
        answer: isAgree ? 'Agree' : 'Disagree'
      });

      const score = isAgree ? 1 : -1; // 1 point for agree, -1 point for disagree
      if (!isNaN(score)) {
        updateScores(currentQuestion.role_scores, score);
      } else {
        console.error(`Invalid score value: ${isAgree ? currentQuestion.agree_score : currentQuestion.disagree_score}`);
      }

      currentQuestionIndex++;
      displayQuestion();
    }
  };

  const handleBack = () => {
    if (previousStates.length > 0) {
      const lastState = previousStates.pop();
      currentQuestionIndex = lastState.index;
      userResponses = lastState.responses;
      classScores = lastState.scores;
      displayQuestion();
    }
  };

  const displayResults = () => {
    let highestScoringClass = '';
    let highestScore = -Infinity;

    for (const roleId in classScores) {
      const totalScore = classScores[roleId].score;
      if (totalScore > highestScore) {
        highestScore = totalScore;
        highestScoringClass = classScores[roleId].name;
      }
    }

    let resultHTML = '<h3>Quiz completed! Your scores are:</h3><ul>';
    for (const roleId in classScores) {
      resultHTML += `<li>${classScores[roleId].name}: ${classScores[roleId].score}</li>`;
    }
    resultHTML += '</ul>';
    resultHTML += `<p>Your highest-scoring role is: ${highestScoringClass}.</p>`;
    
    questionContainer.innerHTML = resultHTML;
    agreeButton.style.display = 'none';
    disagreeButton.style.display = 'none';
    backButton.style.display = 'none'; 
  };

  agreeButton.addEventListener('click', () => handleAnswer(true));
  disagreeButton.addEventListener('click', () => handleAnswer(false));
  backButton.addEventListener('click', handleBack);

  displayQuestion();
});
