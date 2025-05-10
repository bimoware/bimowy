# ✨ Bimowy

<div align="center">
   
A project inspired by the "Khan Academy" project aimed at helping struggling students (or not!) train in any math domain at any difficulty they want to.

</div>

## 🎥 Demo

<div align="center">

https://github.com/user-attachments/assets/ddbd267b-fe8d-4730-ac4e-6f33e84167a0

</div>
If you don't like using your mouse like me, just press <code>Shift</code> to change selection, then <code>Enter</code> and the website will know what to do (Start/Next/Try again/End..) 

## ⚙️ Setup

1. Clone the repository using `git clone`, with Github
   Desktop or with the green download button on top.
2. Extract to a app/src/api/ in any template you have.
3. Run the development server with `npm run dev`
4. Open your browser and visit `http://localhost:3000`
5. Use the given API Routes to try, train or play with the backend server.

## 🤝 Contributing

Feel free to fork the repository and create pull requests.
Please make sure to make meaningful commits. Commits that barely help with performance at the cost of readability/modularity are not welcome.

## ❌ Issues

I know it's a bit annoying but please make the effort and waste 3 or 5 minutes giving as many informations as you can in your Issue.

## 📁 Architecture

- `defs.ts` -> Types & Classes & Constants & ..
- `db/` -> Database (folder of multiple files, each including a Builder instance)

```plaintext
api/
├─ cheatsheets/
│  ├─ all/          # [Route] Returns a list of all cheat sheets
│  ├─ db/           # Database of all cheat sheets
│  │  └─ # basic-arithmetic.ts & trigonometry.ts & sets.ts ...
│  └─ defs.ts
├─ exercises/
│  ├─ all/          # [Route] Returns a list of all exercises
│  ├─ generate/     # [Route] Returns N generate exercise questions
│  ├─ options/      # [Route] Returns data (including options) of an exercise
│  ├─ validate/     # [Route] Returns validations
│  ├─ db/           # Database of all exercises
│  │  └─ # base-conversion.ts & basic-arithmetic.ts & points-to-vector.ts ...
│  └─ defs.ts
├─ db.ts        # Database handler
├─ defs.ts
├─ README.md    # This lol
└─ util.ts      # Useful stuff (i.e functions)

```

## 📄 License

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.
