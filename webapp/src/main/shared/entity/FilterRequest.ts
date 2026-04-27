interface StringFilterConstraint {
	matchMode: 'eq' | 'ne' | 'sw' | 'ew' | 'ct' | 'nc';
	value: string;
}

interface NumberFilterConstraint {
	matchMode: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte';
	value: number;
}

interface DateFilterConstraint {
	matchMode: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'bt';
	value: Date;
}

export type SortConstraint = 1 | -1;
export type FilterConstraint = StringFilterConstraint | NumberFilterConstraint | DateFilterConstraint;

export type SortType = Partial<Record<string, SortConstraint>>;
export type FilterType = Partial<Record<string, FilterConstraint>>;

export interface FilterRequest {
	number?: number;
	size?: number;
	sort?: SortType;
	filter?: FilterType;
}
