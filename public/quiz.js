async function fetchQuestions(gameName) {
    try {
      const encodedGameName = encodeURIComponent(gameName);
      const response = await fetch(`/api/questions?game=${encodedGameName}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Fetched questions:', data); // Debug line to inspect data
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return []; // Return an empty array if there's an error
    }
  }
  
  // Display the questions on the page
  function displayQuestions(questions) {
    const questionsContainer = document.getElementById('questions-container');
    
    if (questions.length === 0) {
      questionsContainer.innerHTML = 'No questions available.';
      return;
    }
  
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.innerHTML = `
        <p>${index + 1}. ${question.question_text}</p>
        <button onclick="handleAnswer('agree')">Agree</button>
        <button onclick="handleAnswer('disagree')">Disagree</button>
      `;
      questionsContainer.appendChild(questionElement);
    });
  }
  
  // Handle answer selection
  async function handleAnswer(answer) {
    // Assuming questions array is globally available
    const currentQuestionIndex = parseInt(document.getElementById('current-question-index').value, 10);
    const nextQuestionIndex = currentQuestionIndex + 1;
  
    if (nextQuestionIndex >= questions.length) {
      alert('Quiz completed!');
      return;
    }
  
    // Display the next question
    displayQuestions(questions[nextQuestionIndex]);
  }
  
  // Initial setup
  document.addEventListener('DOMContentLoaded', async () => {
    const questions = await fetchQuestions('League of Legends');
    console.log('Questions to display:', questions); // Debug line to check questions array
    displayQuestions(questions);
  });
  