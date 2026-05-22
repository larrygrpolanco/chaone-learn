import type { WorldState } from '$lib/content/lessons/types';
import { listEntitiesByKind, type EntityKind } from './entities';
import { listAttributesForEntity } from './facts';

const KINDS: EntityKind[] = ['character', 'location', 'object'];

export async function loadWorld(learnerId: string): Promise<WorldState> {
	const all = (await Promise.all(KINDS.map((k) => listEntitiesByKind(learnerId, k)))).flat();
	const attrsByEntity: Record<string, Record<string, string>> = {};
	for (const e of all) {
		attrsByEntity[e.id] = await listAttributesForEntity(learnerId, e.id);
	}
	return {
		entities: all.map((e) => ({
			id: e.id,
			kind: e.kind,
			source: e.source as 'textbook' | 'learner'
		})),
		attrsByEntity
	};
}
