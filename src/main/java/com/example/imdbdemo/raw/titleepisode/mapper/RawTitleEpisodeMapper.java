package com.example.imdbdemo.raw.titleepisode.mapper;

import com.example.imdbdemo.raw.titleepisode.dto.RawTitleEpisodeDTO;
import com.example.imdbdemo.raw.titleepisode.entity.RawTitleEpisode;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class RawTitleEpisodeMapper {

	public RawTitleEpisode mapToEntity(RawTitleEpisodeDTO rawTitleEpisodeDTO) {
		RawTitleEpisode rawTitleEpisode = new RawTitleEpisode();
		BeanUtils.copyProperties(rawTitleEpisodeDTO, rawTitleEpisode);
		return rawTitleEpisode;
	}

	public RawTitleEpisodeDTO mapToDto(RawTitleEpisode rawTitleEpisode) {
		RawTitleEpisodeDTO rawTitleEpisodeDTO = new RawTitleEpisodeDTO();
		BeanUtils.copyProperties(rawTitleEpisode, rawTitleEpisodeDTO);
		return rawTitleEpisodeDTO;
	}

	public List<RawTitleEpisode> mapToEntityList(List<RawTitleEpisodeDTO> rawTitleEpisodeDTOList) {
		return rawTitleEpisodeDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<RawTitleEpisodeDTO> mapToDtoList(List<RawTitleEpisode> rawTitleEpisodeList) {
		return rawTitleEpisodeList.stream().map(this::mapToDto).toList();
	}
}
