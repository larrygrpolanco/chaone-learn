import type { Move } from '../../types';
import { addStudent } from './add_student';
import { setNationality } from './set_nationality';
import { setYear } from './set_year';
import { updateNationality } from './update_nationality';
import { updateYear } from './update_year';
import { recallNationality } from './recall_nationality';
import { recallYear } from './recall_year';
import { recallSharedNationality } from './recall_shared_nationality';
import { recallSharedYear } from './recall_shared_year';

export const lesson1Moves: Move[] = [
	addStudent,
	setNationality,
	setYear,
	updateNationality,
	updateYear,
	recallNationality,
	recallYear,
	recallSharedNationality,
	recallSharedYear
];
