package com.example.imdbdemo.raw.titleprincipal.mapper;

import com.example.imdbdemo.raw.titleprincipal.dto.RawTitlePrincipalDTO;
import com.example.imdbdemo.raw.titleprincipal.entity.RawTitlePrincipal;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RawTitlePrincipalMapper {
	public RawTitlePrincipal mapToEntity(RawTitlePrincipalDTO rawTitlePrincipalDTO) {
		RawTitlePrincipal rawTitlePrincipal = new RawTitlePrincipal();
		BeanUtils.copyProperties(rawTitlePrincipalDTO, rawTitlePrincipal);
		return rawTitlePrincipal;
	}

	public RawTitlePrincipalDTO mapToDto(RawTitlePrincipal rawTitlePrincipal) {
		RawTitlePrincipalDTO rawTitlePrincipalDTO = new RawTitlePrincipalDTO();
		BeanUtils.copyProperties(rawTitlePrincipal, rawTitlePrincipalDTO);
		return rawTitlePrincipalDTO;
	}

	public List<RawTitlePrincipal> mapToEntityList(List<RawTitlePrincipalDTO> rawTitlePrincipalDTOList) {
		List<RawTitlePrincipal> rawTitlePrincipalList = new ArrayList<>();
		for (RawTitlePrincipalDTO rawTitlePrincipalDTO : rawTitlePrincipalDTOList) {
			rawTitlePrincipalList.add(mapToEntity(rawTitlePrincipalDTO));
		}
		return rawTitlePrincipalList;
	}

	public List<RawTitlePrincipalDTO> mapToDtoList(List<RawTitlePrincipal> rawTitlePrincipalList) {
		List<RawTitlePrincipalDTO> rawTitlePrincipalDTOList = new ArrayList<>();
		for (RawTitlePrincipal rawTitlePrincipal : rawTitlePrincipalList) {
			rawTitlePrincipalDTOList.add(mapToDto(rawTitlePrincipal));
		}
		return rawTitlePrincipalDTOList;
	}
}
