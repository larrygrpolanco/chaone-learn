import { loadWorld } from '$lib/server/world/state';

const DEV_LEARNER = 'dev_learner';

export async function load() {
	const world = await loadWorld(DEV_LEARNER);
	const rows = world.entities
		.filter((e) => e.kind === 'character')
		.map((e) => ({ id: e.id, attrs: world.attrsByEntity[e.id] ?? {} }))
		.filter((c) => c.attrs.name && (c.attrs.nationality || c.attrs.year))
		.map((c) => ({
			name: c.attrs.name,
			nationality: c.attrs.nationality ?? '',
			year: c.attrs.year ?? ''
		}));
	return { rows };
}
