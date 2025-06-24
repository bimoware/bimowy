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

The architecture of the website is still changing a lot since this is not yet complete. This is not up to date.

```plaintext
src/
├─ app/
│  ├─ (ui)/
│  │  ├─ cheatsheets/
│  │  │  └─ [cheatsheet_id]/
│  │  ├─ credits/
│  │  ├─ login/
│  │  ├─ sandbox/
│  │  │  └─ [exercise_id]/
│  │  ├─ test/
│  │  └─ user/
│  ├─ api/
│  │  ├─ lib/
│  │  ├─ resources/
│  │  │  ├─ [id]/ # API Routes (generate/validate)
│  │  │  ├─ list/ # All resources data (exercises, cheatsheets)
│  │  │  └─ handler.ts
│  │  └─ main.ts
│  ├─ layout.tsx, page.tsx, style.css ...
├─ cpn/
├─ db/
├─ i18n/
├─ utils/
└─ middleware.ts
```

## 📄 License

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.
