import defs

defs.clear_console()
while True:
    questions = defs.get_questions(5)
    quiz = defs.Quiz(questions)
    quiz.start()
    if not defs.ask_if_stop():
        break
