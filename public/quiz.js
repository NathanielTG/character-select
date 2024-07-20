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
        classScores[role.role_id] = { name: role.role_name, score: 0 };
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
        return [];
      }
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      questionContainer.innerHTML = 'Failed to load questions';
      return [];
    }
  };

  const displayQuestion = (questions, index) => {
    if (index < questions.length) {
      const question = questions[index];
      if (question) {
        questionContainer.innerHTML = question.question_text;
      } else {
        console.error('Question is undefined:', index);
        questionContainer.innerHTML = 'Error loading question';
      }
    } else {
      displayResults();
    }
  };

  const displayResults = async () => {
    // Fetch scores from the backend
    let scores = [];
    try {
      const response = await fetch('/api/scores?gameId=1'); // Ensure this matches your game_id
      scores = await response.json();
      console.log('Fetched scores:', scores); // Debugging
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  
    // Calculate the highest-scoring role
    let highestScoringRole = '';
    let highestScore = -Infinity;
  
    let resultHTML = '<h3>Quiz completed! Your scores are:</h3><ul>';
  
    for (const roleId in classScores) {
      const score = scores.find(score => score.role_id == roleId);
      const totalScore = score ? score.total_points : classScores[roleId].score;
  
      if (totalScore > highestScore) {
        highestScore = totalScore;
        highestScoringRole = classScores[roleId].name;
      }
  
      resultHTML += `<li>${classScores[roleId].name}: ${totalScore}</li>`;
    }
  
    resultHTML += '</ul>';
    resultHTML += `<p>Your highest-scoring role is: ${highestScoringRole}.</p>`;
  
    questionContainer.innerHTML = resultHTML;
    agreeButton.style.display = 'none';
    disagreeButton.style.display = 'none';
    console.log('User Responses:', userResponses);
    console.log('Class Scores:', classScores);
  };
    
  // Initialize data and event listeners
  await fetchRoles();
  const questions = await fetchQuestions();
  if (questions.length > 0) {
    displayQuestion(questions, currentQuestionIndex);

    agreeButton.addEventListener('click', () => {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        userResponses.push({ question_id: currentQuestion.question_id, answer: 'Agree' });

        // Update class scores
        if (classScores[currentQuestion.role_id]) {
          classScores[currentQuestion.role_id].score += 1;
          // Update scores on the server
          updateScores(1, currentQuestion.role_id, classScores[currentQuestion.role_id].score); // Make sure gameId is correct
        }

        currentQuestionIndex++;
        displayQuestion(questions, currentQuestionIndex);
      } else {
        console.error('Current question is undefined:', currentQuestionIndex);
      }
    });

    disagreeButton.addEventListener('click', () => {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        userResponses.push({ question_id: currentQuestion.question_id, answer: 'Disagree' });

        // Update class scores
        if (classScores[currentQuestion.role_id]) {
          classScores[currentQuestion.role_id].score -= 1; // Assuming you want to subtract points for 'Disagree'
          // Update scores on the server
          updateScores(1, currentQuestion.role_id, classScores[currentQuestion.role_id].score); // Make sure gameId is correct
        }

        currentQuestionIndex++;
        displayQuestion(questions, currentQuestionIndex);
      } else {
        console.error('Current question is undefined:', currentQuestionIndex);
      }
    });
  }

  // Function to update scores on the server
  const updateScores = async (gameId, roleId, totalPoints) => {
    try {
      await fetch('/api/updateScores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, roleId, totalPoints })
      });
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };
});
