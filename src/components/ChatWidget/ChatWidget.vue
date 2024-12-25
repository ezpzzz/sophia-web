/* eslint-disable no-console */
<template>
  <div 
    class="chat-widget"
    :class="{ 'is-open': isChatOpen }"
  >
    <!-- Chat Launcher -->
    <div 
      v-if="!isChatOpen" 
      class="chat-launcher"
      @click="openChat"
    >
      <!-- Recent Chat Preview -->
      <div 
        v-if="previousChats.length > 0 && getMostRecentChatSummary() && !hidePreview"
        class="recent-chat-preview"
        @click.stop="resumeRecentChat"
      >
        <div class="preview-content">
          <div class="recent-chat-preview-text">
            {{ getMostRecentChatSummary() }}
          </div>
          <div class="recent-chat-preview-time">
            {{ formatDate(previousChats[0]?.timestamp) }}
          </div>
        </div>
        <button 
          class="preview-close-button" 
          @click.stop="hidePreview = true"
          title="Hide preview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div 
        class="launcher-button" 
        :class="`status-${systemStatus.status.toLowerCase()}`"
        :style="{ backgroundColor: currentTheme.launcher.background, boxShadow: `0 0 20px ${currentTheme.launcher.shadow}` }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
          <path d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1Z" />
        </svg>
      </div>
    </div>

    <!-- Chat Window -->
    <div v-else class="chat-window" :style="{ backgroundColor: currentTheme.messages.background }">
      <!-- Add a wrapper div for better mobile viewport handling -->
      <div class="chat-window-inner">
        <!-- Custom header slot -->
        <div class="custom-header" :style="{ backgroundColor: currentTheme.header.background, color: currentTheme.header.text }">
          <div class="header-left">
            <button class="back-button" 
                    v-if="!showHomeScreen"
                    @click="showStatusPage ? (showStatusPage = false, showHomeScreen = true) : (messageList.length > 0 ? goToHome() : null)" 
                    title="Back"
                    type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="header-title-container">
              <span class="header-title">
                {{ showStatusPage ? 'System Status' : (showHomeScreen ? 'Sophia' : 'You & Sophia') }}
              </span>
              <button v-if="!showStatusPage && showHomeScreen" 
                      class="header-status-button" 
                      @click="showSystemStatus">
                <div class="header-status-dot" :class="systemStatus.status.toLowerCase()"></div>
              </button>
            </div>
          </div>
          <div class="header-buttons">
            <button v-if="!showHomeScreen && !showStatusPage" 
                    class="download-button" 
                    @click="downloadTranscript" 
                    title="Download Chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button v-if="!showHomeScreen && !showStatusPage" 
                    class="reset-button" 
                    @click="resetSession" 
                    title="Start New Chat">
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

        <!-- Message list slot -->
        <div class="chat-container" :class="{ 'keyboard-open': isKeyboardOpen }">
          <!-- Home Screen -->
          <div v-if="showHomeScreen" class="chat-home-screen">
            <div class="home-content-wrapper">
              <h1 class="home-greeting">Hi!</h1>
              <h2 class="home-subtitle">How can we help?</h2>
              
              <!-- Start chat button -->
              <button class="start-chat-button" @click="startNewChat">
                Start a new chat
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <service-status 
                ref="serviceStatus"
                @status-changed="onStatusChanged" 
              />
              
              <!-- Previous Chats Section -->
              <div class="previous-chats-section">
                <h3 class="previous-chats-title">Recent Conversations</h3>
                <div v-if="previousChats.length > 0" class="chat-list">
                  <div v-for="chat in displayedChats" 
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
                  <button 
                    v-if="previousChats.length > 5 && !showAllChats" 
                    class="show-more-button"
                    @click="showAllChats = true"
                  >
                    Show more
                  </button>
                </div>
                <!-- Add empty state message -->
                <div v-else class="empty-chats-message">
                  Your recent chats will appear here.
                </div>
              </div>

              <!-- Powered by section -->
              <div class="powered-by-section">
                <a href="https://sophosic.ai" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="powered-by-link">
                  Powered by Sophosic
                </a>
                <span class="separator">|</span>
                <button class="system-status-link" 
                        @click="showSystemStatus">
                  System Status
                  <span class="status-dot" :class="systemStatus.status.toLowerCase()"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- System Status Page -->
          <system-status-page
            v-else-if="showStatusPage"
            :services="serviceStatus?.services || []"
            :overall-status="systemStatus"
            @back="showStatusPage = false; showHomeScreen = true;"
          />

          <!-- Active Chat Messages -->
          <div v-else class="conversation-container">
            <div class="messages-wrapper">
              <div v-for="(message, idx) in messageList" 
                   :key="idx" 
                   class="message-item"
                   :class="[
                     message.author === 'me' ? 'user-message' : 'bot-message',
                     {
                       'thread-start': isBotThreadStart(idx),
                       'has-thread': isBotThreadStart(idx) && hasFollowingBotMessage(idx),
                       'thread-middle': isBotThreadMiddle(idx),
                       'thread-end': isBotThreadEnd(idx)
                     }
                   ]">
                <div class="message-content">
                  <div v-if="message.author !== 'me'" 
                       class="bot-avatar"
                       :class="{ 'hidden-avatar': isBotThreadMiddle(idx) || isBotThreadEnd(idx) }">
                    <span>S</span>
                    <span class="avatar-status-indicator" 
                          :class="systemStatus.status.toLowerCase()"
                          :title="systemStatus.statusText">
                    </span>
                  </div>
                  <div class="message-bubble" 
                       v-html="renderMarkdown(message.data.text)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User input slot -->
        <div v-if="!showHomeScreen && !showStatusPage" 
             class="user-input" 
             :class="{ 'keyboard-open': isKeyboardOpen }"
             :style="{ backgroundColor: currentTheme.input.background }">
          <div class="input-wrapper" 
               :class="{ 'bot-typing': showTypingIndicator === 'bot' }"
               @click="() => console.log('Typing status:', showTypingIndicator)">
            <input 
              type="text" 
              v-model="newMessage" 
              placeholder="Type a message..." 
              @keyup.enter="sendMessage"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
              :style="{ color: currentTheme.input.text }"
              :disabled="showTypingIndicator === 'bot'"
            />
            <button 
              @click="sendMessage"
              :class="{ 'active': newMessage.trim().length > 0 }"
              :disabled="showTypingIndicator === 'bot'"
            >
              <svg v-if="showTypingIndicator === 'bot'" viewBox="0 0 24 24"></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import ServiceStatus from './ServiceStatus.vue';
import SystemStatusPage from './SystemStatusPage.vue';
import { defaultTheme } from './theme.js';
const API_URL = 'https://n8n.sophosic.ai/webhook/e60704a9-52c1-47eb-9037-2344d6b56c21/chat'

/**
 * @typedef {import('./theme').Theme} Theme
 */

const logError = (error, context) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ChatWidget] ${context}:`, error);
  }
  // Could add proper error tracking service here
  // e.g., Sentry, LogRocket, etc.
};

export default {
  name: 'ChatWidget',
  
  components: {
    ServiceStatus,
    SystemStatusPage
  },

  props: {
    /** @type {{ type: ObjectConstructor, default: () => Partial<Theme> }} */
    theme: {
      type: Object,
      default: () => ({})
    }
  },

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
      apiUrl: API_URL,
      messageList: [],
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: '',
      newMessage: '',
      currentTheme: defaultTheme,
      showHomeScreen: true,
      previousChats: [], // Array to store previous chat sessions
      showAllChats: false,
      systemStatus: {
        status: 'OK',
        statusText: 'Operational'
      },
      isStatusHovered: false,
      showStatusPage: false,
      serviceStatus: null,
      chatSummary: '',
      isKeyboardOpen: false,
      viewportHeight: window.innerHeight,
      isMobileDevice: false,
      hidePreview: false,
    }
  },

  computed: {
    displayedChats() {
      return this.showAllChats 
        ? this.previousChats 
        : this.previousChats.slice(0, 5);
    },
    isBotTyping() {
      return this.showTypingIndicator === 'bot';
    }
  },

  created() {
    // Merge custom theme with default theme
    this.currentTheme = {
      ...defaultTheme,
      ...this.theme
    }

    // 1) Load session once (sessionId), and load previous chats
    this.loadSession();
    this.loadPreviousChats();
  },

  async mounted() {
    // Only do the initial API fetch if we *already* have messages
    if (this.messageList.length > 0) {
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
        if (welcomeMessage && welcomeMessage !== "I'm here to help! How can I assist you today? (error)") {
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

    // Initialize serviceStatus when the component is mounted
    this.$nextTick(() => {
      if (this.$refs.serviceStatus) {
        this.serviceStatus = this.$refs.serviceStatus;
      }
    });

    // Check if device is mobile
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Only add mobile-specific handlers if on mobile
    if (this.isMobileDevice) {
      // Add event listeners for viewport changes
      window.addEventListener('resize', this.handleViewportResize);
      
      // Handle iOS viewport changes
      if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', this.handleViewportResize);
      }

      // Set custom viewport height property
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      
      // Update viewport height when keyboard appears
      if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', () => {
          const viewport = window.visualViewport;
          document.documentElement.style.setProperty(
            '--keyboard-height',
            `${window.innerHeight - viewport.height}px`
          );
          this.scrollToBottom();
        });
      }
    }
  },

  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('resize', this.handleViewportResize);
    if ('visualViewport' in window) {
      window.visualViewport.removeEventListener('resize', this.handleViewportResize);
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
          text: "👋 Hi! I'm Sophia, an AI agent here with Valley Connection. How can I help you today?"
        }
      });
    },

    async onMessageWasSent(message) {
      this.showTypingIndicator = 'bot';

      // Add timestamp to user message
      this.addMessage({
        author: 'me',
        type: 'text',
        data: { text: message.data.text },
        timestamp: new Date().toISOString()
      });

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
        
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'omit',
          body: requestBody
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw response data:', data);
        
        // Get the conversation summary from the response array
        const conversationSummary = Array.isArray(data) 
          ? data.find(item => item.conversationSummary)?.conversationSummary 
          : (data.conversationSummary || 'Chat session');
        
        console.log('Extracted conversation summary:', conversationSummary);
        
        if (conversationSummary === 'Chat session') {
          console.warn('No conversation summary found in response:', data);
        }
        
        // Handle the response
        const botMessage = this.extractMessage(data);
        
        // Send first message immediately
        if (botMessage.messages.length > 0) {
          const messageToAdd = {
            author: 'bot',
            type: 'text',
            data: { text: botMessage.messages[0] },
            summary: conversationSummary,
            timestamp: new Date().toISOString()
          };
          console.log('Adding message with summary:', messageToAdd);
          await this.addMessage(messageToAdd);
        }

        // Send remaining messages with delays
        if (botMessage.messages.length > 1) {
          for (let i = 1; i < botMessage.messages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.addMessage({
              author: 'bot',
              type: 'text',
              data: { text: botMessage.messages[i] },
              summary: conversationSummary,
              timestamp: new Date().toISOString()
            });
          }
        }

        // Update the chat summary in previousChats
        const currentChat = this.previousChats.find(chat => chat.sessionId === this.sessionId);
        if (currentChat) {
          currentChat.summary = conversationSummary;
          this.savePreviousChats();
        }

      } catch (error) {
        logError(error, 'Message sending failed');
        this.addMessage({
          author: 'bot',
          type: 'text',
          data: { text: "I'm sorry, I'm having trouble connecting. Please try again." }
        });
      } finally {
        this.showTypingIndicator = '';
      }
    },

    extractMessage(data) {
      try {
        let messageText = '';
        
        if (Array.isArray(data)) {
          // Find the object with agentResponse in the array
          const responseObj = data.find(item => item.agentResponse);
          messageText = responseObj?.agentResponse || "I'm here to help! How can I assist you today? (error)";
        } else if (data.agentResponse) {
          messageText = data.agentResponse;
        } else {
          messageText = "I'm here to help! How can I assist you today? (error)";
        }

        // Split into multiple messages if there are line breaks, but handle double newlines
        const messages = messageText
          .split('\n')
          .map(msg => msg.trim())
          .filter(msg => msg.length > 0)
          // Remove any remaining \n characters
          .map(msg => msg.replace(/\\n/g, ''));

        return { messages };
      } catch (error) {
        console.error('Error extracting message:', error);
        return { 
          messages: ["I'm here to help! How can I assist you today? (error)"]
        };
      }
    },

    addMessage(message) {
      // Ensure message has a timestamp in local Phoenix time
      if (!message.timestamp) {
        const now = new Date();
        // Convert to Phoenix time by adjusting for UTC-7
        const phoenixOffset = -7 * 60; // -7 hours in minutes
        const phoenixTime = new Date(now.getTime() + (now.getTimezoneOffset() + phoenixOffset) * 60000);
        message.timestamp = phoenixTime.toISOString();
      }
      
      console.log('Adding message:', message);
      this.messageList = [...this.messageList, message];
      
      // Scroll to bottom after adding message
      this.$nextTick(() => {
        const container = document.querySelector('.conversation-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
      
      // Archive after each new message
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
      const transcript = this.messageList.map(msg => {
        const author = msg.author === 'me' ? 'You' : 'Sophia';
        // Convert stored ISO timestamp to Phoenix local time
        const timestamp = msg.timestamp ? 
          new Date(msg.timestamp).toLocaleString('en-US', {
            timeZone: 'America/Phoenix',
            hour12: true,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : 
          new Date().toLocaleString('en-US', {timeZone: 'America/Phoenix'});
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
      this.messageList = [];
      this.createNewSession();
      
      // First add the main welcome message
      this.addMessage({
        author: 'bot',
        type: 'text',
        data: { 
          text: `👋 Hi! I'm Sophia, an AI agent here with **Valley Connection AZ**. I can help you with:

- Information about our business networking community
- Details about our upcoming events and mastermind groups
- Membership benefits and opportunities
- Education & training programs like Real Estate Mastery
- Locations of our meetings in Phoenix, Gilbert, Queen Creek, and other Valley areas
- How to get involved with our thriving business community`
        },
        isWelcomeMessage: true
      });

      // Add the final question as a threaded message, also marked as welcome
      this.$nextTick(() => {
        this.addMessage({
          author: 'bot',
          type: 'text',
          data: { 
            text: 'How can I assist you today?' 
          },
          isWelcomeMessage: true,
          isThreaded: true
        });
      });
      
      // Set showHomeScreen to false after adding the messages
      this.$nextTick(() => {
        this.showHomeScreen = false;
      });
    },

    goToHome() {
      this.archiveSession();
      this.loadPreviousChats();
      this.messageList = [];
      this.isChatOpen = true;
      this.showHomeScreen = true;
      this.showAllChats = false;
    },

    loadPreviousChats() {
      const savedChats = localStorage.getItem('previousChats');
      if (savedChats) {
        try {
          this.previousChats = JSON.parse(savedChats);
          // Sort chats by last message timestamp, most recent first
          this.previousChats.sort((a, b) => {
            const aLastMsg = a.messages[a.messages.length - 1];
            const bLastMsg = b.messages[b.messages.length - 1];
            return new Date(bLastMsg?.timestamp || b.timestamp) - 
                   new Date(aLastMsg?.timestamp || a.timestamp);
          });
          console.log('Loaded recent conversations:', this.previousChats);
        } catch (e) {
          console.error('Error loading recent conversations:', e);
          this.previousChats = [];
        }
      }
    },

    savePreviousChats() {
      // Sort by last message timestamp before saving
      this.previousChats = this.previousChats
        .sort((a, b) => {
          const aLastMsg = a.messages[a.messages.length - 1];
          const bLastMsg = b.messages[b.messages.length - 1];
          return new Date(bLastMsg?.timestamp || b.timestamp) - 
                 new Date(aLastMsg?.timestamp || a.timestamp);
        })
        .slice(0, 10); // Keep only the 10 most recent
      
      localStorage.setItem('previousChats', JSON.stringify(this.previousChats));
      console.log('Saved recent conversations:', this.previousChats);
    },

    loadChat(chat) {
      this.showHomeScreen = false;
      console.log('Loading chat:', chat);
      this.sessionId = chat.sessionId;
      this.messageList = [...chat.messages]; // Create a new array to ensure reactivity
      this.isChatOpen = true;
      
      // Scroll to bottom after loading chat
      this.$nextTick(() => {
        const container = document.querySelector('.conversation-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    getChatPreview(chat) {
      // First check if we have a valid summary
      if (chat.summary && chat.summary !== 'Chat session') {
        return chat.summary.length > 50 ? chat.summary.substring(0, 50) + '...' : chat.summary;
      }
      
      // If no summary, find the first non-welcome message
      const firstNonWelcomeMessage = chat.messages.find(msg => !msg.isWelcomeMessage);
      const previewText = firstNonWelcomeMessage?.data?.text || 'New chat';
      
      return previewText.length > 50 ? previewText.substring(0, 50) + '...' : previewText;
    },

    formatDate(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      // Format time
      const time = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      // If less than 1 minute ago
      if (diffInMinutes < 1) {
        return 'Just now';
      }
      
      // If less than 1 hour ago
      if (diffInHours < 1) {
        return `${diffInMinutes}m ago`;
      }
      
      // If less than 24 hours ago
      if (diffInDays < 1) {
        return `${diffInHours}h ago`;
      }
      
      // If today (after midnight)
      if (date.toDateString() === now.toDateString()) {
        return `Today at ${time}`;
      }
      
      // If yesterday
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${time}`;
      }
      
      // If within the last 7 days
      if (diffInDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
      }
      
      // If within the current year
      if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
      }
      
      // If more than a year ago
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    },

    archiveSession() {
      if (this.messageList.length > 0) {
        // Get all bot messages with summaries, excluding welcome messages
        const botMessages = this.messageList.filter(msg => 
          msg.author === 'bot' && 
          msg.summary && 
          msg.summary !== 'Chat session' &&
          !msg.isWelcomeMessage
        );
        
        // Get the most recent summary, or fall back to finding a meaningful message
        let chatSummary = 'Chat session';
        
        if (botMessages.length > 0) {
          // Use the most recent valid summary
          chatSummary = botMessages[botMessages.length - 1].summary;
        } else {
          // Try to find the first non-welcome message as a fallback
          const firstNonWelcomeMessage = this.messageList.find(msg => !msg.isWelcomeMessage);
          if (firstNonWelcomeMessage) {
            chatSummary = firstNonWelcomeMessage.data.text.substring(0, 50);
          }
        }

        // Get timestamp from the last message instead of current time
        const lastMessage = this.messageList[this.messageList.length - 1];
        const timestamp = lastMessage?.timestamp || new Date().toISOString();
        
        // Find existing chat with this sessionId
        const existingChatIndex = this.previousChats.findIndex(
          chat => chat.sessionId === this.sessionId
        );
        
        const chatToSave = {
          sessionId: this.sessionId,
          messages: this.messageList,
          timestamp: timestamp, // Use last message timestamp
          summary: chatSummary
        };

        // Update or add the chat
        if (existingChatIndex !== -1) {
          // Update existing chat
          this.previousChats[existingChatIndex] = chatToSave;
        } else {
          // Add new chat to the beginning
          this.previousChats = [chatToSave, ...this.previousChats];
        }
        
        this.savePreviousChats();
        console.log('Archived chat with summary:', chatSummary, 'timestamp:', timestamp);
      }
    },

    sendMessage() {
      if (!this.newMessage.trim()) return;
      
      const message = {
        data: { text: this.newMessage.trim() }
      };
      
      // Clear input
      this.newMessage = '';
      
      // Let onMessageWasSent handle the message addition
      this.onMessageWasSent(message);
    },

    renderMarkdown(text) {
      try {
        // Clean up the text first
        const cleanText = text
          // Replace escaped newlines with actual newlines
          .replace(/\\n/g, '\n')
          // Clean up any HTML entities
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .trim();

        // Configure marked options
        marked.setOptions({
          breaks: true,  // Convert \n to <br>
          sanitize: false,  // Allow HTML
          gfm: true,  // GitHub Flavored Markdown
        });
        
        return marked(cleanText);
      } catch (error) {
        console.error('Markdown rendering error:', error);
        return text;  // Fallback to plain text if markdown fails
      }
    },

    isBotThreadStart(idx) {
      return (
        this.messageList[idx].author !== 'me' && 
        (idx === 0 || this.messageList[idx - 1].author === 'me')
      );
    },

    isBotThreadMiddle(idx) {
      return (
        this.messageList[idx].author !== 'me' &&
        idx > 0 &&
        idx < this.messageList.length - 1 &&
        this.messageList[idx - 1].author !== 'me' &&
        this.messageList[idx + 1].author !== 'me'
      );
    },

    isBotThreadEnd(idx) {
      return (
        this.messageList[idx].author !== 'me' &&
        (idx === this.messageList.length - 1 || this.messageList[idx + 1].author === 'me') &&
        idx > 0 &&
        this.messageList[idx - 1].author !== 'me'
      );
    },

    onStatusChanged(status) {
      this.systemStatus = status;
    },

    showSystemStatus() {
      // Get the ServiceStatus component instance
      this.serviceStatus = this.$refs.serviceStatus;
      
      // Only proceed if we have the services data
      if (this.serviceStatus) {
        this.showStatusPage = true;
        this.showHomeScreen = false;
      } else {
        console.error('ServiceStatus component not found');
      }
    },

    getSummaryText() {
      if (this.systemStatus.status === 'OK') {
        return 'All Systems Operational';
      } else if (this.systemStatus.status === 'WARN') {
        return 'Degraded Performance';
      } else if (this.systemStatus.status === 'CRIT') {
        return 'Service Disruption';
      }
      return 'Checking Status...';
    },

    handleInputFocus() {
      if (!this.isMobileDevice) return;
      
      this.isKeyboardOpen = true;
      this.$nextTick(() => {
        // Keep messages in viewport when keyboard opens
        const messagesWrapper = document.querySelector('.messages-wrapper');
        if (messagesWrapper) {
          const messages = messagesWrapper.querySelectorAll('.message-item');
          if (messages.length <= 3) { // For few messages
            window.scrollTo(0, 0);
          } else {
            const lastMessage = messages[messages.length - 1];
            lastMessage.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    },

    handleInputBlur() {
      if (!this.isMobileDevice) return;
      this.isKeyboardOpen = false;
    },

    handleViewportResize() {
      if (!this.isMobileDevice) return;
      
      const newHeight = window.visualViewport?.height || window.innerHeight;
      const keyboardHeight = this.viewportHeight - newHeight;
      if (newHeight < this.viewportHeight) {
        this.isKeyboardOpen = true;
        document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
        // Adjust scroll position for few messages
        const messages = document.querySelectorAll('.message-item');
        if (messages.length <= 3) {
          window.scrollTo(0, 0);
        }
      } else {
        this.isKeyboardOpen = false;
        document.documentElement.style.setProperty('--keyboard-height', '0px');
      }
      this.viewportHeight = newHeight;
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = document.querySelector('.conversation-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    getMostRecentChatPreview() {
      return this.getMostRecentChatSummary();
    },

    resumeRecentChat() {
      if (this.previousChats.length === 0) return;
      
      const recentChat = this.previousChats[0];
      this.loadChat(recentChat);
      this.isChatOpen = true;
      this.showHomeScreen = false;
    },

    getMostRecentChatSummary() {
      if (this.previousChats.length === 0) return '';
      const recentChat = this.previousChats[0];
      
      // Only return summary if API has provided one
      if (recentChat.summary) {
        return recentChat.summary;
      }
      return 'New chat'; // Default to "New chat" when no summary exists
    },

    hasFollowingBotMessage(idx) {
      // Check if the next message exists and is from the bot
      return idx < this.messageList.length - 1 && this.messageList[idx + 1].author !== 'me';
    }
  },
}
</script>

<style>
/* Add these styles to your CSS */
.chat-window {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: -webkit-fill-available;
  will-change: transform;
  contain: content;
}

.chat-window-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.conversation-container {
  position: relative;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  min-height: 0;
  background-color: var(--chat-background);
  display: flex;
  flex-direction: column;
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: auto;
  justify-content: flex-start;
  contain: layout style;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chat-container.keyboard-open {
  transform: translateY(calc(-1 * var(--keyboard-height, 270px)));
  transition: transform 0.3s ease;
  height: calc(100% - var(--keyboard-height, 270px));
}

.custom-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--chat-header-bg);
  color: var(--chat-header-text);
}

.user-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: var(--chat-input-bg);
  padding: 8px;
  padding-bottom: env(safe-area-inset-bottom, 8px);
  transition: transform 0.3s ease;
}

.user-input.keyboard-open {
  bottom: env(keyboard-inset-height, 0);
  padding-bottom: env(safe-area-inset-bottom, 8px);
  transform: translateY(calc(-1 * var(--keyboard-height, 270px)));
}

@media screen and (max-width: 600px) {
  .chat-window {
    height: 100%;
    height: -webkit-fill-available;
  }
  
  .messages-wrapper {
    padding-bottom: env(safe-area-inset-bottom, 16px);
  }
  
  .chat-container.keyboard-open .messages-wrapper {
    transform: translateY(0);
  }
  
  /* Ensure messages stay visible with few messages */
  .conversation-container:only-child {
    justify-content: flex-start;
  }
}

/* Add viewport height calculation on mount */
:root {
  --vh: 1vh;

  /* Theme CSS Variables */
  --chat-primary: v-bind('currentTheme.primary');
  --chat-secondary: v-bind('currentTheme.secondary');
  --chat-background: v-bind('currentTheme.messages.background');
  
  /* Header */
  --chat-header-bg: v-bind('currentTheme.header.background');
  --chat-header-text: v-bind('currentTheme.header.text');
  --chat-header-button-bg: v-bind('currentTheme.header.buttons.background');
  --chat-header-button-hover: v-bind('currentTheme.header.buttons.hover');
  
  /* Messages */
  --chat-message-user-bg: v-bind('currentTheme.messages.user.background');
  --chat-message-user-text: v-bind('currentTheme.messages.user.text');
  --chat-message-bot-bg: v-bind('currentTheme.messages.bot.background');
  --chat-message-bot-text: v-bind('currentTheme.messages.bot.text');
  --chat-message-timestamp: v-bind('currentTheme.messages.timestamp');
  
  /* Input */
  --chat-input-bg: v-bind('currentTheme.input.background');
  --chat-input-text: v-bind('currentTheme.input.text');
  --chat-input-placeholder: v-bind('currentTheme.input.placeholder');
  --chat-input-border: v-bind('currentTheme.input.border');
  --chat-input-button-default: v-bind('currentTheme.input.button.default');
  --chat-input-button-active: v-bind('currentTheme.input.button.active');
  
  /* Preview */
  --chat-preview-bg: v-bind('currentTheme.preview.background');
  --chat-preview-text: v-bind('currentTheme.preview.text');
  --chat-preview-timestamp: v-bind('currentTheme.preview.timestamp');
  --chat-preview-shadow: v-bind('currentTheme.preview.shadow');
}

/* Markdown styling */
.message-bubble ul {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message-bubble li {
  margin: 0.25em 0;
}

.message-bubble p {
  margin: 0.5em 0;
}

.message-bubble p:first-child {
  margin-top: 0;
}

.message-bubble p:last-child {
  margin-bottom: 0;
}

/* Only apply keyboard adjustments on mobile */
@media screen and (max-width: 600px) {
  .chat-container.keyboard-open {
    transform: translateY(calc(-1 * var(--keyboard-height, 270px)));
    transition: transform 0.3s ease;
    height: calc(100% - var(--keyboard-height, 270px));
  }

  .user-input.keyboard-open {
    bottom: env(keyboard-inset-height, 0);
    padding-bottom: env(safe-area-inset-bottom, 8px);
    transform: translateY(calc(-1 * var(--keyboard-height, 270px)));
  }
}

/* Desktop specific styles */
@media screen and (min-width: 601px) {
  .chat-container {
    height: 100%;
  }

  .user-input {
    position: sticky;
    bottom: 0;
    transform: none !important;
  }

  .messages-wrapper {
    margin-top: 0;
  }
}

/* Add styles for the floating preview */
.recent-chat-preview {
  position: absolute !important;
  bottom: calc(100% + 16px) !important;  /* Position above launcher */
  right: 0 !important;
  background: var(--chat-preview-bg) !important;
  padding: 12px 16px !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px var(--chat-preview-shadow) !important;
  width: 280px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.recent-chat-preview-text {
  font-family: 'Work Sans', sans-serif !important;
  font-size: 14px !important;
  color: var(--chat-preview-text) !important;
  margin: 0 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.recent-chat-preview-time {
  font-family: 'Work Sans', sans-serif !important;
  font-size: 12px !important;
  color: var(--chat-preview-timestamp) !important;
  margin-top: 4px !important;
}

/* Message Styles */
.message-item {
  display: flex;
  flex-direction: column;
}

.message-content {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.user-message .message-bubble {
  background-color: var(--chat-message-user-bg);
  color: var(--chat-message-user-text);
  margin-left: auto;
}

.bot-message .message-bubble {
  background-color: var(--chat-message-bot-bg);
  color: var(--chat-message-bot-text);
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
  word-break: break-word;
}

/* Input Styling */
.input-wrapper {
  display: flex;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--chat-input-border);
  border-radius: 8px;
  background: var(--chat-input-bg);
}

.input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--chat-input-text);
}

.input-wrapper input::placeholder {
  color: var(--chat-input-placeholder);
}

.input-wrapper button {
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--chat-input-button-default);
  cursor: pointer;
  transition: color 0.2s ease;
}

.input-wrapper button.active {
  color: var(--chat-input-button-active);
}

/* Header Button Styling */
.custom-header button {
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: var(--chat-header-button-bg);
  color: var(--chat-header-text);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.custom-header button:hover {
  background: var(--chat-header-button-hover);
}
</style>