#!/usr/bin/env python3
import random
import time

crew = [
    "Captain Rattleshade",
    "Gumball the Whisperer",
    "Bobby Blip",
    "Miss Static",
    "YELLER",
    "Dennis (not here right now)",
]

locations = [
    "Quantum Vault #42",
    "The Cookie Mainframe",
    "That Suspicious Ice Cream Truck",
    "Bank of Emotionally Unavailable Accounts",
    "Fridge behind the firewall",
]

obstacles = [
    "a dancing CAPTCHA",
    "someone changed all the passwords to 🐸 emojis",
    "YELLER got into a shouting match with a lamppost",
    "Miss Static forgot her own plan",
    "Dennis left mid-heist to buy oat milk",
]

outcomes = [
    "They stole the cookies 🍪",
    "They accidentally opened a wormhole 🌀",
    "Everyone’s stuck in an infinite while-loop",
    "They escaped riding spinning chairs",
    "They got hired as bank security consultants",
]


def run_heist():
    print("🧠 Initializing Fragle Heist Simulation...\n")
    time.sleep(1)

    print(f"🎩 Assembling the crew...")
    for member in crew:
        time.sleep(0.5)
        print(f" - {member}... Ready-ish.")

    print("\n🚪 Target Location:")
    target = random.choice(locations)
    print(f"   > {target}")

    print("\n⚠️ Obstacle Encountered:")
    obstacle = random.choice(obstacles)
    print(f"   > {obstacle}")

    print("\n🎲 Heist Outcome:")
    outcome = random.choice(outcomes)
    print(f"   > {outcome}")

    print("\n✨ Simulation Complete. Press 🍪 to reboot.")


if __name__ == "__main__":
    run_heist()
