document.addEventListener('DOMContentLoaded', async () => {
  const questionContainer = document.getElementById('question');
  const agreeButton = document.getElementById('agree');
  const disagreeButton = document.getElementById('disagree');
  let currentQuestionIndex = 0;
  let userResponses = [];
  
  // Initialize class scores
  let classScores = {};

  const classSubclasses = {
    "Mage": ["Battlemage", "Artillery", "Burst"],
    "Marksman": ["Marksman"],
    "Fighter": ["Diver", "Juggernaut"],
    "Tank": ["Vanguard", "Warden"],
    "Controller": ["Catcher", "Enchanter"],
    "Slayer": ["Assassin", "Skirmisher"]
  };

  const subclassImages = {
    "Battlemage": "path/to/battlemage.jpg",
    "Artillery": "path/to/artillery.jpg",
    "Burst": "path/to/burst.jpg",
    "Marksman": "path/to/marksman.jpg",
    "Diver": "path/to/diver.jpg",
    "Juggernaut": "path/to/juggernaut.jpg",
    "Vanguard": "path/to/vanguard.jpg",
    "Warden": "path/to/warden.jpg",
    "Catcher": "path/to/catcher.jpg",
    "Enchanter": "path/to/enchanter.jpg",
    "Assassin": "path/to/assassin.jpg",
    "Skirmisher": "path/to/skirmisher.jpg"
  };

  const subclassDescriptions = {
    "Battlemage": "Description of Battlemage",
    "Artillery": "Description of Artillery",
    "Burst": "Description of Burst",
    "Marksman": "Description of Marksman",
    "Diver": "Description of Diver",
    "Juggernaut": "Description of Juggernaut",
    "Vanguard": "Description of Vanguard",
    "Warden": "Description of Warden",
    "Catcher": "Description of Catcher",
    "Enchanter": "Description of Enchanter",
    "Assassin": "Description of Assassin",
    "Skirmisher": "Description of Skirmisher"
  };

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
      const response = await fetch('/api/questions?game=1'); // Ensure this matches your game_id
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
    // Calculate the highest-scoring role
    let highestScoringRole = '';
    let highestScore = -Infinity;
  
    for (const roleId in classScores) {
      const score = classScores[roleId].score;
      if (score > highestScore) {
        highestScore = score;
        highestScoringRole = classScores[roleId].name;
      }
    }

    // Display the subclasses for the highest-scoring role
    const subclasses = classSubclasses[highestScoringRole] || [];
    let resultHTML = `<h3>Quiz completed! Your highest-scoring role is: ${highestScoringRole}</h3><ul>`;
  
    subclasses.forEach(subclass => {
      resultHTML += `
        <li>
          <img src="${subclassImages[subclass]}" alt="${subclass}">
          <p>${subclassDescriptions[subclass]}</p>
        </li>
      `;
    });
    resultHTML += '</ul>';
  
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
        }

        currentQuestionIndex++;
        displayQuestion(questions, currentQuestionIndex);
      } else {
        console.error('Current question is undefined:', currentQuestionIndex);
      }
    });
  }
});
