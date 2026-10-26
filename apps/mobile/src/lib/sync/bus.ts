type Listener = () => void;

const animalListeners = new Set<Listener>();
const eventListeners = new Set<Listener>();

export function onAnimalsDataChanged(listener: Listener): () => void {
  animalListeners.add(listener);
  return () => {
    animalListeners.delete(listener);
  };
}

export function onEventsDataChanged(listener: Listener): () => void {
  eventListeners.add(listener);
  return () => {
    eventListeners.delete(listener);
  };
}

export function emitAnimalsDataChanged(): void {
  for (const listener of animalListeners) listener();
}

export function emitEventsDataChanged(): void {
  for (const listener of eventListeners) listener();
}
