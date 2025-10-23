# KEYMON

Fun typing game with a **modular, extensible architecture** that makes it easy to create different typing game modes.

## 🎮 Features

- **Typing Battle Mode**: Multiplayer typing battle with health system
- **Speed Typer Mode**: WPM and accuracy tracking with timer
- **Extensible System**: Create new game modes in minutes
- **Real-time Multiplayer**: Socket.io integration
- **Beautiful UI**: Retro 8-bit styled components

## 🚀 Recent Refactoring

The typing system has been completely refactored into a **reusable, modular architecture**. You can now create any typing-based game without worrying about the core typing mechanics!

### 📚 Documentation

- **[Quick Start Guide](features/QUICKSTART.md)** - Create a new game in 5 minutes
- **[Architecture Overview](features/ARCHITECTURE.md)** - Visual diagrams and system design
- **[Before & After Comparison](BEFORE_AFTER.md)** - See the transformation
- **[Complete Typing System Guide](features/typing/README.md)** - Comprehensive API docs
- **[Refactoring Summary](features/TYPING_SUMMARY.md)** - What changed and why

### 🏗️ Project Structure

```
features/
  typing/                    # ⚡ Core typing engine (reusable)
    hooks/
      useTypingCore.ts       # Pure typing mechanics
      useTypingRenderer.ts   # Rendering & viewport
    components/
      TypingArea.tsx         # Generic typing UI
    
  games/                     # 🎮 Game implementations
    typing-battle/           # Multiplayer battle
    speed-typer/             # Speed & accuracy game
```

### 🎯 Create Your Own Game

```typescript
import { useTypingCore, TypingArea } from "@/features/typing";

export function MyGame() {
  const typing = useTypingCore({
    words: myWords,
    onCorrectChar: () => {
      // Your game logic here!
    },
  });
  
  return <TypingArea {...typing} />;
}
```

That's it! See the [Quick Start Guide](features/QUICKSTART.md) for details.

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Socket.io** - Real-time multiplayer
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Biome** - Linting & formatting

## 📦 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## 🎮 Game Modes

### Typing Battle
- Real-time multiplayer
- Health system
- Socket.io integration
- Heal words mechanic

### Speed Typer
- WPM tracking
- Accuracy measurement
- Countdown timer
- Solo practice mode

### Your Game Here!
- See [QUICKSTART.md](features/QUICKSTART.md)
- Build any typing game in minutes
- Reuse core typing mechanics

## 🤝 Contributing

The new architecture makes it easy to add new game modes:

1. Create hook in `features/games/your-game/hooks/`
2. Create component in `features/games/your-game/components/`
3. Export from `features/games/your-game/index.ts`
4. Done!

See [Architecture Guide](features/ARCHITECTURE.md) for details.

## 📝 License

MIT
