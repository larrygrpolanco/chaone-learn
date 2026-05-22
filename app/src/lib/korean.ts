// Returns true when the last character ends with a final consonant (받침).
export function hasBatchim(s: string): boolean {
	if (!s) return false;
	const ch = s.charCodeAt(s.length - 1);
	if (ch < 0xac00 || ch > 0xd7a3) return false;
	return (ch - 0xac00) % 28 !== 0;
}

export function topicMarker(name: string): '은' | '는' {
	return hasBatchim(name) ? '은' : '는';
}
