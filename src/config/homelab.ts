// Homelab panel on the home page. Each node renders as a row with status
// and short role. Keep the list short — prefer 4–6 rows.

export const homelab = [
  { name: 'proxmox',   role: 'hypervisor',           status: 'up' },
  { name: 'arr-stack', role: 'media automation',     status: 'up' },
  { name: 'wireguard', role: 'vpn — always home',    status: 'up' },
  { name: 'npm',       role: 'nginx proxy manager',  status: 'up' },
  { name: 'romm',      role: 'retro roms library',   status: 'up' },
  { name: 'pi-hole',   role: 'dns / adblock',        status: 'up' },
] as const;

export type HomelabNode = (typeof homelab)[number];
