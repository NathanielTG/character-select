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
    // Fetch scores from the backend
    let scores = [];
    try {
      const response = await fetch('/api/scores?gameId=1'); // Ensure this matches your game_id
      scores = await response.json();
      console.log('Fetched scores:', scores); // Debugging
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  
    // Determine the highest-scoring class
    let highestScoringClass = '';
    let highestScore = -Infinity;
  
    for (const roleId in classScores) {
      const score = scores.find(score => score.role_id == roleId);
      const totalScore = score ? score.total_points : classScores[roleId].score;
  
      if (totalScore > highestScore) {
        highestScore = totalScore;
        highestScoringClass = classScores[roleId].name;
      }
    }
  
    // Subclasses information
    const subclasses = {
      Mage: [
        { name: 'Battlemage', image: '/images/battlemage.webp', description: 'A powerful mage who excels in close combat.' },
        { name: 'Artillery', image: '/images/artillery.webp', description: 'A mage who deals damage from a distance.' },
        { name: 'Burst', image: '/images/burst.webp', description: 'A mage with high burst damage.' }
      ],
      Marksman: [
        { name: 'Marksman', image: '/images/marksman.webp', description: 'A ranged fighter with high damage output.' }
      ],
      Fighter: [
        { name: 'Diver', image: '/images/diver.webp', description: 'A fighter who excels at diving into the enemy backline.' },
        { name: 'Juggernaut', image: '/images/juggernaut.webp', description: 'A fighter with high durability and damage.' }
      ],
      Tank: [
        { name: 'Vanguard', image: '/images/vanguard.webp', description: 'A tank with a focus on front-line defense.' },
        { name: 'Warden', image: '/images/warden.webp', description: 'A tank with high crowd control abilities.' }
      ],
      Controller: [
        { name: 'Catcher', image: '/images/catcher.webp', description: 'A controller with abilities to catch and hold enemies.' },
        { name: 'Enchanter', image: '/images/enchanter.webp', description: 'A controller who can enchant allies and debuff enemies.' }
      ],
      Slayer: [
        { name: 'Assassin', image: '/images/assassin.webp', description: 'A slayer who excels at taking down high-value targets.' },
        { name: 'Skirmisher', image: '/images/skirmisher.webp', description: 'A slayer with high mobility and versatility.' }
      ]
    };
  
    // Get the subclasses for the highest-scoring class
    const highestScoringClassSubclasses = subclasses[highestScoringClass] || [];
  
    // Generate HTML for the subclasses
    let subclassHTML = '<h3>Subclasses for your highest-scoring class:</h3><div class="subclass-container">';
  
    highestScoringClassSubclasses.forEach(subclass => {
      subclassHTML += `
        <div class="subclass">
          <img src="${subclass.image}" alt="${subclass.name}">
          <h4>${subclass.name}</h4>
          <p>${subclass.description}</p>
        </div>
      `;
    });
  
    subclassHTML += '</div>';
  
    // Display results
    let resultHTML = '<h3>Quiz completed! Your scores are:</h3><ul>';
  
    for (const roleId in classScores) {
      const score = scores.find(score => score.role_id == roleId);
      const totalScore = score ? score.total_points : classScores[roleId].score;
  
      resultHTML += `<li>${classScores[roleId].name}: ${totalScore}</li>`;
    }
  
    resultHTML += '</ul>';
    resultHTML += `<p>Your highest-scoring role is: ${highestScoringClass}.</p>`;
    resultHTML += subclassHTML;
  
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
