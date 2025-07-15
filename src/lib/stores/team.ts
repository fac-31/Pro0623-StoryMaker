import { writable } from 'svelte/store';
import type { Team } from '$lib/models/team.model';

export const teamStore = writable<Team | null>(null);
