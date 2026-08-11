package com.example.imdbdemo.raw.titleaka.mapper;

import com.example.imdbdemo.raw.titleaka.dto.RawTitleAkaDTO;
import com.example.imdbdemo.raw.titleaka.entity.RawTitleAka;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class RawTitleAkaMapper {

	public RawTitleAka mapToEntity(RawTitleAkaDTO rawTitleAkaDTO) {
		RawTitleAka rawTitleAka = new RawTitleAka();
		BeanUtils.copyProperties(rawTitleAkaDTO, rawTitleAka);
		return rawTitleAka;
	}

	public RawTitleAkaDTO mapToDto(RawTitleAka rawTitleAka) {
		RawTitleAkaDTO rawTitleAkaDTO = new RawTitleAkaDTO();
		BeanUtils.copyProperties(rawTitleAka, rawTitleAkaDTO);
		return rawTitleAkaDTO;
	}

	public List<RawTitleAka> mapToEntityList(List<RawTitleAkaDTO> rawTitleAkaDTOList) {
		return rawTitleAkaDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<RawTitleAkaDTO> mapToDtoList(List<RawTitleAka> rawTitleAkaList) {
		return rawTitleAkaList.stream().map(this::mapToDto).toList();
	}
}
