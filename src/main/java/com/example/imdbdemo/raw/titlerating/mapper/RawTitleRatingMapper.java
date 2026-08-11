package com.example.imdbdemo.raw.titlerating.mapper;

import com.example.imdbdemo.raw.titlerating.dto.RawTitleRatingDTO;
import com.example.imdbdemo.raw.titlerating.entity.RawTitleRating;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class RawTitleRatingMapper {

	public RawTitleRating mapToEntity(RawTitleRatingDTO rawTitleRatingDTO) {
		RawTitleRating rawTitleRating = new RawTitleRating();
		BeanUtils.copyProperties(rawTitleRatingDTO, rawTitleRating);
		return rawTitleRating;
	}

	public RawTitleRatingDTO mapToDto(RawTitleRating rawTitleRating) {
		RawTitleRatingDTO rawTitleRatingDTO = new RawTitleRatingDTO();
		BeanUtils.copyProperties(rawTitleRating, rawTitleRatingDTO);
		return rawTitleRatingDTO;
	}

	public List<RawTitleRating> mapToEntityList(List<RawTitleRatingDTO> rawTitleRatingDTOList) {
		return rawTitleRatingDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<RawTitleRatingDTO> mapToDtoList(List<RawTitleRating> rawTitleRatingList) {
		return rawTitleRatingList.stream().map(this::mapToDto).toList();
	}
}
