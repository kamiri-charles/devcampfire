# DevCampfire

**DevCampfire** is a social app built with **Next.js** that lets developers connect through their GitHub profiles.  
It visualizes **followers**, **following**, and **mutuals**, while offering a **real-time chat** powered by **Pusher**.  

The goal is to make connecting with other developers as simple and natural as chatting around a campfire. 🏕️  

---

## Tech Stack

| Feature | Technology |
|----------|-------------|
| Frontend | [Next.js](https://nextjs.org/) (App Router) |
| Authentication | [NextAuth.js](https://authjs.dev/) (GitHub Provider) |
| Database | [Neon](https://neon.tech/) (PostgreSQL) |
| ORM | [Drizzle](https://orm.drizzle.team/) |
| Real-time Chat | [Pusher](https://pusher.com/) |
| Styling | Tailwind CSS + Shadcn UI |
| Hosting | Vercel |

---

## Features

- 🔐 **GitHub OAuth** login  
- 👥 View **followers**, **following**, and **mutual connections**  
- 💬 **Real-time chat** with other connected users  
- 🗃️ Data stored securely in **Neon PostgreSQL**  
- ⚡ Modern UI using **Tailwind** and **Shadcn** components  
- 🧩 Modular architecture for easy contribution and scaling  

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devcampfire.git
cd devcampfire
```

### 2. Install dependencies
````npm install````
or
```pnpm install``` or ```yarn install```

### 3. Environment variables

WiP

### 4. Set up the database
WiP

### 5. Run the development server
```npm run dev```


Then open http://localhost:3000
 in your browser.

## Contributing

We welcome contributions! 🎉

Fork the repo

Create a new branch (git checkout -b feature/your-feature-name)

Commit your changes (git commit -m 'Add feature X')

Push your branch (git push origin feature/your-feature-name)

Open a Pull Request

Please ensure your code follows our linting and formatting rules. Run:
```
npm run lint
npm run format
```

## Project Structure
```
┣ 📂devcampfire/src
┃ ┣ 📂app               # Next.js App Router (routes, layouts, and pages)
┃ ┃ ┣ 📂[username]      # Dynamic routes for user profiles
┃ ┃ ┣ 📂api             # API endpoints (e.g., GitHub data, chat, auth)
┃ ┃ ┣ 📂kindling        # Loader page
┃ ┃ ┣ 📂welcome         # Landing experience for new users
┃ ┣ 📂components        # Reusable UI components
┃ ┣ 📂db                # DB schema
┃ ┣ 📂hooks             # Custom React hooks
┃ ┣ 📂lib               # Utilities, helpers, and third-party integrations
┃ ┣ 📂types             # TypeScript type definitions and interfaces
┃ ┣ 📜auth.ts           # NextAuth configuration and GitHub provider setup
┃ ┣ 📜index.ts          # DB config
┗ ┣ 📜middleware.ts     # Next.js middleware

```


## License

This project is licensed under the MIT License.