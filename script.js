// Function to load the knowledge base from JSON file
async function loadKnowledgeBase() {
  try {
    const response = await fetch('knowledgebase.json');
    if (!response.ok) {
      throw new Error('Failed to fetch knowledge base.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Function to get the chatbot response based on question matching
function getChatbotResponse(question, knowledgeBase) {
  const lowerCaseQuestion = question.toLowerCase();

  // Loop through the knowledge base to find the best matching question
  let bestMatchIndex = -1;
  let bestMatchScore = 0;
  const threshold = 0.55; // Set the threshold for matching scores

  for (let i = 0; i < knowledgeBase.length; i++) {
    const score = calculateSimilarity(lowerCaseQuestion, knowledgeBase[i].question.toLowerCase());
    if (score > threshold && score > bestMatchScore) {
      bestMatchScore = score;
      bestMatchIndex = i;
    }
  }

  // If a match is found, return the corresponding answer
  if (bestMatchIndex !== -1) {
    return knowledgeBase[bestMatchIndex].answer;
  } else {
    return "I'm sorry, I don't have an answer for that question.";
  }
}

// Function to calculate the similarity between two strings
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  const similarity = commonWords.length / Math.max(words1.length, words2.length);
  return similarity;
}

// Function to display chatbot response in the chatbox
function displayChatbotResponse(message) {
  const chatboxContent = document.getElementById('chatbox-message-content');
  const chatMessage = document.createElement('div');
  chatMessage.classList.add('chatbox-message-item', 'received');
  chatMessage.innerHTML = `
    <span class="chatbox-message-item-text">${message}</span>
    <span class="chatbox-message-item-time">${addZero(new Date().getHours())}:${addZero(new Date().getMinutes())}</span>
  `;
  chatboxContent.appendChild(chatMessage);
  scrollBottom();
}
  

// Function to add a user message to the chatbox
function addUserMessage(message) {
  const chatboxContent = document.getElementById('chatbox-message-content');
  const chatMessage = document.createElement('div');
  chatMessage.classList.add('chatbox-message-item', 'sent');
  chatMessage.innerHTML = `
    <span class="chatbox-message-item-text">${message}</span>
    <span class="chatbox-message-item-time">${addZero(new Date().getHours())}:${addZero(new Date().getMinutes())}</span>
  `;
  chatboxContent.appendChild(chatMessage);
  scrollBottom();

// Declare conversation history array
let conversationHistory = [];

// Save user input to conversation history
  conversationHistory.push({ user: message, bot: "" });
  saveConversationHistory();
}


// Function to add zero before single-digit numbers
function addZero(num) {
  return num < 10 ? '0' + num : num;
}

function scrollBottom() {
  const chatboxMessages = document.getElementById('chatbox-message-content');
  chatboxMessages.scrollTo(0, chatboxMessages.scrollHeight);
}

// Function to handle user input and get chatbot responses
async function handleUserInput() {
  const chatboxForm = document.querySelector('.chatbox-message-form');
  const chatboxInput = document.querySelector('.chatbox-message-input');

  const knowledgeBase = await loadKnowledgeBase();

  chatboxForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const userQuestion = chatboxInput.value.trim();
    if (userQuestion !== '') {
      addUserMessage(userQuestion);
      const chatbotResponse = getChatbotResponse(userQuestion, knowledgeBase);
      displayChatbotResponse(chatbotResponse);
      chatboxInput.value = '';
    }
  });
}


// Function to update the last bot message in conversation history 

function updateBotMessage(message)
 { if (conversationHistory.length > 0)
  { conversationHistory[conversationHistory.length - 1].bot = message; } } 

// Function to save conversation history to JSON file 

function saveConversationHistory() { try { 

const jsonContent = JSON.stringify(conversationHistory, null, 2); 
const blob = new Blob([jsonContent], { 

type: 'application/json' }); 
const url = URL.createObjectURL(blob); 
const a = document.createElement('a'); 
a.href = url; a.download ='conversation_history.json';

 a.click(); URL.revokeObjectURL(url); } 


catch (error) { 
console.error(error); } 
  }
  
  
// Wait for the DOM to load before handling user input
document.addEventListener('DOMContentLoaded', function () {
  handleUserInput();

  // Toggle Chatbox
  const chatboxToggle = document.querySelector('.chatbox-toggle');
  chatboxToggle.addEventListener('click', function () {
    const chatboxMessageWrapper = document.querySelector('.chatbox-message-wrapper');
    chatboxMessageWrapper.classList.toggle('show');
  });

  // DROPDOWN TOGGLE
  const dropdownToggle = document.querySelector('.chatbox-message-dropdown-toggle');
  const dropdownMenu = document.querySelector('.chatbox-message-dropdown-menu');
  dropdownToggle.addEventListener('click', function () {
    dropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', function (e) {
    if (!e.target.matches('.chatbox-message-dropdown, .chatbox-message-dropdown *')) {
      dropdownMenu.classList.remove('show');
    }
  });

  // Auto-scroll to bottom
  scrollBottom();
});
