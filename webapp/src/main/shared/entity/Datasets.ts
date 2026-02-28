import { RAW_NAME_BASIC_SCHEMA } from '../../raw/entity/RawNameBasic.ts';
import { RAW_TITLE_AKA_SCHEMA } from '../../raw/entity/RawTitleAka.ts';
import { RAW_TITLE_BASIC_SCHEMA } from '../../raw/entity/RawTitleBasic.ts';
import { RAW_TITLE_CREW_SCHEMA } from '../../raw/entity/RawTitleCrew.ts';
import { RAW_TITLE_EPISODE_SCHEMA } from '../../raw/entity/RawTitleEpisode.ts';
import { RAW_TITLE_PRINCIPAL_SCHEMA } from '../../raw/entity/RawTitlePrincipal.ts';
import { RAW_TITLE_RATING_SCHEMA } from '../../raw/entity/RawTitleRating.ts';

/**
 * Defines the frontend structure required for a dataset column.
 */
export interface ColumnDef {
	type: 'boolean' | 'string' | 'number' | 'date';
	label: string;
}

/**
 * Defines the frontend structure required for a dataset.
 */
export interface DatasetDef {
	column: Record<string, ColumnDef>;
	file: string;
}

/**
 * The runtime schema definition of all IMDB datasets. Used primarily for compile-time structural validation.
 */
export const DATASET_SCHEMA = {
	rawNameBasic: RAW_NAME_BASIC_SCHEMA,
	rawTitleAka: RAW_TITLE_AKA_SCHEMA,
	rawTitleBasic: RAW_TITLE_BASIC_SCHEMA,
	rawTitleCrew: RAW_TITLE_CREW_SCHEMA,
	rawTitleEpisode: RAW_TITLE_EPISODE_SCHEMA,
	rawTitlePrincipal: RAW_TITLE_PRINCIPAL_SCHEMA,
	rawTitleRating: RAW_TITLE_RATING_SCHEMA,
} as const satisfies Record<string, DatasetDef>;

export type DatasetSchemas = typeof DATASET_SCHEMA;
export type DatasetKey = keyof DatasetSchemas;

export type Datasets = { [K in DatasetKey]: TypeFromSchema<DatasetSchemas[K]> };

export type ColumnMapFor<K extends DatasetKey> = DatasetSchemas[K]['column'];
export type ColumnKeyFor<K extends DatasetKey> = keyof ColumnMapFor<K>;

interface ColumnTypeMap {
	string: string;
	number: number;
	boolean: boolean;
	date: Date;
}
/**
 * Generate an object type given a dataset schema. Within the schema, each column will have been assigned its own type.
 * This is mapped against {@link ColumnTypeMap} to ensure correct types for all properties of the generated object type.
 */
export type TypeFromSchema<D extends DatasetDef> = { [K in keyof D['column']]: ColumnTypeMap[D['column'][K]['type']] };
/**
 * Generate an object type given a dataset key. Utilises {@link TypeFromSchema} to map to the correct type.
 */
export type TypeFromDatasetKey<K extends DatasetKey> = TypeFromSchema<DatasetSchemas[K]>;

type InferLabel<T> = T extends { label: infer L } ? L : never;
/**
 * Type which includes all labels that exist within a dataset corresponding to the specified type parameter. Uses
 * {@link InferLabel} to only extract columns which have a label property (this is actually true for all columns but
 * linter cannot be sure due to the nature of a Record).
 */
export type LabelFor<K extends DatasetKey> = InferLabel<DatasetSchemas[K]['column'][keyof DatasetSchemas[K]['column']]>;

export function labelsFor(datasetKey: DatasetKey) {
	return Object.values(DATASET_SCHEMA[datasetKey].column).map((c: ColumnDef) => c.label);
}
