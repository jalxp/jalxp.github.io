---
name: "Æther"
tagline: "a pi for learning how wireless works"
kind: "side"
year: "ongoing"
status: "in-progress"
tech: ["Raspberry Pi", "Linux", "Python"]
description: "A small Raspberry Pi I use to learn how Wi-Fi actually behaves — mapping my own home network's coverage and understanding the radio layer, hands-on."
order: 60
---

A tiny Linux box I use as a hands-on way to understand wireless networking.

## What it's for

Wireless makes a lot more sense once you can see it instead of reading about it.
The Pi is a learning bench for exactly that:

- **Coverage mapping** — walking my own home network to see where signal is
  strong, where it drops, and why. Useful for deciding where an access point
  actually belongs.
- **Understanding the radio layer** — how channels, bands, and signal strength
  behave in a real space, as opposed to the tidy version in a textbook.
- **A Python playground** — small scripts for logging and charting what I
  observe on my own network, so the data turns into something I can reason
  about.

## Why

I learn infrastructure best by owning it and poking at it. The same instinct
behind the [homelab](/projects/homelab/) applies here: understand the thing you
depend on. This stays firmly on the "learn how my own network works" side of
the line — no one else's networks, no attacks, just curiosity about the radio
waves already passing through the room.

## Status

Hardware is set up; the software is a small, growing set of scripts for
measuring and visualising coverage. Getting tidier over time.
