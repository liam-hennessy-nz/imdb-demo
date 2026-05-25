package com.example.imdbdemo.raw.titlerating.mapper;

import com.example.imdbdemo.raw.titlerating.dto.RawTitleRatingDTO;
import com.example.imdbdemo.raw.titlerating.entity.RawTitleRating;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RawTitleRatingMapper {
	public RawTitleRating toEntity(RawTitleRatingDTO rawTitleRatingDTO) {
		RawTitleRating rawTitleRating = new RawTitleRating();
		BeanUtils.copyProperties(rawTitleRatingDTO, rawTitleRating);
		return rawTitleRating;
	}

	public RawTitleRatingDTO toDto(RawTitleRating rawTitleRating) {
		RawTitleRatingDTO rawTitleRatingDTO = new RawTitleRatingDTO();
		BeanUtils.copyProperties(rawTitleRating, rawTitleRatingDTO);
		return rawTitleRatingDTO;
	}

	public List<RawTitleRating> toEntityList(List<RawTitleRatingDTO> rawTitleRatingDTOList) {
		List<RawTitleRating> rawTitleRatingList = new ArrayList<>();
		for (RawTitleRatingDTO rawTitleRatingDTO : rawTitleRatingDTOList) {
			rawTitleRatingList.add(toEntity(rawTitleRatingDTO));
		}
		return rawTitleRatingList;
	}

	public List<RawTitleRatingDTO> toDtoList(List<RawTitleRating> rawTitleRatingList) {
		List<RawTitleRatingDTO> rawTitleRatingDTOList = new ArrayList<>();
		for (RawTitleRating rawTitleRating : rawTitleRatingList) {
			rawTitleRatingDTOList.add(toDto(rawTitleRating));
		}
		return rawTitleRatingDTOList;
	}
}
