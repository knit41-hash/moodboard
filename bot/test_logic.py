#!/usr/bin/env python3
"""Быстрая проверка логики бота без реального Telegram API."""
import random
import sys, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wishes as W

# Проверка совместимости с main.py (без запуска сети)
random.seed(42)

assert len(W.HEALTH_WISHES) >= 5 and len(W.HAPPY_WISHES) >= 5 and len(W.SUCCESS_WISHES) >= 5
assert set(range(1, 11)) == set(W.CONGRATS_BY_NUMBER.keys())
assert set(range(1, 11)) == set(W.TICKET_EMOJIS.keys())

for n in range(1, 11):
    txt = W.RESULT_TEMPLATE.format(number=n, emoji=W.TICKET_EMOJIS[n], congrats=W.CONGRATS_BY_NUMBER[n])
    assert str(n) in txt

print("=== Пример поздравления ===")
print(random.choice(W.HEALTH_WISHES + W.HAPPY_WISHES + W.SUCCESS_WISHES))
print(W.AUTHOR_SIGNATURE)
print("\n=== Пример результата лотереи ===")
print(W.RESULT_TEMPLATE.format(number=7, emoji=W.TICKET_EMOJIS[7], congrats=W.CONGRATS_BY_NUMBER[7]))
print("\nOK: данные и шаблоны корректны.")
