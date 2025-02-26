import random

def get_random_int(difficulty: int) -> int:
    ranges = [(1,10),(10,100),(100,1000),(1000,10000)]
    return random.randint(*ranges[difficulty])