export interface UseItem {
  name: string;
  note?: string;
}

export interface UseGroup {
  key: string;
  title: string;
  subtitle?: string;
  items: UseItem[];
}

export const uses: UseGroup[] = [
  {
    key: 'daily',
    title: 'daily driver',
    subtitle: 'what I sit in front of most days',
    items: [
      { name: 'MacBook Pro M4 Pro 48GB', note: 'work horse' },
      { name: 'Ducky One 2 Horizon Blue' },
      { name: 'Beyerdynamic DT 1770 Pro', note: 'desk' },
      { name: 'AirPods Pro 3', note: 'away from the desk' },
    ],
  },
  {
    key: 'editor',
    title: 'editor / tooling',
    items: [
      { name: 'Xcode' },
      { name: 'RocketSim',    note: 'simulator, less painful' },
      { name: 'Proxyman',     note: 'http debugging' },
      { name: 'Postman',      note: 'api pokes' },
      { name: 'Cyberduck',    note: 'sftp + cloud storage' },
      { name: 'GitKraken',    note: 'git, visualised' },
      { name: 'Sublime Text', note: 'scratchpad' },
    ],
  },
  {
    key: 'homelab',
    title: 'homelab',
    subtitle: 'the box in the corner and what runs on it',
    items: [
      { name: 'Proxmox VE',          note: 'hypervisor' },
      { name: 'Pi-hole',             note: 'dns + network-wide adblock' },
      { name: 'Nginx Proxy Manager', note: 'reverse proxy + TLS' },
      { name: 'Portainer',           note: 'container management' },
      { name: 'arr stack',           note: 'media automation (docker lxc)' },
      { name: 'RomM',                note: 'retro ROM library' },
    ],
  },
  {
    key: 'services',
    title: 'services',
    items: [
      { name: 'Cloudflare', note: 'dns + cdn' },
      { name: 'GitHub',     note: 'code' },
    ],
  },
];
