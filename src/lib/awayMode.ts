let awayModeState = false;

export function setAwayMode(active: boolean): void {
  awayModeState = !!active;
}

export function isAwayModeActive(): boolean {
  return awayModeState;
}
