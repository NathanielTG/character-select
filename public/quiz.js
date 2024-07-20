document.addEventListener('DOMContentLoaded', async () => {
  const questionContainer = document.getElementById('question');
  const agreeButton = document.getElementById('agree');
  const disagreeButton = document.getElementById('disagree');
  let currentQuestionIndex = 0;
  let userResponses = [];

  // Initialize class scores
  let classScores = {};

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const roles = await response.json();
      roles.forEach(role => {
        classScores[role.id] = { name: role.role_name, score: 0 };
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      questionContainer.innerHTML = 'Failed to load roles';
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions?game=League of Legends');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const questions = await response.json();
      if (questions.length === 0) {
        questionContainer.innerHTML = 'No questions available';
        return;
      }
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      questionContainer.innerHTML = 'Failed to load questions';
    }
  };

  const displayQuestion = (questions, index) => {
    if (index < questions.length) {
      const question = questions[index];
      questionContainer.innerHTML = question.question_text;
    } else {
      displayResults();
    }
  };

  const displayResults = () => {
    // Calculate the highest-scoring role
    let highestScoringRole = '';
    let highestScore = 0;
    for (const roleId in classScores) {
      if (classScores[roleId].score > highestScore) {
        highestScore = classScores[roleId].score;
        highestScoringRole = classScores[roleId].name;
      }
    }

    questionContainer.innerHTML = `Quiz completed! Your highest-scoring role is: ${highestScoringRole}.`;
    agreeButton.style.display = 'none';
    disagreeButton.style.display = 'none';
    console.log('User Responses:', userResponses);
  };

  await fetchRoles();
  const questions = await fetchQuestions();
  if (questions) {
    displayQuestion(questions, currentQuestionIndex);

    agreeButton.addEventListener('click', () => {
      const currentQuestion = questions[currentQuestionIndex];
      userResponses.push({ question_id: currentQuestion.id, answer: 'Agree' });

      // Update class scores
      if (classScores[currentQuestion.role_id]) {
        classScores[currentQuestion.role_id].score += 1;
      }

      currentQuestionIndex++;
      displayQuestion(questions, currentQuestionIndex);
    });

    disagreeButton.addEventListener('click', () => {
      const currentQuestion = questions[currentQuestionIndex];
      userResponses.push({ question_id: currentQuestion.id, answer: 'Disagree' });

      currentQuestionIndex++;
      displayQuestion(questions, currentQuestionIndex);
    });
  }
});
