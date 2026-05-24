import { listEntitiesByKind } from '$lib/server/world/entities';
import { listAttributesForEntity } from '$lib/server/world/facts';

const DEV_LEARNER = 'dev_learner';

export async function load() {
	const chars = await listEntitiesByKind(DEV_LEARNER, 'character');
	const rows = await Promise.all(
		chars.map(async (c) => ({
			id: c.id,
			source: c.source,
			attrs: await listAttributesForEntity(DEV_LEARNER, c.id)
		}))
	);
	return { rows };
}
