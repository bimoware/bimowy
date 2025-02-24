import src.defs as defs

# Clear the console
defs.clear_console()
while True:
    # Get questions (asking the user recursively for the folder until the gen.py is found)
    questions = defs.get_questions(5)
    # Initialise the quiz
    quiz = defs.Quiz(questions)
    # Start the quiz
    quiz.start()
    # Ask the user if they want to continue
    if not defs.ask_if_stop():
        break
