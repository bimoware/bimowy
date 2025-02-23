import random

def get_question():
    n1 = random.randint(0, 101)
    n2 = random.randint(0, 101)
    return {
        "question": f"{n1} + {n2} = ?",
        "choices": [
            str(n1 + n2),
            str(n1 + n2 + 1),
            str(n1 + n2 - 10),
            str(n1 + n2 + n1 % 2),
            str(abs(n1 + n2 - n1 // 2)),
            str(abs(n1 + n2 + n1 // 2)),
            str(abs(n1 + 2*n2)),
        ],
        "answer_i": 0,
    }
