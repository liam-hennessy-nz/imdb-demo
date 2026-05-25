package com.example.imdbdemo.raw.titleepisode.mapper;

import com.example.imdbdemo.raw.titleepisode.dto.RawTitleEpisodeDTO;
import com.example.imdbdemo.raw.titleepisode.entity.RawTitleEpisode;
import java.util.ArrayList;
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
		List<RawTitleEpisode> rawTitleEpisodeList = new ArrayList<>();
		for (RawTitleEpisodeDTO rawTitleEpisodeDTO : rawTitleEpisodeDTOList) {
			rawTitleEpisodeList.add(mapToEntity(rawTitleEpisodeDTO));
		}
		return rawTitleEpisodeList;
	}

	public List<RawTitleEpisodeDTO> mapToDtoList(List<RawTitleEpisode> rawTitleEpisodeList) {
		List<RawTitleEpisodeDTO> rawTitleEpisodeDTOList = new ArrayList<>();
		for (RawTitleEpisode rawTitleEpisode : rawTitleEpisodeList) {
			rawTitleEpisodeDTOList.add(mapToDto(rawTitleEpisode));
		}
		return rawTitleEpisodeDTOList;
	}
}
