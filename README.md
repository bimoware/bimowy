# ✨ Bimowy

<div align="center">
   
A project inspired by the "Khan Academy" project aimed at helping struggling students (or not!) train in any math domain at any difficulty they want to.

</div>

## 🎥 Demo

<div align="center">

https://github.com/user-attachments/assets/6557b363-ef87-4c9f-b26f-a9837bd99abc

</div>
If you don't like using your mouse like me, just press <code>Shift</code> to change selection, then <code>Enter</code> and the website will know what to do (Start/Next/Try again/End..) 

# 🌐 Languages

Languages are applied every page's UI, the individual exercises, options, errors etc..

- French
- English

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

If you're going to publish an Issue here on Github. Please, while it's a bit annoying at first, make the effort and waste 3 or 5 minutes giving as many informations as you can in your Issue and not just the bare minimum.

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
