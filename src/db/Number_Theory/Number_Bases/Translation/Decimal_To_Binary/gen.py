from src.db.Basic_Algebra.topgen import get_random_int
from src.defs import Question


def gen_questions(n_q: int, difficulty: int):
    return [gen_question(difficulty) for _ in range(n_q)]


def gen_question(difficulty: int):
    n = get_random_int(difficulty)
    return Question(f"The decimal number {n} in binary is", 0, bin(n)[2:])


data = {
    "name": "Translation from Decimal to Binary",
    "difficulties": [
        {"name": "Easy", "id": 0},
        {"name": "Medium", "id": 1},
        {"name": "Hard", "id": 2},
        {"name": "Evil", "id": 3},
    ],
    "max_questions": None,
    "gen_questions": gen_questions,
}
