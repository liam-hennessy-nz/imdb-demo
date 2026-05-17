package com.example.imdbdemo.raw.namebasic.mapper;

import com.example.imdbdemo.raw.namebasic.dto.RawNameBasicDTO;
import com.example.imdbdemo.raw.namebasic.entity.RawNameBasic;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RawNameBasicMapper {
	public RawNameBasic mapToEntity(RawNameBasicDTO rawNameBasicDTO) {
		RawNameBasic rawNameBasic = new RawNameBasic();
		BeanUtils.copyProperties(rawNameBasicDTO, rawNameBasic);
		return rawNameBasic;
	}

	public RawNameBasicDTO mapToDto(RawNameBasic rawNameBasic) {
		RawNameBasicDTO rawNameBasicDTO = new RawNameBasicDTO();
		BeanUtils.copyProperties(rawNameBasic, rawNameBasicDTO);
		return rawNameBasicDTO;
	}

	public List<RawNameBasic> mapToEntityList(List<RawNameBasicDTO> rawNameBasicDTOList) {
		List<RawNameBasic> rawNameBasicList = new ArrayList<>();
		for (RawNameBasicDTO rawNameBasicDTO : rawNameBasicDTOList) {
			rawNameBasicList.add(mapToEntity(rawNameBasicDTO));
		}
		return rawNameBasicList;
	}

	public List<RawNameBasicDTO> mapToDtoList(List<RawNameBasic> rawNameBasicList) {
		List<RawNameBasicDTO> rawNameBasicDTOList = new ArrayList<>();
		for (RawNameBasic rawNameBasic : rawNameBasicList) {
			rawNameBasicDTOList.add(mapToDto(rawNameBasic));
		}
		return rawNameBasicDTOList;
	}
}
