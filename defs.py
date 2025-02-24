from InquirerPy import prompt
import os
import subprocess
from random import shuffle
from pprint import pprint  # Debugging
import importlib.util
import sys


def choose_reward_text(score: float):
    """
    Choose the encouraging text based on the score.
    """
    rewards = {
        60: "🤗 Still some work to do...",
        70: "👏 Getting there..",
        80: "👍 Good job.",
        90: "✨ So close to perfection!!",
        100: "🔥 Perfect.",
    }

    for reward_score, reward_text in rewards.items():
        if score < reward_score:
            return reward_text
    return rewards[100]


def display_score(total: int, correct: int):
    """
    Display the score in a progress bar format.
    """
    bar_length = None

    if total < 20:
        bar_length = total
    else:
        bar_length = 20
    percentage = (correct / total) * 100
    filled = int((correct / total) * bar_length)
    bar = "🟢" * filled + "🔴" * (bar_length - filled)
    text = choose_reward_text(percentage)

    print(f"{bar} {correct}/{total} ({percentage:.0f}%): {text}")


class Question:
    """
    A class to represent a single quiz question.
    """

    def __init__(
        self,
        question: str,
        type: int,  # 0: Input, 1: MCQ, 2: Y/N
        answer: int,
        choices: list[str] = None,
    ):
        self.question = question
        self.type = type
        self.answer = answer
        self.choices = choices

    def ask(self):
        """
        Keeps asking the question until the user gets it right.

        Returns True if the user gets it right on the first try.
        """
        correct_on_first_try = None
        while True:
            prompt_question = {
                "message": self.question,
                "invalid_message": "❌ Incorrect. Try again.",
            }

            if self.type == 0:
                prompt_question["type"] = "input"
            elif self.type == 1:
                questions = self.choices[:]
                shuffle(questions)
                prompt_question["type"] = "list"
                prompt_question["choices"] = questions
            elif self.type == 2:
                prompt_question["type"] = "confirm"
            result = prompt([prompt_question])[0]
            correct = result == str(self.answer)

            if correct_on_first_try is None:
                correct_on_first_try = correct

            if correct:
                print("✅\n")
                break
            else:
                print("❌ Incorrect; Try again.\n")
                continue
        return correct_on_first_try


class Quiz:
    """
    A class to represent a quiz (multiple questions).
    """

    def __init__(self, questions: list[Question]):
        self.questions = questions

    def start(self):
        total_q = len(self.questions)
        correct_q = 0
        for question in self.questions:
            correct = question.ask()
            correct_q += 1 if correct == True else 0
        display_score(total_q, correct_q)


def clear_console():
    """
    Clear the console.
    """
    subprocess.run("cls" if os.name == "nt" else "clear", shell=True)


def ask_if_stop():
    """
    Ask the user if they want to stop the quiz.
    """
    return prompt(
        questions=[
            {
                "type": "confirm",
                "message": "Do you want to continue exercising?",
                "default": True,
            }
        ],
    )[0]


def get_questions(n: int):
    """
    Shows the user recursively the tree of the file db/ until they get to a folder with a single "gen.py" file. Then runs the file
    """
    questions = []
    path = find_gen_py("db")
    if not path:
        print("No gen.py file found.")
        return questions
    get_question = execute_python_file(path)

    for _ in range(n):
        questions.append(Question(**get_question()))

    return questions


def find_gen_py(path):
    """
    Recursively find the gen.py file in the given folder.
    """
    # List all directories and files in the current path
    items = os.listdir(path)

    # Filter so to only get directories
    directories = [
        item
        for item in items
        if "_" not in item and os.path.isdir(os.path.join(path, item))
    ]

    # If there are no directories just check for gen.py file
    if not directories:
        if "gen.py" in items:
            return os.path.join(path, "gen.py")
        return None

    choice = prompt(
        [
            {
                "message": "Choose a directory:",
                "type": "list",
                "choices": [f"{directory}" for directory in directories],
                "default": None,
            }
        ]
    )[0]

    next_path = os.path.join(path, choice)
    return find_gen_py(next_path)  # Recurse into the selected folder


def execute_python_file(file_path):
    """
    Execute the given python file and return the appropriate get_question function.
    """
    # Load the module from the given file path
    spec = importlib.util.spec_from_file_location("module.name", file_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules["module.name"] = module  # Add to sys.modules
    spec.loader.exec_module(module)  # Execute the module
    return module.get_question


# In case defs.py is run instead of main.py
if __name__ == "__main__":
    import main
