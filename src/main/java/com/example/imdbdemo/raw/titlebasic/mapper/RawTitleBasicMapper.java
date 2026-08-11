package com.example.imdbdemo.raw.titlebasic.mapper;

import com.example.imdbdemo.raw.titlebasic.dto.RawTitleBasicDTO;
import com.example.imdbdemo.raw.titlebasic.entity.RawTitleBasic;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class RawTitleBasicMapper {

	public RawTitleBasic mapToEntity(RawTitleBasicDTO rawTitleBasicDTO) {
		RawTitleBasic rawTitleBasic = new RawTitleBasic();
		BeanUtils.copyProperties(rawTitleBasicDTO, rawTitleBasic);
		return rawTitleBasic;
	}

	public RawTitleBasicDTO mapToDto(RawTitleBasic rawTitleBasic) {
		RawTitleBasicDTO rawTitleBasicDTO = new RawTitleBasicDTO();
		BeanUtils.copyProperties(rawTitleBasic, rawTitleBasicDTO);
		return rawTitleBasicDTO;
	}

	public List<RawTitleBasic> mapToEntityList(List<RawTitleBasicDTO> rawTitleBasicDTOList) {
		return rawTitleBasicDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<RawTitleBasicDTO> mapToDtoList(List<RawTitleBasic> rawTitleBasicList) {
		return rawTitleBasicList.stream().map(this::mapToDto).toList();
	}
}
