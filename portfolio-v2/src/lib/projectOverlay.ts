// Tiny pub/sub so any component (ProjectCard, cube ExpandedView) can open
// a themed project overlay, and the overlay mount point can subscribe
// without lifting state into a context.

type Listener = (projectId: string | null) => void;

const listeners = new Set<Listener>();

export function openProject(id: string | null): void {
  listeners.forEach((cb) => cb(id));
}

export function closeProject(): void {
  listeners.forEach((cb) => cb(null));
}

export function subscribeProject(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
