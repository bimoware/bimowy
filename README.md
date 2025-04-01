_⚠️ Project is still in work. Don't expect any login functionality or functionality ⚠️_

# ✨ Bimowy

A Khan Academy inspired project to help everyone be able to train in any math domain they want to.

## ⭐ Star History (i live for stars) (yes even thought it's not working yet)

[![Star History Chart](https://api.star-history.com/svg?repos=bimoware/bimowy#gh-light-mode-only)](https://star-history.com/#bimoware/bimowy#gh-light-mode-only)
[![Star History Chart](https://api.star-history.com/svg?repos=bimoware/bimowy&theme=dark#gh-dark-mode-only)](https://star-history.com/#bimoware/bimowy#gh-dark-mode-only)

## 🎥 Demo

https://github.com/user-attachments/assets/2164fda3-8869-4577-a07e-2e7be444c8f9

## 📁 File Structure

```plaintext
src/
└─ app/
   ├─ api/
   │  ├─ exercises/
   │  │  ├─ db.ts              # Database exercises
   │  │  ├─ defs.ts            # Definitions and types for exercises
   │  │  └─ route.ts           # API route for getting all exercises data
   │  ├─ generate/
   │  │  └─ route.ts           # API Route to generate an exercise from it's ID
   │  └─ validate/
   │     └─ route.ts           # API Route for validating an exercise's answers
   ├─ exercises/
   │  ├─ [exercise_id]/
   │  │  └─ page.tsx           # Page for displaying a specific exercise
   │  └─ page.tsx              # List page for exercises
   ├─ layout.tsx               # Layout for the application
   ├─ not-found.tsx            # Custom 404 page
   ├─ page.tsx                 # Main page for the app
   └─ style.css                # Global styles for the app (Tailwindcss)
```

## ⚙️ Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/bimoware/bimowy
    cd bimowy
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and visit `http://localhost:3000`.

## 🛠️ API Endpoints

### /api/exercises

-   Description: Fetch all exercises.
-   Method: `GET`

### /api/generate

-   Description: Generate (5 by default) exercises for a specific exercise.
-   Method: `POST`
-   Body:
    -   `exercise_id`: string (ID of the exercise to generate questions for)
    -   `n`: number (Optional) The number of questions to generate (default is 5)
-   Response:
    -   Returns an array of generated questions for the specified exercise.

### /api/validate

-   Description: Validate user input for exercises.
-   Method: `POST`
-   Body:
    -   `exercise_id`: string (ID of the exercise to validate answers for)
    -   `answers`: array (Answers submitted for the exercise)
    -   `seed`: string or number (Seed used to generate the exercise, may vary for each user or session)
-   Response:
    -   Returns the validation result, which could include whether the answers are correct or not.

## 🤝 Contributing

Feel free to fork the repository and create pull requests. Please make sure to make meaningful commits. Performance or bug fixes are welcome. Random commits will not be accepted.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
