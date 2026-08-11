package com.example.imdbdemo.raw.namebasic.mapper;

import com.example.imdbdemo.raw.namebasic.dto.RawNameBasicDTO;
import com.example.imdbdemo.raw.namebasic.entity.RawNameBasic;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

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
		return rawNameBasicDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<RawNameBasicDTO> mapToDtoList(List<RawNameBasic> rawNameBasicList) {
		return rawNameBasicList.stream().map(this::mapToDto).toList();
	}
}
