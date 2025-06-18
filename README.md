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

```plaintext
src/
├─ app/
│  ├─ api/ # API Routes
│  │  ├─ ressources/
│  │  │  ├─ cheatsheets/
│  │  │  │  ├─ data/
│  │  │  │  │  └─ trigonometry.ts ...
│  │  │  │  └─ defs.ts
│  │  │  ├─ exercises/
│  │  │  │  ├─ data/
│  │  │  │  │  ├─ addition.ts, average.ts, base-conversion.ts ...
│  │  │  │  ├─ generate/route.ts
│  │  │  │  ├─ validate/route.ts
│  │  │  │  └─ defs.ts
│  │  │  ├─ main.ts
│  │  │  └─ tags.ts
│  │  ├─ main.ts
│  │  └─ util.ts
│  ├─ (ui)/ # UI Pages (cheatsheets, credits, sandbox etc...)
│  ├─ layout.tsx
│  └─ page.tsx
├─ cpn/ # Common components
├─ db/ # Databse handling
├─ i18n/ # Multiple language frontend handling
└─ utils/ # Miscellaneous

```

## 📄 License

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.
