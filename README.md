# ✨ Bimowy

<div align="center">
   
A "Khan Academy"-inspired project to help everyone be able to train in any math domain they want to.

</div>

## ⭐ Star History (i love stars)

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=bimoware/bimowy&type=Date)](https://www.star-history.com/#bimoware/bimowy&Date)

</div>

## 🎥 Demo

<div align="center">

https://github.com/user-attachments/assets/ddbd267b-fe8d-4730-ac4e-6f33e84167a0

</div>
If you don't like using your mouse like me, just press <code>Enter</code> and the website will know what to do (Start/Next/Try again/End)

## ⚙️ Setup

1. Clone the repository using `git clone`, with Github
   Desktop or with the green download button on top.
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open your browser and visit `http://localhost:3000`

## 🤝 Contributing

Feel free to fork the repository and create pull requests. Please make sure to make meaningful commits. Performance or bug fixes are welcome. Barely useful pull requests just for the same of making one will not be accepted.

## 📁 File Structure

Only the src/ directory is important for you to know about.
```plaintext
src/                             # Main folder
├─ app/                           # App router (where all the /subdomains/ are)
│  ├─ api/                         # API
│  │  ├─ db/                        # Database of all exercises
│  │  ├─ exercises/route.ts         # GET /api/exercises - Get a list of all available exercises.
│  │  ├─ generate/route.ts          # POST /api/generate - Generate a list of n exercises given the exercise ID
│  │  ├─ validate/route.ts          # GET /api/validate - Validates the user answer(s)
│  │  ├─ db.ts                      # Global database class instance
│  │  └─ defs.ts                    # All class prototypes and types.
│  ├─ credits/                    # Credits page - Show the owner (me, bimoware), my frameworks, inspiration..
│  │  └─ layout.tsx & page.tsx
│  ├─ exercises/                  # Exercises page - Lists all the exercises available
│  │  ├─ [exercise_id]/            # Exercise page - Start a specific exercise
│  │  │  └─ layout.tsx & page.tsx
│  │  └─ layout.tsx & page.tsx
│  ├─ test/                       # Test page (whatever really)
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ layout.tsx
│  ├─ not-found.tsx               # 404 page
│  ├─ opengraph-image.png         # Google view page
│  ├─ page.tsx
│  └─ style.css
└─ components/                   # Global Components
   ├─ Bloc.tsx
   └─ SideBar.tsx

```

## 🛠️ API Endpoints

- /api/exercises

```md
- Description: Fetch all exercises.
- Method: `GET`
```

- /api/generate

```md
- Description: Generate (5 by default) exercises for a
  specific exercise.
- Method: `POST`
- Body:
  - `exercise_id`: string (ID of the exercise to generate
    questions for)
  - `n`: number (Optional) The number of questions to
    generate (default is 5)
- Response:
  - Returns an array of generated questions for the
    specified exercise.
```

- /api/validate

```md
- Description: Validate user input for exercises.
- Method: `POST`
- Body:
  - `exercise_id`: string (ID of the exercise to validate
    answers for)
  - `answers`: array (Answers submitted for the exercise)
  - `seed`: string or number (Seed used to generate the
    exercise, may vary for each user or session)
- Response:
  - Returns the validation result, which could include
    whether the answers are correct or not.
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
