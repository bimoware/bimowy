_⚠️ Project is still in work. ⚠️_

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

https://github.com/user-attachments/assets/b61f1f80-0e6d-4089-a054-9f2ef34c1119

</div>

## 📁 File Structure

```plaintext
src/
└─ app/
   ├─ api/                     # API routes (generate, exercices & validate)
   ├─ exercises/               # Exercise list
   │  ├─ page.tsx
   │  └─ [exercise_id]/        # Specific exercise
   │     └─ page.tsx
   ├─ layout.tsx               # Universal Layout
   ├─ not-found.tsx            # Universal 404 page
   ├─ page.tsx                 # Main page
   └─ style.css                # Styling of the websute (Tailwindcss-focused)
```

## ⚙️ Setup

1. Clone the repository using `git clone`, with Github Desktop or with the green
   download button on top.
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open your browser and visit `http://localhost:3000`

## 🛠️ API Endpoints

- /api/exercises

```md
- Description: Fetch all exercises.
- Method: `GET`
```

- /api/generate

```md
- Description: Generate (5 by default) exercises for a specific exercise.
- Method: `POST`
- Body:
  - `exercise_id`: string (ID of the exercise to generate questions for)
  - `n`: number (Optional) The number of questions to generate (default is 5)
- Response:
  - Returns an array of generated questions for the specified exercise.
```

- /api/validate

```md
- Description: Validate user input for exercises.
- Method: `POST`
- Body:
  - `exercise_id`: string (ID of the exercise to validate answers for)
  - `answers`: array (Answers submitted for the exercise)
  - `seed`: string or number (Seed used to generate the exercise, may vary for
    each user or session)
- Response:
  - Returns the validation result, which could include whether the answers are
    correct or not.
```

## 🤝 Contributing

Feel free to fork the repository and create pull requests. Please make sure to
make meaningful commits. Performance or bug fixes are welcome. Random commits
will not be accepted.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
