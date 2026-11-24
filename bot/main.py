# -*- coding: utf-8 -*-
"""
Новогодний Telegram-бот «2027 от Доктора Алексея Маматова».

Сценарий:
 1. /start -> приветствие + кнопка «🎁 Получить поздравление»
 2. Рандомное пожелание (здоровье / счастье / благополучие) от Доктора Алексея Маматова
    + кнопка «🎰 Участвовать в Новогодней лотерее»
 3. Лотерея: мешок с подарками, оттуда «вылетают» билетики №1..10 (анимация редактированием сообщения)
 4. После выпадения номера — текст «Напишите свой номер билетика сюда» + кнопка
    (позже в неё будет вставлена переадресация на поддержку)

Запуск:
    export BOT_TOKEN="токен_от_BotFather"
    python bot/main.py
"""

import asyncio
import logging
import os
import random

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.constants import ParseMode
from telegram.ext import (
    Application,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
)

import wishes as W

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")

# ---------------------------------------------------------------------------
# Клавиатуры
# ---------------------------------------------------------------------------

def keyboard_wish() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([[
        InlineKeyboardButton("🎰 Участвовать в Новогодней лотерее 🎁", callback_data="lottery"),
    ]])


def keyboard_start() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([[
        InlineKeyboardButton("🎁 Получить поздравление", callback_data="wish"),
    ]])


def keyboard_support() -> InlineKeyboardMarkup:
    """Кнопка «Напишите свой номер билетика сюда».

    TODO: после реализации поддержки заменить callback_data="support"
    на url-кнопку с переадресацией, например:
        InlineKeyboardButton("📩 Написать номер билетика", url="https://t.me/username_support")
    """
    return InlineKeyboardMarkup([[
        InlineKeyboardButton("📩 Напишите свой номер билетика сюда", callback_data="support"),
    ]])


def keyboard_again() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("🔄 Ещё разок!", callback_data="lottery")],
        [InlineKeyboardButton("🎁 Новое поздравление", callback_data="wish")],
    ])


# ---------------------------------------------------------------------------
# Хелперы
# ---------------------------------------------------------------------------

def random_wish() -> str:
    """Случайное пожелание о здоровье, счастье или благополучии."""
    category = random.choice([W.HEALTH_WISHES, W.HAPPY_WISHES, W.SUCCESS_WISHES])
    header = random.choice([
        "🎄 С наступающим Новым 2027 годом! ❄️",
        "🥂 Новый 2027 год уже у порога! 🎆",
        "⛄ Поздравляю с наступающим 2027-м! 🎅",
        "🌟 Куранты вот-вот пробьют двенадцать... 2027 близко! 🕛",
    ])
    body = random.choice(category)
    garland = random.choice(["🔴🟡🟢🔵", "✨🎄✨", "❄️⛄❄️", "🎁🎉🎁"])
    return (
        f"{garland} {header} {garland}\n\n"
        f"{body}\n\n"
        f"{W.AUTHOR_SIGNATURE}"
    )


def snow_decor(text: str) -> str:
    """Добавляет «снега» и «фонариков» к тексту — новогодний дизайн чата."""
    lights = random.choice([
        "💡🔴💡🟢💡🔵💡",
        "🏮✨🏮✨🏮",
        "🔅🎄🔆🎄🔅",
    ])
    return f"❄️  ·  ✦  ·  ❄️\n{lights}\n\n{text}\n\n{lights}\n❄️  ·  ✦  ·  ❄️"


# ---------------------------------------------------------------------------
# Обработчики
# ---------------------------------------------------------------------------

async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat = update.effective_chat
    await chat.send_action("typing")
    await asyncio.sleep(0.6)
    await update.message.reply_text(
        snow_decor(W.GREETING),
        reply_markup=keyboard_start(),
    )


async def on_wish(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    msg = query.message
    # Имитируем «написание» поздравления
    await context.bot.send_chat_action(chat_id=msg.chat_id, action="typing")
    await asyncio.sleep(1.0)
    await msg.edit_text(
        snow_decor(random_wish()),
        reply_markup=keyboard_wish(),
    )


async def on_lottery(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Анимация: мешок с подарками, из которого вылетают билетики №1..10."""
    query = update.callback_query
    await query.answer()
    msg = query.message

    intro_frames = [
        "🎒 Мешок Деда Мороза появляется из-за ёлки... 🎄",
        "🎒🎁 Мешок дрожит — внутри подарки и билетики!",
        W.TICKET_FLYING,
    ]
    for frame in intro_frames:
        await msg.edit_text(snow_decor(frame))
        await asyncio.sleep(0.9)

    # Билетик «крутится»: показываем случайные номера, постепенно замедляясь
    final_number = random.randint(1, 10)
    spin_frames = ["🎫 𝟷..𝟿?", "🎫 💨", "🎫 ✨", "🎫 ❓"] * 3
    for i, frame in enumerate(spin_frames):
        await msg.edit_text(snow_decor(f"{frame}   ...номер крутится..."))
        await asyncio.sleep(0.25 + i * 0.03)

    # Финальный билетик
    emoji = W.TICKET_EMOJIS[final_number]
    result = W.RESULT_TEMPLATE.format(
        number=final_number,
        emoji=emoji,
        congrats=W.CONGRATS_BY_NUMBER[final_number],
    )
    await msg.edit_text(snow_decor(result))
    await asyncio.sleep(1.2)

    # Текст про «напишите номер» + кнопка (будущая переадресация на поддержку)
    await msg.edit_text(
        snow_decor("🎉 Ура! Номер выпал!\n\n" + W.AFTER_RESULT_TEXT),
        reply_markup=keyboard_support(),
    )


async def on_support(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Заглушка кнопки «Напишите свой номер билетика сюда».

    Сюда позже будет вставлена переадресация на поддержку (url-кнопка или deep-link).
    """
    query = update.callback_query
    await query.answer("💬 Переадресация на поддержку появится здесь после реализации!")
    await query.message.reply_text(
        snow_decor(
            "🛠 Эта кнопка зарезервирована под переадресацию на поддержку.\n"
            "После реализации сюда придёт ваш номер билетика. 🎫\n\n"
            "А пока — можешь крутить лотерею ещё раз! 😉"
        ),
        reply_markup=keyboard_again(),
    )


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    logger.error("Exception while handling an update:", exc_info=context.error)


def main():
    if not BOT_TOKEN:
        raise SystemExit(
            "❌ Не задан токен. Экспортируйте переменную окружения BOT_TOKEN:\n"
            '   export BOT_TOKEN="123456:ABC-DEF..." && python bot/main.py'
        )

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CallbackQueryHandler(on_wish, pattern=r"^wish$"))
    app.add_handler(CallbackQueryHandler(on_lottery, pattern=r"^lottery$"))
    app.add_handler(CallbackQueryHandler(on_support, pattern=r"^support$"))
    app.add_error_handler(error_handler)

    logger.info("🎄 Новогодний бот запущен. Ждём гостей со всего света!")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
