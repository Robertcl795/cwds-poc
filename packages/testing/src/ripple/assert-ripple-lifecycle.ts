export function assertRippleLayer(host: HTMLElement): void {
  if (!host.querySelector('.cv-ripple-layer')) {
    throw new Error('Missing .cv-ripple-layer element');
  }
}
