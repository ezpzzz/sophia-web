<template>
    <beautiful-chat
      :participants="participants"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="false"
      :showFile="false"
      :showEdition="false"
      :showDeletion="false"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="true"
      :showCloseButton="false"
      :displayMessageList="!showHomeScreen && messageList.length > 0"
      :disableUserListToggle="true"
      :showLauncher="true"
    >
      <!-- Custom header slot -->
      <template v-slot:header>
        <div class="custom-header">
          <div class="header-left">
            <button v-if="messageList.length > 0" 
                    class="back-button" 
                    @click="goToHome" 
                    title="Back to Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <span class="header-title">You & Sophia</span>
          </div>
          <div class="header-buttons">
            <button class="download-button" @click="downloadTranscript" title="Download Chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button class="reset-button" @click="resetSession" title="Start New Chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button class="close-button" @click="closeChat" title="Close Chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </template>
  
      <!-- Message list slot - restructured for clarity -->
      <template v-slot:messageList>
        <div class="chat-container">
          <!-- Home Screen -->
          <div v-if="showHomeScreen" class="chat-home-screen">
            <div class="home-content-wrapper">
              <h1 class="home-greeting">Hi!</h1>
              <h2 class="home-subtitle">How can we help?</h2>
              
              <!-- Previous Chats Section -->
              <div v-if="previousChats.length > 0" class="previous-chats-section">
                <h3 class="previous-chats-title">Recent Conversations</h3>
                <div class="chat-list">
                  <div v-for="chat in previousChats" 
                       :key="chat.sessionId" 
                       class="chat-item"
                       @click="loadChat(chat)">
                    <div class="chat-item-content">
                      <div class="chat-preview">{{ getChatPreview(chat) }}</div>
                      <div class="chat-date">{{ formatDate(chat.timestamp) }}</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </div>
              </div>
  
              <button class="start-chat-button" @click="startNewChat">
                Send us a message
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
  
          <!-- Active Chat Messages -->
          <div v-else class="conversation-container">
            <div class="messages-wrapper">
              <div v-for="(message, idx) in messageList" 
                   :key="idx" 
                   class="message-item"
                   :class="message.author === 'me' ? 'user-message' : 'bot-message'">
                <div class="message-content">
                  <div v-if="message.author !== 'me'" class="bot-avatar">
                    <img :src="participants[0].imageUrl" alt="Sophia's Avatar" />
                  </div>
                  <div class="message-bubble">
                    {{ message.data.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
  
      <!-- User input field -->
      <template v-slot:userInput>
        <template v-if="isChatOpen && !showHomeScreen">
          <div class="user-input">
            <!-- Your user input field code here -->
          </div>
        </template>
      </template>
    </beautiful-chat>
  </template>
  
  <script>
  const API_URL = import.meta.env.PROD 
    ? 'https://n8n.sophosic.ai/webhook/e60704a9-52c1-47eb-9037-2344d6b56c21/chat'
    : '/api/webhook/e60704a9-52c1-47eb-9037-2344d6b56c21/chat'
  
  export default {
    name: 'ChatWidget', 
    
    data() {
      return {
        sessionId: '',
        participants: [
          {
            id: 'bot',
            name: 'Sophia',
            imageUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="15" fill="#5423E7"/>
                <text x="15" y="20" 
                  font-family="Arial, sans-serif" 
                  font-size="16"
                  fill="white" 
                  text-anchor="middle"
                  style="pointer-events: none;">S</text>
              </svg>
            `)}`
          }
        ],
        messageList: [],
        newMessagesCount: 0,
        isChatOpen: false,
        showTypingIndicator: '',
        colors: {
          header: {
            bg: '#1E1B3C',
            text: '#ffffff'
          },
          launcher: {
            bg: '#5423E7'
          },
          messageList: {
            bg: '#F8F9FE'
          },
          sentMessage: {
            bg: '#5423E7',
            text: '#ffffff'
          },
          receivedMessage: {
            bg: '#FFFFFF',
            text: '#1E1B3C'
          },
          userInput: {
            bg: '#F8F9FE',
            text: '#1E1B3C'
          }
        },
        showHomeScreen: true,
        previousChats: [], // Array to store previous chat sessions
      }
    },
  
    created() {
      // 1) Load session once (sessionId), and load previous chats
      this.loadSession();
      this.loadPreviousChats();
    },
  
    async mounted() {
      // 2) Remove the second loadSession() call here
      //    We only do the initial API fetch if we *already* have messages
      if (import.meta.env.PROD && this.messageList.length > 0) {
        try {
          const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'omit'
          });
          if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  
          const rawText = await response.text();
          console.log('Initial raw response:', rawText);
  
          const welcomeMessage = this.extractMessage(rawText);
          if (welcomeMessage && welcomeMessage !== "I'm here to help! How can I assist you today?") {
            this.addMessage({
              author: 'bot',
              type: 'text',
              data: { text: welcomeMessage }
            });
          }
        } catch (error) {
          console.error('Error loading initial message:', error);
        }
      }
    },
  
    methods: {
      loadSession() {
        // Only load or create sessionId
        const savedSessionId = localStorage.getItem('chatSessionId');
        if (savedSessionId) {
          this.sessionId = savedSessionId;
        } else {
          this.createNewSession();
        }
      },
  
      createNewSession() {
        this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatSessionId', this.sessionId);
      },
  
      resetSession() {
        // Use our archive method instead of duplicating logic
        this.archiveSession();
  
        // Clear and start fresh
        this.messageList = [];
        this.createNewSession();
  
        this.addMessage({
          author: 'bot',
          type: 'text',
          data: { 
            text: "👋 Hi! I'm Sophia, an AI assistant representing Valley Connection. How can I help you today?"
          }
        });
      },
  
      async onMessageWasSent(message) {
        // Add user message to list
        this.addMessage({
          author: 'me',
          type: 'text',
          data: { text: message.data.text }
        })
  
        // Show typing indicator as string
        this.showTypingIndicator = 'bot'
  
        try {
          console.log('Sending message:', message.data.text);
          const requestBody = JSON.stringify({
            message: message.data.text,
            type: 'user_message',
            timestamp: new Date().toISOString(),
            metadata: {
              sessionId: this.sessionId
            }
          });
          console.log('Request body:', requestBody);
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'omit',
            body: requestBody
          });
  
          console.log('Response status:', response.status);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          let data;
          const rawText = await response.text();
          console.log('Raw response:', rawText);
          
          try {
            data = JSON.parse(rawText);
          } catch (e) {
            // If response is not JSON, use raw text
            data = rawText;
          }
          
          const botMessage = this.extractMessage(data)
          console.log('Extracted botMessage:', botMessage);
          if (botMessage) {
            this.addMessage({
              author: 'bot',
              type: 'text',
              data: { text: botMessage }
            })
          } else {
            console.log('botMessage is empty or undefined');
          }
  
        } catch (error) {
          console.error('Error in onMessageWasSent:', error);
          this.addMessage({
            author: 'bot',
            type: 'text',
            data: { text: "I'm sorry, I'm having trouble connecting to my services right now. Please try again in a moment." }
          });
        } finally {
          this.showTypingIndicator = '';
        }
      },
  
      extractMessage(data) {
        console.log('Extracting message from:', data)
        
        // Handle empty or null response
        if (!data) {
          console.log('Data is null or undefined in extractMessage');
          return "I'm here to help! How can I assist you today?"
        }
  
        // Handle string responses
        if (typeof data === 'string') {
          console.log('Data is a string:', data);
          // Remove HTML tags if present
          return data.replace(/<[^>]*>/g, '').trim();
        }
  
        // Handle object responses from n8n
        if (typeof data === 'object') {
          // Check for n8n specific response format first
          if (data.pairedItem) {
            console.log('Data is an n8n pairedItem object:', data);
            const extracted = data.pairedItem?.item?.json?.output ||
                              data.pairedItem?.item?.json?.message ||
                              "I'm here to help! How can I assist you today?";
            console.log('Extracted message from pairedItem:', extracted);
            return extracted;
          }
          
          // Fall back to checking other common fields
          console.log('Data is a generic object:', data);
          const extracted = data?.output ||
                            data?.message ||
                            data?.text ||
                            data?.response ||
                            data?.chatOutput ||
                            "I'm here to help! How can I assist you today?";
          console.log('Extracted message from generic object:', extracted);
          return extracted;
        }
  
        console.log('Data is of an unknown type:', data);
        return "I'm here to help! How can I assist you today?"
      },
  
      addMessage(message) {
        this.messageList = [...this.messageList, message];
        // Archive after each new message so we don’t lose the conversation
        this.archiveSession();
      },
  
      openChat() {
        this.isChatOpen = true;
        this.showHomeScreen = true;
        this.newMessagesCount = 0;
        // Load previous chats when opening the widget
        this.loadPreviousChats();
      },
  
      closeChat() {
        this.archiveSession();
        this.isChatOpen = false;
      },
  
      handleOnType() {
        console.log('User is typing...')
      },
  
      downloadTranscript() {
        // Format the chat transcript
        const transcript = this.messageList.map(msg => {
          const author = msg.author === 'me' ? 'You' : 'Sophia';
          const timestamp = new Date().toLocaleString(); // You might want to store actual timestamps in your messages
          return `${timestamp} - ${author}: ${msg.data.text}`;
        }).join('\n\n');
  
        // Create the file content with a header
        const fileContent = `Chat Transcript with Sophia\n` +
          `Generated on: ${new Date().toLocaleString()}\n` +
          `Session ID: ${this.sessionId}\n\n` +
          `${transcript}`;
  
        // Create blob and download link
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-transcript-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
  
      startNewChat() {
        this.showHomeScreen = false;
        this.messageList = [];
        this.createNewSession();
        
        // Add initial welcome message
        this.addMessage({
          author: 'bot',
          type: 'text',
          data: { 
            text: "👋 Hi! I'm Sophia, an AI assistant representing Valley Connection. How can I help you today?"
          }
        });
      },
  
      goToHome() {
        // 1) Archive the current conversation so it's saved in previousChats
        this.archiveSession();
  
        // 2) Reload previousChats from localStorage to ensure we see the updated list
        this.loadPreviousChats();
  
        // 3) Clear the current message list so the “home screen” condition is triggered
        this.messageList = [];
  
        // 4) Keep the widget open; the home screen shows when messageList is empty
        this.isChatOpen = true;
      },
  
      loadPreviousChats() {
        const savedChats = localStorage.getItem('previousChats');
        if (savedChats) {
          try {
            this.previousChats = JSON.parse(savedChats);
            // Sort chats by timestamp, most recent first
            this.previousChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            console.log('Loaded recent conversations:', this.previousChats);
          } catch (e) {
            console.error('Error loading recent conversations:', e);
            this.previousChats = [];
          }
        }
      },
  
      savePreviousChats() {
        // Ensure we only keep the 10 most recent conversations
        this.previousChats = this.previousChats
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 10);
        
        localStorage.setItem('previousChats', JSON.stringify(this.previousChats));
        console.log('Saved recent conversations:', this.previousChats);
      },
  
      loadChat(chat) {
        this.showHomeScreen = false;
        console.log('Loading chat:', chat);
        this.sessionId = chat.sessionId;
        this.messageList = [...chat.messages]; // Create a new array to ensure reactivity
        this.isChatOpen = true;
      },
  
      getChatPreview(chat) {
        // Get the last non-welcome message or default preview
        const messages = chat.messages || [];
        const lastMessage = messages
          .filter(msg => !msg.data.text.includes("👋 Hi! I'm Sophia"))
          .pop();
        
        const previewText = lastMessage?.data?.text || 'Chat history';
        return previewText.length > 50 ? previewText.substring(0, 50) + '...' : previewText;
      },
  
      formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
          return 'Today';
        } else if (diffInDays === 1) {
          return 'Yesterday';
        } else if (diffInDays < 7) {
          return date.toLocaleDateString('en-US', { weekday: 'long' });
        } else {
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
          });
        }
      },
  
      archiveSession() {
        // Store the current chat if there's at least one user message
        // (Adjust the condition as desired: > 0, > 1, etc.)
        if (this.messageList.length > 0) {
          const currentChat = {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            messages: [...this.messageList],
          };
  
          // Remove any old copy of this session
          this.previousChats = this.previousChats.filter(chat => chat.sessionId !== this.sessionId);
  
          // Then add it again
          this.previousChats.unshift(currentChat);
  
          // Trim to last 10 sessions and save
          this.savePreviousChats();
        }
      },
    }
  }
  </script>
  
  <style scoped>
  /* Import Inter font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');
  
  /* Import Work Sans font - add this at the top of style section */
  @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap');
  
  /* The widget will be positioned at bottom-right with 20px margin */
  :deep(.sc-launcher) {
    right: 20px !important;
    bottom: 20px !important;
    width: 60px !important;
    height: 60px !important;
    overflow: hidden !important;
    position: fixed !important;
    border-radius: 50% !important;
  }
  
  /* Center the chat icon in the launcher button */
  :deep(.sc-launcher .sc-open-icon),
  :deep(.sc-launcher .sc-closed-icon) {
    position: absolute !important;
    inset: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* Ensure the SVG icon itself is centered and properly sized */
  :deep(.sc-launcher svg) {
    width: 25px !important;
    height: 25px !important;
    position: static !important;
  }
  
  /* Style the launcher tooltip */
  :deep(.sc-launcher-tooltip) {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 15px !important;
    line-height: 1.5 !important;
    padding: 12px 16px !important;
    border-radius: 8px !important;
    max-width: 280px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    background-color: #FFFFFF !important;
    color: #1E1B3C !important;
    margin-right: 12px !important;
  }
  
  /* Add a nice arrow to the tooltip */
  :deep(.sc-launcher-tooltip::after) {
    content: '' !important;
    position: absolute !important;
    right: -8px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    border-width: 8px 0 8px 8px !important;
    border-style: solid !important;
    border-color: transparent transparent transparent #FFFFFF !important;
  }
  
  /* Style the header title */
  :deep(.sc-header--title) {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 16px !important;
    font-weight: 600 !important;
  }
  
  /* Optional: Style the chat window header */
  :deep(.sc-header) {
    min-height: 60px !important;
    padding: 16px 20px !important;
    pointer-events: none !important;
  }
  
  /* Add these new font-family rules */
  :deep(.sc-message--text) {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 15px !important;
    line-height: 1.5 !important;
  }
  
  :deep(.sc-message-input) {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 15px !important;
  }
  
  /* Add these new styles for the custom header */
  :deep(.custom-header) {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    padding: 0 !important;
    background-color: #1E1B3C !important;
    color: #ffffff !important;
    min-height: 60px !important;
    box-sizing: border-box !important;
    pointer-events: none !important;
    user-select: none !important;
  }
  
  :deep(.header-left) {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    pointer-events: auto !important;
    padding-left: 0 !important;
    flex: 1 !important;
  }
  
  :deep(.header-buttons) {
    display: flex !important;
    gap: 12px !important;
    align-items: center !important;
    pointer-events: auto !important;
    padding-right: 0 !important;
    margin-left: auto !important;
  }
  
  :deep(.header-title) {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    white-space: nowrap !important;
    pointer-events: none !important;
    user-select: none !important;
    margin-left: 0 !important;
  }
  
  /* Update the header buttons container */
  :deep(.header-buttons) {
    display: flex !important;
    gap: 4px !important;
    align-items: center !important;
    pointer-events: auto !important;
    position: relative !important;
    z-index: 1 !important;
    margin-right: 4px !important;
  }
  
  /* Standardize both buttons */
  :deep(.reset-button),
  :deep(.sc-header--close-button) {
    background: none !important;
    border: none !important;
    padding: 4px !important;
    cursor: pointer !important;
    color: #ffffff !important;
    border-radius: 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background-color 0.2s ease !important;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    min-height: 28px !important;
  }
  
  /* Standardize hover effects */
  :deep(.reset-button:hover),
  :deep(.sc-header--close-button:hover) {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  /* Standardize SVG icons */
  :deep(.reset-button svg),
  :deep(.sc-header--close-button svg) {
    width: 20px !important;
    height: 20px !important;
    stroke: currentColor !important;
    fill: none !important;
    display: block !important;  /* Ensure proper display */
  }
  
  /* Add specific styles for close button container */
  :deep(.sc-header--close-button-container) {
    width: 36px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* Hide all avatar tooltips */
  :deep(.sc-message--avatar) {
    pointer-events: auto !important;
  }
  
  :deep(.sc-message--avatar::before),
  :deep(.sc-message--avatar::after) {
    display: none !important;
  }
  
  /* Hide any potential tooltip containers */
  :deep([data-tooltip]),
  :deep([data-tooltip]::before),
  :deep([data-tooltip]::after) {
    display: none !important;
    content: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }
  
  /* Style message containers and avatar positioning */
  :deep(.sc-message) {
    position: relative !important;
    margin-bottom: 16px !important;
  }
  
  :deep(.sc-message--content.received) {
    position: relative !important;  /* Make this a positioning context */
    margin-left: 40px !important;  /* Space for avatar */
    padding-bottom: 0 !important;  /* Remove any bottom padding */
  }
  
  /* Update the avatar hiding and styling rules */
  :deep(.sc-message--avatar) {
    position: absolute !important;
    left: -40px !important;
    bottom: 0 !important;
    width: 30px !important;
    height: 30px !important;
    margin: 0 !important;
    border-radius: 50% !important;
    background-color: #5423E7 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  :deep(.sc-message--avatar img) {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
  }
  
  /* Remove tooltip-related styles that might interfere */
  :deep(.sc-message--avatar.v-popper--has-tooltip) {
    pointer-events: none !important;
  }
  
  /* Hide tooltips */
  :deep(.v-popper__popper) {
    display: none !important;
  }
  
  /* Remove any ::after pseudo-elements */
  :deep(.sc-message--avatar::after) {
    display: none !important;
  }
  
  /* Style for the close button */
  :deep(.close-button) {
    background: none !important;
    border: none !important;
    padding: 4px !important;
    cursor: pointer !important;
    color: #ffffff !important;
    border-radius: 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background-color 0.2s ease !important;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    min-height: 28px !important;
  }
  
  :deep(.close-button:hover) {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  :deep(.close-button svg) {
    width: 20px !important;
    height: 20px !important;
    stroke: currentColor !important;
    fill: none !important;
    display: block !important;
  }
  
  :deep(.download-button) {
    background: none !important;
    border: none !important;
    padding: 4px !important;
    cursor: pointer !important;
    color: #ffffff !important;
    border-radius: 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background-color 0.2s ease !important;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    min-height: 28px !important;
  }
  
  :deep(.download-button:hover) {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  :deep(.download-button svg) {
    width: 20px !important;
    height: 20px !important;
    stroke: currentColor !important;
    fill: none !important;
    display: block !important;
  }
  
  /* Add/update these styles */
  
  /* Set a max-width for the chat window */
  :deep(.sc-chat-window) {
    max-width: 380px !important;
    width: 100% !important;
    right: 20px !important;
  }
  
  /* Ensure all default header buttons are disabled */
  :deep(.sc-header--close-button),
  :deep(.sc-header--team-name),
  :deep(.sc-header--title) {
    pointer-events: none !important;
    user-select: none !important;
  }
  
  /* Home Screen Styles */
  :deep(.chat-home-screen) {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    height: calc(100vh - 120px) !important;
    max-height: 600px !important;
    background-color: #F8F9FE !important;
    padding: 0 !important;
  }
  
  :deep(.home-content-wrapper) {
    padding: 24px !important;
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
  }
  
  :deep(.home-greeting) {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 32px !important;
    font-weight: 600 !important;
    color: #1E1B3C !important;
    margin: 0 0 8px 0 !important;
  }
  
  :deep(.home-subtitle) {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 24px !important;
    font-weight: 500 !important;
    color: #1E1B3C !important;
    margin: 0 0 32px 0 !important;
  }
  
  :deep(.start-chat-button) {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    background-color: #FFFFFF !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 16px 20px !important;
    width: 100% !important;
    font-family: 'Work Sans', sans-serif !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    color: #1E1B3C !important;
    cursor: pointer !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s ease !important;
  }
  
  :deep(.start-chat-button:hover) {
    background-color: #F8F9FE !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }
  
  :deep(.start-chat-button svg) {
    width: 20px !important;
    height: 20px !important;
    stroke: currentColor !important;
    margin-left: 8px !important;
  }
  
  :deep(.back-button) {
    background: none !important;
    border: none !important;
    padding: 4px !important;
    cursor: pointer !important;
    color: #ffffff !important;
    border-radius: 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background-color 0.2s ease !important;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    min-height: 28px !important;
  }
  
  :deep(.back-button:hover) {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  :deep(.back-button svg) {
    width: 20px !important;
    height: 20px !important;
    stroke: currentColor !important;
    fill: none !important;
    display: block !important;
  }
  
  :deep(.chat-window-opened) {
    padding-left: 8px !important; /* Adjust padding to bring elements closer */
    padding-right: 8px !important;
  }
  
  /* Add these new styles */
  .previous-chats-section {
    margin: 24px 0;
    width: 100%;
  }
  
  .previous-chats-title {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #1E1B3C !important;
    margin-bottom: 12px !important;
  }
  
  .chat-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .chat-item {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .chat-item:hover {
    background: #F8F9FE;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .chat-item-content {
    flex: 1;
    margin-right: 12px;
  }
  
  .chat-preview {
    font-family: 'Work Sans', sans-serif;
    font-size: 14px;
    color: #1E1B3C;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .chat-date {
    font-family: 'Work Sans', sans-serif;
    font-size: 12px;
    color: #666;
  }
  
  /* Ensure the start chat button is below the chat list */
  .start-chat-button {
    margin-top: 16px;
  }
  
  /* Add/update these styles */
  .conversation-container {
    padding: 16px;
    height: 100%;
    overflow-y: auto;
    background-color: #F8F9FE;
  }
  
  .messages-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .message-item {
    display: flex;
    flex-direction: column;
    max-width: 80%;
  }
  
  .message-content {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  
  .user-message {
    align-self: flex-end;
  }
  
  .bot-message {
    align-self: flex-start;
  }
  
  .message-bubble {
    padding: 12px 16px;
    border-radius: 12px;
    font-family: 'Work Sans', sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .user-message .message-bubble {
    background-color: #5423E7;
    color: #FFFFFF;
    border-top-right-radius: 4px;
  }
  
  .bot-message .message-bubble {
    background-color: #FFFFFF;
    color: #1E1B3C;
    border-top-left-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .bot-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .bot-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Ensure user messages don't have the avatar space */
  .user-message .message-content {
    justify-content: flex-end;
  }
  
  .chat-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .chat-home-screen {
    flex: 1;
    background: #F8F9FE;
    overflow-y: auto;
  }
  
  .previous-chats-section {
    margin: 24px 0;
    padding: 0 24px;
  }
  
  .chat-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
  
  .chat-item {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .chat-item:hover {
    background: #F8F9FE;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* ... rest of your styles ... */
  </style>
  