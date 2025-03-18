# Bimowy
A Khan Academy inspired project to help everyone be able to train in any math domain they want to.

## File Structure

```plaintext
src/
└─ app/
   ├─ api/
   │  ├─ exercices/
   │  │  ├─ db.ts              # Database exercices
   │  │  ├─ defs.ts            # Definitions and types for exercices
   │  │  └─ route.ts           # API route for getting all exercices data
   │  ├─ generate/
   │  │  └─ route.ts           # API Route to generate an exercice from it's ID
   │  └─ validate/
   │     └─ route.ts           # API Route for validating an exercice's answers
   ├─ exercices/
   │  ├─ [exercice_id]/
   │  │  └─ page.tsx           # Page for displaying a specific exercice
   │  └─ page.tsx              # List page for exercices
   ├─ layout.tsx               # Layout for the application
   ├─ not-found.tsx            # Custom 404 page
   ├─ page.tsx                 # Main page for the app
   └─ style.css                # Global styles for the app (Tailwindcss)
```

## Setup

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

## API Endpoints

### /api/exercices
- Description: Fetch all exercices.
- Method: `GET`

### /api/generate
- Description: Generate (5 by default) exercices for a specific exercice.
- Method: `POST`
- Body:
    - `exercice_id`: string (ID of the exercice to generate questions for)
    - `n`: number (Optional) The number of questions to generate (default is 5)
- Response:
    - Returns an array of generated questions for the specified exercice.

### /api/validate
- Description: Validate user input for exercices.
- Method: `POST`
- Body:
    - `exercice_id`: string (ID of the exercice to validate answers for)
    - `answers`: array (Answers submitted for the exercice)
    - `seed`: string or number (Seed used to generate the exercice, may vary for each user or session)
- Response:
    - Returns the validation result, which could include whether the answers are correct or not.


## Contributing

Feel free to fork the repository and create pull requests. Please make sure to make meaningful commits. Performance or bug fixes are welcome. Random commits will not be accepted.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.