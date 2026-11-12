export const rabbitHoles = [
  { icon: '▣', key: 'homelab',  desc: 'Proxmox, arr stack, wireguard, pi-hole, romm' },
  { icon: '≋', key: 'networks', desc: 'wifi coverage mapping, learning the radio layer, "why is my tv phoning home"' },
  { icon: '▦', key: 'retro',    desc: 'Old games via RomM, and a PS1-era look for my own horror game' },
  { icon: '◈', key: 'gamedev',  desc: 'Drawdown 391, a low-poly horror game in Godot, plus an on-off RTS' },
  { icon: '❯', key: 'swift',    desc: 'Swift mostly, Objective-C when the codebase insists. Python for scripts and glue.' },
] as const;

export type RabbitHole = (typeof rabbitHoles)[number];
