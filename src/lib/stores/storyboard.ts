import { writable } from 'svelte/store';
import type { Storyboard } from '$lib/models/storyboard.model';

export const storyboardStore = writable<Storyboard | null>(null);