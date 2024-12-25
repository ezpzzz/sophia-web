# Sophia Web Chat Widget

A modern, Vue 3-based chat widget featuring AI-powered responses, conversation history, and a sleek user interface.

## Features

- 💬 AI-powered chat interface
- 🔄 Conversation history with resumable sessions
- 📱 Fully responsive design
- 🎨 Customizable theming
- 🚀 Performance optimized with Brotli/Gzip compression
- 🔌 Easy integration with Wix and other platforms
- 🌐 Cross-browser compatibility

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for local testing
npm run build:local

# Build and deploy to GitHub Pages
npm run deploy
```

## Integration

Add to your website:

```html
<!-- Add to your site's header -->
<script src="https://ezpzzz.github.io/sophia-web/js/app.js"></script>

<!-- Add where you want the chat widget to appear -->
<sophosic-chat 
  api-url="YOUR_API_URL"
  primary-color="#5423E7"
  secondary-color="#1E1B3C">
</sophosic-chat>
```

## Configuration

The widget supports the following attributes:

- `api-url`: API endpoint for chat responses
- `primary-color`: Main theme color
- `secondary-color`: Secondary theme color

## Environment Setup

Create a `.env.production` file:

```env
NODE_ENV=production
VUE_APP_API_URL=YOUR_API_URL
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features in Detail

- **Conversation History**: Automatically saves and resumes chat sessions
- **Responsive Design**: Adapts seamlessly to all screen sizes
- **Customizable Theme**: Easily match your brand colors
- **Performance Optimized**: Includes Brotli and Gzip compression
- **Accessibility**: Built with WCAG guidelines in mind

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Contact

For support or inquiries, please contact [Sophosic AI](https://sophosic.ai)
