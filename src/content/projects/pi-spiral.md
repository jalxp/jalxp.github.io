---
name: "Pi Spiral"
tagline: "memorise π, one digit at a time"
kind: "ios-app"
year: "2025 → present"
status: "archived"
tech: ["Swift", "SwiftUI", "Core Haptics"]
description: "A small, focused iOS app for memorising the digits of π. A spiral that grows as you recall, three practice modes, daily challenges, and haptics tuned so every tap feels instant."
order: 40
---

A side project born from wanting to build something small and complete in
SwiftUI — and from an interest in how memorisation actually works.

## What it does

Pi Spiral turns memorising π into a game. A spiral grows digit by digit as you
recall them, collapses when you slip, and celebrates the milestones.

- **Three modes** — Classic (a mistake costs a digit), Zen (no penalty), and
  Challenge (a mistake resets the run).
- **Daily challenge** — everyone gets the same target for the day.
- **Progress tracking** — streaks, personal bests, and a GitHub-style activity
  chart.
- **Milestone and session-end celebrations**, with presets from minimal to
  festive.

## Why it's interesting to build

The whole app is tuned around latency. Audio was pulled out entirely because
`AVAudioPlayer` blocked the main thread and added tap delay; feedback is now
haptics-only, re-prepared after each use so it fires instantly. Scroll views
set `delaysContentTouches = false`, buttons trigger on release, and animations
never compute layout bounds inside the animation block. Small app, lots of
detail work.

## Status

Shelved. The MVP is functionally complete and playable, but it's parked now —
my nights went to Drawdown 391 and the studio. Keeping it here as a small,
finished-enough SwiftUI exercise I'm happy with.
