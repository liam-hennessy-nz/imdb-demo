package com.example.imdbdemo.migration;

import com.example.imdbdemo.shared.constant.TableEnum;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class NormaliseQueryConstants {

	// language=PostgreSQL
	private static final String NORMALISE_PERSON = """
	INSERT INTO person (
		nconst,
		name,
		birth_year,
		death_year
	)
	SELECT
		LOWER(TRIM(rnb.nconst)),
		LOWER(NULLIF(TRIM(rnb.primary_name), '')),
		NULLIF(TRIM(rnb.birth_year), '')::SMALLINT,
		NULLIF(TRIM(rnb.death_year), '')::SMALLINT
	FROM raw_name_basic rnb
	WHERE
		rnb.nconst != 'nconst'
		AND NULLIF(TRIM(rnb.nconst), '') IS NOT NULL
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_PERSON_KNOWN_FOR_TITLE = """
	INSERT INTO person_known_for_title (
		known_for_person_id,
		known_for_title_id
	)
	SELECT DISTINCT
		p.id,
		t.id
	FROM raw_name_basic rnb
	CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(rnb.known_for_titles, ',')) kft
	INNER JOIN person p ON LOWER(TRIM(rnb.nconst)) = p.nconst
	INNER JOIN title t ON LOWER(TRIM(kft)) = t.tconst
	WHERE
		rnb.nconst != 'nconst'
		AND NULLIF(TRIM(rnb.known_for_titles), '') IS NOT NULL
		AND TRIM(kft) != ''
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_ALIAS = """
	INSERT INTO alias (
	  title_id,
		ordering,
		name,
		notes,
		is_original
	)
	SELECT
		t.id,
		NULLIF(TRIM(rta.ordering), '')::SMALLINT,
		LOWER(NULLIF(TRIM(rta.title), '')),
		LOWER(NULLIF(TRIM(rta.attributes), '')),
		TRIM(rta.is_original_title) = '1'
	FROM raw_title_aka rta
	INNER JOIN title t ON LOWER(TRIM(rta.tconst)) = t.tconst
	WHERE rta.tconst != 'tconst'
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_REGION = """
	INSERT INTO region (name)
	SELECT DISTINCT LOWER(TRIM(rta.region))
	FROM raw_title_aka rta
	WHERE
		rta.tconst != 'tconst'
		AND NULLIF(TRIM(rta.region), '') IS NOT NULL
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_LANGUAGE = """
	INSERT INTO language (name)
	SELECT DISTINCT LOWER(TRIM(l))
	FROM raw_title_aka rta
	CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(rta.language, ',')) l
	WHERE
		rta.tconst != 'tconst'
		AND NULLIF(TRIM(rta.language), '') IS NOT NULL
		AND TRIM(l) != ''
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_ALIAS_TYPE = """
	INSERT INTO alias_type (name)
	SELECT DISTINCT LOWER(TRIM(t))
	FROM raw_title_aka rta
	CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(rta.types, ',')) t
	WHERE
		rta.tconst != 'tconst'
		AND NULLIF(TRIM(rta.types), '') IS NOT NULL
		AND TRIM(t) != ''
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_TITLE = """
	INSERT INTO title (
		tconst,
		is_adult,
		start_year,
		end_year,
		runtime_minutes
	)
	SELECT
		LOWER(TRIM(tconst)),
		TRIM(is_adult) = '1',
		NULLIF(TRIM(start_year), '')::SMALLINT,
		NULLIF(TRIM(end_year), '')::SMALLINT,
		NULLIF(TRIM(runtime_minutes), '')::INTEGER
	FROM raw_title_basic
	WHERE
		tconst != 'tconst'
		AND NULLIF(TRIM(tconst), '') IS NOT NULL
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_TITLE_TYPE = """
	INSERT INTO title_type (name)
	SELECT DISTINCT LOWER(TRIM(rtb.title_type))
	FROM raw_title_basic rtb
	WHERE
		rtb.tconst != 'tconst'
		AND NULLIF(TRIM(rtb.title_type), '') IS NOT NULL
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_GENRE = """
	INSERT INTO genre (name)
	SELECT DISTINCT LOWER(TRIM(g))
	FROM raw_title_basic rtb
	CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(rtb.genres, ',')) g
	WHERE
		rtb.tconst != 'tconst'
		AND NULLIF(TRIM(rtb.genres), '') IS NOT NULL
		AND TRIM(g) != ''
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_EPISODE = """
	INSERT INTO title_episode (
		episode_id,
		parent_id,
		season_number,
		episode_number
	)
	SELECT
		te.id,
		tp.id,
		TRIM(rte.season_number)::INTEGER,
		TRIM(rte.episode_number)::INTEGER
	FROM raw_title_episode rte
	INNER JOIN title te ON LOWER(TRIM(rte.tconst)) = te.tconst
	INNER JOIN title tp ON LOWER(TRIM(rte.parent_tconst)) = tp.tconst
	WHERE rte.tconst != 'tconst'
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_PROFESSION = """
	INSERT INTO profession (
		name
	)
	SELECT DISTINCT LOWER(TRIM(rtp.category))
	FROM raw_title_principal rtp
	WHERE rtp.tconst != 'tconst'
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_PRINCIPAL = """
	INSERT INTO principal (
		person_id,
		title_id,
		profession_id,
		ordering,
		notes
	)
	SELECT
		p.id,
		t.id,
		pr.id,
		NULLIF(TRIM(rtp.ordering), '')::SMALLINT,
		NULLIF(TRIM(rtp.job), '')
	FROM raw_title_principal rtp
	INNER JOIN person p ON LOWER(TRIM(rtp.nconst)) = p.nconst
	INNER JOIN title t ON LOWER(TRIM(rtp.tconst)) = t.tconst
	INNER JOIN profession pr ON LOWER(TRIM(rtp.job)) = pr.name
	WHERE rtp.tconst != 'tconst'
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_PERSON_KNOWN_FOR_PROFESSION = """
	INSERT INTO person_known_for_profession (
		known_for_person_id,
	  known_for_profession_id
	)
	SELECT DISTINCT
		p.id,
		pr.id
	FROM raw_name_basic rnb
	CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(rnb.primary_profession, ',')) pp
	INNER JOIN person p ON LOWER(TRIM(rnb.nconst)) = p.nconst
	INNER JOIN profession pr ON LOWER(TRIM(pp)) = pr.name
	WHERE
		rnb.nconst != 'nconst'
		AND NULLIF(TRIM(rnb.primary_profession), '') IS NOT NULL
		AND TRIM(pp) != ''
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_CHARACTER = """
	INSERT INTO character (
		principal_id,
		ordering,
		name
	)
	SELECT DISTINCT
		pr.id,
		c.ordering,
		LOWER(TRIM(c.character))
	FROM raw_title_principal rtp
	CROSS JOIN LATERAL
		JSONB_ARRAY_ELEMENTS_TEXT(rtp.characters::JSONB)
		WITH ORDINALITY AS c(character, ordering)
	INNER JOIN person p ON LOWER(TRIM(rtp.nconst)) = p.nconst
	INNER JOIN title t ON LOWER(TRIM(rtp.tconst)) = t.tconst
	INNER JOIN principal pr
		ON p.id = pr.person_id
		AND t.id = pr.title_id
	WHERE
		rtp.tconst != 'tconst'
		AND NULLIF(TRIM(rtp.characters), '') IS NOT NULL
		AND TRIM(c.character) != ''
	ON CONFLICT DO NOTHING
	""";

	// language=PostgreSQL
	private static final String NORMALISE_RATING = """
	INSERT INTO rating (
		title_id,
	  average,
	  count
	)
	SELECT
		t.id,
		ROUND(TRIM(rtr.average_rating)::NUMERIC * 10)::SMALLINT,
		TRIM(rtr.num_votes)::INTEGER
	FROM raw_title_rating rtr
	INNER JOIN title t ON LOWER(TRIM(rtr.tconst)) = t.tconst
	WHERE
		rtr.tconst != 'tconst'
		AND NULLIF(TRIM(rtr.tconst), '') IS NOT NULL
		AND NULLIF(TRIM(rtr.average_rating), '') IS NOT NULL
		AND NULLIF(TRIM(rtr.num_votes), '') IS NOT NULL
	ON CONFLICT DO NOTHING
	""";

	public static final Map<TableEnum, String> NORMALISE_RAW_NAME_BASIC;
	public static final Map<TableEnum, String> NORMALISE_RAW_TITLE_AKA;
	public static final Map<TableEnum, String> NORMALISE_RAW_TITLE_BASIC;
	public static final Map<TableEnum, String> NORMALISE_RAW_TITLE_EPISODE;
	public static final Map<TableEnum, String> NORMALISE_RAW_TITLE_PRINCIPAL;
	public static final Map<TableEnum, String> NORMALISE_RAW_TITLE_RATING;

	// Use LinkedHashMap to ensure order of normalisation is maintained during iteration
	static {
		Map<TableEnum, String> rawNameBasic = new LinkedHashMap<>();
		rawNameBasic.put(TableEnum.PERSON, NORMALISE_PERSON);
		rawNameBasic.put(TableEnum.PERSON_KNOWN_FOR_TITLE, NORMALISE_PERSON_KNOWN_FOR_TITLE);
		NORMALISE_RAW_NAME_BASIC = rawNameBasic;

		Map<TableEnum, String> rawTitleAka = new LinkedHashMap<>();
		rawTitleAka.put(TableEnum.ALIAS, NORMALISE_ALIAS);
		rawTitleAka.put(TableEnum.REGION, NORMALISE_REGION);
		rawTitleAka.put(TableEnum.LANGUAGE, NORMALISE_LANGUAGE);
		rawTitleAka.put(TableEnum.ALIAS_TYPE, NORMALISE_ALIAS_TYPE);
		NORMALISE_RAW_TITLE_AKA = rawTitleAka;

		Map<TableEnum, String> rawTitleBasic = new LinkedHashMap<>();
		rawTitleBasic.put(TableEnum.TITLE, NORMALISE_TITLE);
		rawTitleBasic.put(TableEnum.TITLE_TYPE, NORMALISE_TITLE_TYPE);
		rawTitleBasic.put(TableEnum.GENRE, NORMALISE_GENRE);
		NORMALISE_RAW_TITLE_BASIC = rawTitleBasic;

		Map<TableEnum, String> rawTitleEpisode = new LinkedHashMap<>();
		rawTitleEpisode.put(TableEnum.EPISODE, NORMALISE_EPISODE);
		NORMALISE_RAW_TITLE_EPISODE = rawTitleEpisode;

		Map<TableEnum, String> rawTitlePrincipal = new LinkedHashMap<>();
		rawTitlePrincipal.put(TableEnum.PROFESSION, NORMALISE_PROFESSION);
		rawTitlePrincipal.put(TableEnum.PERSON_KNOWN_FOR_PROFESSION, NORMALISE_PERSON_KNOWN_FOR_PROFESSION);
		rawTitlePrincipal.put(TableEnum.PRINCIPAL, NORMALISE_PRINCIPAL);
		rawTitlePrincipal.put(TableEnum.CHARACTER, NORMALISE_CHARACTER);
		NORMALISE_RAW_TITLE_PRINCIPAL = rawTitlePrincipal;

		Map<TableEnum, String> rawTitleRating = new LinkedHashMap<>();
		rawTitleRating.put(TableEnum.RATING, NORMALISE_RATING);
		NORMALISE_RAW_TITLE_RATING = rawTitleRating;
	}
}
