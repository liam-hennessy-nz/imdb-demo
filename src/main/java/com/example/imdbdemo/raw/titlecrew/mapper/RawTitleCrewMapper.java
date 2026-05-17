package com.example.imdbdemo.raw.titlecrew.mapper;

import com.example.imdbdemo.raw.titlecrew.dto.RawTitleCrewDTO;
import com.example.imdbdemo.raw.titlecrew.entity.RawTitleCrew;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RawTitleCrewMapper {
	public RawTitleCrew mapToEntity(RawTitleCrewDTO rawTitleCrewDTO) {
		RawTitleCrew rawTitleCrew = new RawTitleCrew();
		BeanUtils.copyProperties(rawTitleCrewDTO, rawTitleCrew);
		return rawTitleCrew;
	}

	public RawTitleCrewDTO mapToDto(RawTitleCrew rawTitleCrew) {
		RawTitleCrewDTO rawTitleCrewDTO = new RawTitleCrewDTO();
		BeanUtils.copyProperties(rawTitleCrew, rawTitleCrewDTO);
		return rawTitleCrewDTO;
	}

	public List<RawTitleCrew> mapToEntityList(List<RawTitleCrewDTO> rawTitleCrewDTOList) {
		List<RawTitleCrew> rawTitleCrewList = new ArrayList<>();
			for (RawTitleCrewDTO rawTitleCrewDTO : rawTitleCrewDTOList) {
				rawTitleCrewList.add(mapToEntity(rawTitleCrewDTO));
			}
			return rawTitleCrewList;
	}

	public List<RawTitleCrewDTO> mapToDtoList(List<RawTitleCrew> rawTitleCrewList) {
		List<RawTitleCrewDTO> rawTitleCrewDTOList = new ArrayList<>();
			for (RawTitleCrew rawTitleCrew : rawTitleCrewList) {
				rawTitleCrewDTOList.add(mapToDto(rawTitleCrew));
			}
			return rawTitleCrewDTOList;
	}
}
