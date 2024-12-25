// Create custom element wrapper for Wix
class ChatWidgetElement extends HTMLElement {
  constructor() {
    super();
    // Create shadow DOM for isolation
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Load your chat widget
    const script = document.createElement('script');
    script.src = 'https://your-cdn-url/js/app.js'; // Update with your CDN URL
    
    // Add any configuration options passed from Wix
    window.CHAT_CONFIG = {
      apiUrl: this.getAttribute('api-url') || 'https://n8n.sophosic.ai/webhook/e60704a9-52c1-47eb-9037-2344d6b56c21/chat',
      theme: {
        primary: this.getAttribute('primary-color') || '#5423E7',
        secondary: this.getAttribute('secondary-color') || '#1E1B3C'
      }
    };

    this.shadowRoot.appendChild(script);
  }
}

// Register the custom element
customElements.define('sophosic-chat', ChatWidgetElement); 