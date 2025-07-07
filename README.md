# StoryMaker

A SvelteKit application for creating AI-powered storyboards with video generation capabilities.

## Features

- **AI Storyboard Generation**: Create storyboards using OpenAI's GPT-4 and DALL-E 3
- **Interactive Slideshow Player**: Play your storyboard with synchronized audio
- **ElevenLabs Integration**: Generate realistic voice audio for dialogue
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI API Key (required for storyboard generation)
OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs API Key (required for audio generation)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Tavily API Key (for search functionality)
TAVILY_API_KEY=your_tavily_api_key_here
```

### Getting API Keys

1. **OpenAI API Key**: Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **ElevenLabs API Key**: Get your key from [ElevenLabs](https://elevenlabs.io/) (free tier available)
3. **Tavily API Key**: Get your key from [Tavily](https://tavily.com/) (optional)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
npm run dev -- --open
```

## Usage

1. **Create a Storyboard**: Fill out the form with your story concept, style, and preferences
2. **Generate Images**: The AI will create visual slides based on your story
3. **Play Storyboard**: Click "Play Storyboard" to generate audio and create an interactive slideshow
4. **Customize**: Navigate through slides, play/pause, and adjust timing

## Building for Production

```bash
npm run build
npm run preview
```

## Technologies Used

- **SvelteKit**: Full-stack web framework
- **Tailwind CSS**: Utility-first CSS framework
- **OpenAI**: GPT-4 for story generation, DALL-E 3 for images
- **ElevenLabs**: AI voice generation
- **Lucide Icons**: Beautiful icon library

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   ├── langgraph/          # Storyboard generation logic
│   ├── models/             # TypeScript interfaces
│   └── schemas/            # Data validation schemas
├── routes/
│   ├── api/                # Server API endpoints
│   ├── (public)/           # Public pages (login, signup)
│   └── storyboard/         # Main storyboard interface
└── static/                 # Static assets
```
