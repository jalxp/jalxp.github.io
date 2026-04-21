---
name: "homelab"
tagline: "one proxmox box, too many services"
kind: "homelab"
year: "ongoing"
status: "live"
tech: ["Proxmox", "Docker", "WireGuard", "Nginx Proxy Manager", "Pi-hole", "RomM", "arr stack"]
description: "Everything I don't want to rent, running on one box in the corner. Half the point is owning the infrastructure. The other half is tinkering."
order: 20
---

A server that's slowly replacing services I used to pay for.

## What's running

- **Proxmox** — hypervisor. Everything else is a VM or an LXC.
- **arr stack** — Sonarr / Radarr / Prowlarr / Bazarr wired together for media automation.
- **WireGuard** — VPN back home. Every device treats the house network as local, wherever I am.
- **Nginx Proxy Manager** — TLS termination and a single UI for all the reverse proxies.
- **RomM** — catalog + web UI for my ROM library, accessible from anywhere.
- **Pi-hole** — network-wide DNS ad-blocker. Also handy logs for "why is my TV phoning home."

## Why

Because owning your infrastructure means nothing breaks on someone else's
schedule. And because tinkering is the point.
