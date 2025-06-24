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

- When making a change and wanting to commit it, the commit message is very important, it has to follow `The commit I just did ...` and complete it from here, for example, `This commit deleted isBeta property`, the `deleted isBeta property` is the name of the commit
- If your pull request idea is big, don't immediately do everything. Make the minimum, and create a **draft** commit so at least the maintainers can approve of the idea. If the idea is approved, THEN you and others can work on actually making the changes to be merged.
- Those are the emojis to use for when commiting to this repository.

### 1️⃣ ✨ Creating/Adding (finished)

- `✨ Added isUserAdmin(user) helper`
- `✨ Created icon handler`
- `✨ Implemented RessourceBuilder base class`
- `✨ Added simple description to`

### 2️⃣ 🐣 Starting (unfinished / WIP feature)

- `🐣 Started CourseBuilder`
- `🐣 Initial draft of VideoBuilder`

### 3️⃣ 🗑️ Deleting

- `🗑️ Deleted 'isBeta' property for resources`
- `🗑️ Removed property 'isBeta' property for resources`
- `🗑️ Cleaned up unused ExerciseOption interface`
- `🗑️ Dropped deprecated meta field from RessourceBuilder`

### 4️⃣ 🐛 Editing (removing, deleting, editing)

- `🐛 Typo (not Ressource, Resource)`
- `🐛 Fixed missing default value in addition.ts`
- `🐛 Fixed broken import path for tags`

### 5️⃣ 🤖 Automate

- `🤖 Made "difficulty" a getter instead of hardcoded`
- `🤖 Automated ressource ID generation`

## 📄 License

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.
