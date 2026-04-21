// Topics João actively goes deep on. Shown on /about.
// Keep this honest — only list things you've actually built / poked at.

export const rabbitHoles = [
  { icon: '▣', key: 'homelab',  desc: 'Proxmox, arr stack, wireguard, pi-hole, romm' },
  { icon: '≋', key: 'networks', desc: 'wardriving, packet poking, "why is my tv phoning home"' },
  { icon: '▦', key: 'retro',    desc: 'Old games via RomM, the 2003 RTS I keep promising myself' },
  { icon: '◈', key: 'gamedev',  desc: 'a 2D top-down RTS in Godot' },
  { icon: '❯', key: 'swift',    desc: 'Swift mostly, Objective-C when the codebase insists. Python for scripts and glue.' },
] as const;

export type RabbitHole = (typeof rabbitHoles)[number];
