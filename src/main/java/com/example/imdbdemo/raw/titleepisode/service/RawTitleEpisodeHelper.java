package com.example.imdbdemo.raw.titleepisode.service;

import static com.example.imdbdemo.shared.PageHelper.applyStringOperator;
import static com.example.imdbdemo.shared.PageHelper.parseFilters;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_EPISODE;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class RawTitleEpisodeHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "tconst" -> applyStringOperator(booleanBuilder, RAW_TITLE_EPISODE.tconst, operator, value);
				case "parentTconst" -> applyStringOperator(booleanBuilder, RAW_TITLE_EPISODE.parentTconst, operator, value);
				case "seasonNumber" -> applyStringOperator(booleanBuilder, RAW_TITLE_EPISODE.seasonNumber, operator, value);
				case "episodeNumber" -> applyStringOperator(booleanBuilder, RAW_TITLE_EPISODE.episodeNumber, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}
}
