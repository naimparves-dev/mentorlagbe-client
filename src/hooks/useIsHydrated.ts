"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `true` once the component has hydrated on the client, and `false`
 * during SSR / the hydration render.
 *
 * Prefer this over the `useEffect(() => setState(true))` pattern: it needs no
 * effect, so it cannot trigger a cascading render, and it satisfies the
 * `react-hooks/set-state-in-effect` rule.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
