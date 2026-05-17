package com.example.imdbdemo.raw.titlebasic.mapper;

import com.example.imdbdemo.raw.titlebasic.dto.RawTitleBasicDTO;
import com.example.imdbdemo.raw.titlebasic.entity.RawTitleBasic;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

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
		List<RawTitleBasic> rawTitleBasicList = new ArrayList<>();
		for (RawTitleBasicDTO rawTitleBasicDTO : rawTitleBasicDTOList) {
			rawTitleBasicList.add(mapToEntity(rawTitleBasicDTO));
		}
		return rawTitleBasicList;
	}

	public List<RawTitleBasicDTO> mapToDtoList(List<RawTitleBasic> rawTitleBasicList) {
		List<RawTitleBasicDTO> rawTitleBasicDTOList = new ArrayList<>();
		for (RawTitleBasic rawTitleBasic : rawTitleBasicList) {
			rawTitleBasicDTOList.add(mapToDto(rawTitleBasic));
		}
		return rawTitleBasicDTOList;
	}
}
