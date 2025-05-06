# ✨ Bimowy

<div align="center">
   
A "Khan Academy"-inspired project to help everyone be able to train in any math domain they want to.

</div>

## 🎥 Demo

<div align="center">

https://github.com/user-attachments/assets/ddbd267b-fe8d-4730-ac4e-6f33e84167a0

</div>
If you don't like using your mouse like me, just press <code>Shift</code> to change selection, then <code>Enter</code> and the website will know what to do (Start/Next/Try again/End..) 

## ⚙️ Setup

1. Clone the repository using `git clone`, with Github
   Desktop or with the green download button on top.
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open your browser and visit `http://localhost:3000`

## 🤝 Contributing

Feel free to fork the repository and create pull requests.
Please make sure to make meaningful commits. Performance or
bug fixes are welcome. Barely useful pull requests just for
the same of making one will not be accepted.

## 📁 Architecture

Only the src/ directory is important for you to know about.

```plaintext
src/                             # Main folder
├─ app/                           # App router
│  ├─ api/                         # API
│  │  ├─ db/                        # Database of all exercises
│  │  ├─ .../route.ts               # API Routes.
│  │  ├─ db.ts                      # Global database class instance
│  │  └─ defs.ts & util.ts          # All class prototypes and types.
│  ├─ .../                        # Different routes & pages
│  ├─ layout.tsx                  # Main layout with sidebar on the left
│  ├─ not-found.tsx               # 404 page
│  ├─ opengraph-image.png         # Google view page
│  ├─ page.tsx                    # Main "/" page
│  └─ style.css
└─ components/                   # Global Components
   └─ Bloc.tsx & SideBar.tsx

```

## 📄 License

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.
