# The Alchemist's Ledger 🧪

**A no-asset, on-chain crafting game built for the Monad Game Jam.**

"The Alchemist's Ledger" is a decentralized crafting game where players combine basic elements to discover a universe of new materials, creatures, and technologies. Every successful craft is recorded on the Monad blockchain, contributing to a global, player-driven progression system. Built with a focus on systems over sprites, the game leverages Monad's high-performance architecture to create a seamless, addictive, and crypto-native experience.

---

## ✨ Features
* **Gasless Player Experience**: Players can enjoy the game without needing to approve transactions or pay gas fees for in-game actions. All on-chain interactions are sponsored by the game's backend, providing a smooth Web2-like feel.
* **On-Chain Integration**: Player scores and transaction counts are submitted to the Monad Games ID smart contract, contributing to a global leaderboard.
* **Persistent Progress**: Player inventory, discovered recipes, and unlocked achievements are saved in the browser's `localStorage`.
* **Timed Resource Generation**: Basic elements are a scarce resource, regenerating over time to encourage strategic play and return visits.
* **Deep Crafting Tree**: A rich system of recipes allows for the discovery of common, uncommon, rare, epic, and legendary elements.
* **Achievement System**: Players are rewarded with badges for reaching key milestones, such as their first craft or discovering the final element.
* **Intelligent Hint System**: An actionable hint system with a cooldown helps players when they're stuck, ensuring they always have a path forward.
* **Polished UX**: The game is fully mobile-responsive and features animations and toast notifications for a satisfying user experience.
* **Modular Architecture**: The codebase is cleanly separated into a custom logic hook (`useGameLogic`) and modular UI components for easy maintenance and expansion.

---

## 🛠️ Tech Stack

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Animation**: Framer Motion
* **Blockchain Interaction**: `viem`
* **User Authentication**: Privy with Monad Games ID
* **Notifications**: `react-hot-toast`
* **Special Effects**: `react-confetti`

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

* Node.js (v18 or later)
* pnpm (or npm/yarn)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    or
    npm install
    or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add the following variables:
    ```
    # Your Privy App ID from the Privy Dashboard
    NEXT_PUBLIC_PRIVY_APP_ID=YOUR_PRIVY_APP_ID_HERE

    # The private key of the wallet you registered as your game's scorekeeper
    # IMPORTANT: This is a secret and should never be committed to Git
    GAME_PRIVATE_KEY=0xYOUR_BACKEND_WALLET_PRIVATE_KEY
    ```

4.  **Run the development server:**
    ```sh
    pnpm dev
    or
    npm run dev
    or 
    yarn run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the game.

---

## 🎮 How to Play

1.  **Sign In**: Connect using your Monad Games ID.
2.  **Select Elements**: Click on two elements from your inventory to place them in the crafting slots.
3.  **Craft**: Click the "Craft" button to attempt a combination.
    * **Success**: If the combination is valid, a new element is created and added to your inventory. Your discovery is recorded.
    * **Failure**: The elements are consumed, but nothing is created.
4.  **Discover Everything**: Your goal is to discover all 7 unique craftable elements, culminating in the Legendary Diamond.
5.  **Use Hints**: If you get stuck, use the hint button to reveal a possible combination. Be strategic—it has a 5-minute cooldown!
6.  **Check Your Progress**: Keep an eye on your global score, your rank, and your unlocked achievements.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
