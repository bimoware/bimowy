import random

def fix_question_v1(n1,n2,sum):
    return {
        "type": 0,
        "question": f"{n1} + {n2} =",
        "answer": sum,
    }


def get_random_int():
    n = random.random()
    if n < 0.3:
        return random.randint(1, 10)
    elif n < 0.6:
        return random.randint(10, 100)
    elif n < 0.8:
        return random.randint(100, 1000)
    else:
        return random.randint(1000, 10000)
def get_question():
    n1,n2 = get_random_int(),get_random_int()
    sum = n1 + n2
    return fix_question_v1(n1,n2,sum)
