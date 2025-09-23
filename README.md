# SkateTube - Skateboarding & Biking Video Platform

A modern video sharing platform specifically designed for skateboarding and biking enthusiasts, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🛹 **Specialized Content**: Focused on skateboarding, biking, BMX, and related action sports
- 📱 **Responsive Design**: Fully responsive design that works on all devices
- 🎥 **Video Upload**: Easy drag-and-drop video upload with progress tracking
- 🎬 **Custom Video Player**: Built-in video player with full controls
- 🔍 **Search & Filter**: Advanced search and category filtering
- 💬 **Comments System**: Interactive comment system with replies
- 👍 **Engagement**: Like/dislike system for videos
- 🏷️ **Tagging System**: Tag videos for better discoverability
- 📊 **User Profiles**: User profiles with subscriber counts
- 🔄 **Related Videos**: Intelligent related video suggestions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Video Handling**: HTML5 Video with custom controls
- **File Upload**: Drag & drop interface with progress tracking
- **Development**: ESLint, PostCSS, Autoprefixer

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd skateboard-application
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
src/
├── app/ # Next.js app directory
│ ├── api/ # API routes
│ ├── video/[id]/ # Video detail pages
│ ├── upload/ # Video upload page
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/ # Reusable UI components
│ ├── Header.tsx # Navigation header
│ ├── VideoCard.tsx # Video preview cards
│ ├── VideoPlayer.tsx # Custom video player
│ ├── VideoUpload.tsx # Upload interface
│ └── ...
├── types/ # TypeScript type definitions
├── hooks/ # Custom React hooks
├── lib/ # Utility libraries
└── utils/ # Helper functions
\`\`\`

## Key Components

### VideoPlayer

Custom HTML5 video player with:

- Play/pause controls
- Volume control
- Seek bar with preview
- Fullscreen mode
- Keyboard shortcuts

### VideoUpload

Drag-and-drop upload interface with:

- File type validation
- Upload progress tracking
- Video preview
- Metadata form (title, description, tags, category)
- Custom thumbnail upload

### Search & Filtering

- Real-time search across titles, descriptions, and tags
- Category-based filtering
- Responsive filter UI

## API Routes

- `GET /api/videos` - Get videos with filtering and pagination
- `POST /api/videos` - Upload new video
- `GET /api/videos/[id]` - Get specific video details
- `PUT /api/videos/[id]` - Update video (likes, views, etc.)

## Customization

### Adding New Categories

Update the `VideoCategory` type in `src/types/index.ts` and add the new category to the filter components.

### Styling

The project uses Tailwind CSS with custom components. Main colors and styles can be customized in:

- `tailwind.config.js` - Theme configuration
- `src/app/globals.css` - Custom component styles

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Video processing and encoding
- [ ] Real-time notifications
- [ ] Social features (following, subscriptions)
- [ ] Video analytics and insights
- [ ] Mobile app development
- [ ] Advanced video effects and filters

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.
