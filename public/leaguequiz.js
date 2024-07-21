document.addEventListener('DOMContentLoaded', () => {
  const questionContainer = document.getElementById('question');
  const optionsContainer = document.getElementById('options');
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
      role_scores: { 5: 3, 4: 2 } // Marksman: +3, Mage: +2
    },
    {
      question_text: 'I will gladly sacrifice a greater health pool and defensive capabilities, if it means that I can increase my damage potential.',
      role_scores: { 5: 3, 4: 3 } // Marksman: +3, Mage: +3
    },
    {
      question_text: 'I prefer to continually widdle down my opponents with powerful attacks rather than skillfully burst them down with spell usage.',
      role_scores: { 5: 3 } // Marksman: +3
    },
    {
      question_text: 'I enjoy farming up minions and acquiring gold, so that I may purchase items and become stronger as the game progresses.',
      role_scores: { 5: 3, 4: 2 } // Marksman: +3, Mage: +2
    },
    {
      question_text: 'I enjoy being an uncatchable threat, always looking for a great opportunity to strike.',
      role_scores: { 3: 3 } // Slayer: +3
    },
    {
      question_text: 'I enjoy having mobility options that allow me to lock down my opponents.',
      role_scores: { 3: 3 } // Slayer: +3
    },
    {
      question_text: 'I prefer being a problem for my opposition up close rather than from afar.',
      role_scores: { 2: 3, 1: 3, 3: 3 } // Fighter: +3, Tank: +3, Slayer: +3
    },
    {
      question_text: 'I enjoy using stealth, or other forms of evasive maneuvers to avoid my opponents’ retaliation.',
      role_scores: { 3: 3 } // Slayer: +3
    },
    {
      question_text: 'I like the idea of having a kit that centers around powerful spellcasting rather than powerful attacks.',
      role_scores: { 4: 3 } // Mage: +3
    },
    {
      question_text: 'I enjoy having the ability to absorb attacks and dish them out two-fold to my opposition.',
      role_scores: { 2: 3 } // Fighter: +3
    },
    {
      question_text: 'I’m ok with sacrificing mobility options if it means I can hold my own when the time calls for it.',
      role_scores: { 2: 3, 1: 2 } // Fighter: +3, Tank: +2
    },
    {
      question_text: 'I enjoy blitzing my enemies with mobility and aggression and forcing them to deal with the problem I propose.',
      role_scores: { 2: 3, 1: 2 } // Fighter: +3, Tank: +2
    },
    {
      question_text: 'I like to stand as the pillar of strength for my team, leading the charge, and not backing down until one team is left standing.',
      role_scores: { 1: 3, 2: 2 } // Tank: +3, Fighter: +2
    },
    {
      question_text: 'I like the feeling of being unstoppable.',
      role_scores: { 1: 3, 2: 2 } // Tank: +3, Fighter: +2
    },
    {
      question_text: 'Sacrificing damage for defense capabilities is not an issue for me.',
      role_scores: { 1: 3, 2: 2 } // Tank: +3, Fighter: +2
    },
    {
      question_text: 'I like to inflict debilitating effects to multiple enemies at once.',
      role_scores: { 1: 3, 4: 2, 6: 2 } // Tank: +3, Mage: +2, Controller: +2
    },
    {
      question_text: 'I get satisfaction out of saving my teammates from death.',
      role_scores: { 6: 3 } // Controller: +3
    },
    {
      question_text: 'Being the center of attention has never been a priority for me.',
      role_scores: { 6: 3 } // Controller: +3
    },
    {
      question_text: 'I would much rather have the tools at my disposal to escape from a predicament.',
      role_scores: { 6: 3 } // Controller: +3
    },
    {
      question_text: 'I enjoy having AoE abilities in order to damage or effect multiple champions at once.',
      role_scores: { 4: 3, 1: 3, 6: 2 } // Mage: +3, Tank: +3, Controller: +2
    }
  ];

  const tieBreakerQuestions = {
    1: 'Being durable and unkillable is more important than anything else.',
    2: 'I like to have a good mix of damage and tankiness, being in the center of the action.',
    3: 'I like to be able to quickly and effectively neutralize my target, and escape without a hitch.',
    4: 'I like to wield magical spells to inflict massive amounts of damage and harmful crowd control effects.',
    5: 'I do not mind farming minions and gold so that I can become a DPS threat in the later stages of the game.',
    6: 'I prefer to be the "parent" of the team, giving the rest of my team both offensive and defensive supporting capabilities.'
  };

  function logCurrentScores(message) {
    console.log(message || 'Current Scores:');
    for (const roleId in classScores) {
      console.log(`${classScores[roleId].name}: ${classScores[roleId].score}`);
    }
    console.log(''); // Empty line for readability
  }

  function updateScores(roleScores, points) {
    console.log('Updating scores...');
    for (const [roleId, score] of Object.entries(roleScores)) {
      if (classScores[roleId]) {
        classScores[roleId].score += points * score;
      }
    }
    logCurrentScores(); // Log scores every time they're updated
  }

  function displayTieBreakerQuestions(tiedRoles) {
    questionContainer.innerHTML = 'Select your preference:';
    optionsContainer.innerHTML = '';
    
    tiedRoles.forEach(roleId => {
      const button = document.createElement('button');
      button.textContent = tieBreakerQuestions[roleId];
      button.addEventListener('click', () => handleTiebreakerAnswer(roleId));
      optionsContainer.appendChild(button);
    });

    agreeButton.style.display = 'none';
    disagreeButton.style.display = 'none';
    backButton.style.display = 'none';
  }

  const handleAnswer = (isAgree) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      // Save the current state before making changes
      previousStates.push({
        index: currentQuestionIndex,
        responses: [...userResponses],
        scores: JSON.parse(JSON.stringify(classScores)), // Deep copy
      });

      userResponses.push({
        question_id: currentQuestion.question_id,
        answer: isAgree ? 'Agree' : 'Disagree'
      });

      const score = isAgree ? 1 : -1; // 1 point for agree, -1 point for disagree
      updateScores(currentQuestion.role_scores, score);

      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        displayQuestion();
      } else {
        // No more main questions, proceed to results or tie-breaker
        const tiedRoles = getHighestScoringRoles();
        if (tiedRoles.length > 1) {
          displayTieBreakerQuestions(tiedRoles);
        } else {
          displayResults();
        }
      }
    }
  };

  function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      questionContainer.innerHTML = currentQuestion.question_text;
      optionsContainer.innerHTML = ''; // Clear previous options

      // Show or hide the back button based on the current question index
      backButton.style.display = currentQuestionIndex === 0 ? 'none' : 'inline';
    }
  }

  const handleBack = () => {
    if (previousStates.length > 0) {
      const lastState = previousStates.pop();
      currentQuestionIndex = lastState.index;
      userResponses = lastState.responses;
      classScores = lastState.scores; // Restore scores

      console.log('Undoing last action...');
      logCurrentScores('Scores after undo:');

      displayQuestion();
    }
  };

  const displayResults = () => {
    let highestScoringRoles = getHighestScoringRoles();

    let resultHTML = '<h3>Quiz completed! Your scores are:</h3><ul>';
    for (const roleId in classScores) {
      resultHTML += `<li>${classScores[roleId].name}: ${classScores[roleId].score}</li>`;
    }
    resultHTML += '</ul>';

    if (highestScoringRoles.length === 1) {
      resultHTML += `<p>Your highest-scoring role is: ${classScores[highestScoringRoles[0]].name}.</p>`;
    } else {
      resultHTML += '<p>There was a tie between the following roles. The tiebreaker questions helped to determine your final role.</p>';
    }

    questionContainer.innerHTML = resultHTML;
    optionsContainer.innerHTML = ''; // Clear tiebreaker options
    agreeButton.style.display = 'none';
    disagreeButton.style.display = 'none';
    backButton.style.display = 'none';
  };

  function getHighestScoringRoles() {
    let highestScoringRoles = [];
    let highestScore = -Infinity;

    for (const roleId in classScores) {
      const totalScore = classScores[roleId].score;
      if (totalScore > highestScore) {
        highestScore = totalScore;
        highestScoringRoles = [roleId];
      } else if (totalScore === highestScore) {
        highestScoringRoles.push(roleId);
      }
    }

    return highestScoringRoles;
  }

  function handleTiebreakerAnswer(roleId) {
    classScores[roleId].score += 3;

    // Display results or next steps
    displayResults();
  }

  agreeButton.addEventListener('click', () => handleAnswer(true));
  disagreeButton.addEventListener('click', () => handleAnswer(false));
  backButton.addEventListener('click', handleBack);

  displayQuestion();
});
