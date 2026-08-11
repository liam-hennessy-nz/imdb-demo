package com.example.imdbdemo.raw.titleprincipal.mapper;

import com.example.imdbdemo.raw.titleprincipal.dto.RawTitlePrincipalDTO;
import com.example.imdbdemo.raw.titleprincipal.entity.RawTitlePrincipal;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

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
		return rawTitlePrincipalDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<RawTitlePrincipalDTO> mapToDtoList(List<RawTitlePrincipal> rawTitlePrincipalList) {
		return rawTitlePrincipalList.stream().map(this::mapToDto).toList();
	}
}
