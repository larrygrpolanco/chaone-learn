# ADR 0001 — Flat schema over EAV fact-log

**Status**: Accepted  
**Date**: 2026-05-24

## Context

The previous design used an append-only EAV fact-log (entities + attribute_facts + relation_facts) to model the learner's world. This was designed to be maximally flexible and additive across all seven lessons. In practice, it added significant complexity before any content existed, made queries indirect, and contributed to a build that grew unwieldy before shipping.

## Decision

Use flat columns per lesson scope. A `characters` table with typed columns for the attributes a lesson actually introduces (e.g., `name`, `year`, `nationality` for lesson 1). Add columns or related tables only when a specific lesson demands it.

## Consequences

- Queries are direct and readable from day one
- Schema migrations are required when new lessons introduce new attributes — accepted cost
- The EAV model remains a valid future migration path if the schema becomes unmanageable at scale
- Losing the append-only provenance log — updates overwrite rather than supersede
