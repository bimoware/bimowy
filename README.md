<div align="center">

<a href="https://gitmoji.dev">
  <img
    src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square"
    alt="Gitmoji"
  />
</a>
</div>
# ✨ Bimowy

<div align="center">
   
A project inspired by the "Khan Academy" project aimed at helping struggling students train in any math subject at any difficulty they want to.

🔥 Works in both `French (fr-FR)` & `English (en-US)`

</div>

## 🎥 Demo

<div align="center">

https://github.com/user-attachments/assets/6557b363-ef87-4c9f-b26f-a9837bd99abc

</div>
If you don't like using your mouse like me, just press <code>Enter</code> and the website will know what to do (Start/Next/Try again/End/Focus on the next input etc..)

## ⚙️ Setup

1. Clone the repository with either
   - [Using `git clone` or the green download button `Code` on top](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
   - [Github Desktop](https://github.com/apps/desktop)
2. Create a supabase database and put the correct environement variables into an `.env` file (you have the copy & rename [.env.example](.env.example))
3. Run the development server with `npm run dev`
4. Open your browser and visit `http://localhost:3000`
5. Use the given API Routes to try, train or play with the backend server.

## 📁 Architecture

```plaintext
src/
├─ app/
│  ├─ (ui)/
│  │  ├─ credits/
│  │  ├─ login/
│  │  ├─ /resources
│  │  │  └─ [id]/
│  │  ├─ test/
│  │  └─ user/
│  ├─ api/
│  │  ├─ lib/
│  │  ├─ resources/
│  │  │  ├─ [id]/ # API Routes (generate/validate)
│  │  │  ├─ list/ # All resources data (exercises, cheatsheets)
│  │  │  └─ handler.ts
│  │  └─ main.ts
│  └─ layout.tsx, page.tsx, style.css ...
├─ cpn/
│  └─ Sidebar/, icons/, widgets/...
├─ db/
├─ i18n/
├─ utils/
└─ middleware.ts
.env, package-lock.json, package.json, tsconfig...
```

## 🤝 Commits

- For commit messages, you have to follow the [Gitmoji](https://gitmoji.dev/) syntax

## 📄 License

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.
