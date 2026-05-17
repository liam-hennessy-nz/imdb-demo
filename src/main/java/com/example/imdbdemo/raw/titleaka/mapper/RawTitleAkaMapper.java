package com.example.imdbdemo.raw.titleaka.mapper;

import com.example.imdbdemo.raw.titleaka.dto.RawTitleAkaDTO;
import com.example.imdbdemo.raw.titleaka.entity.RawTitleAka;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

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
		List<RawTitleAka> rawTitleAkaList = new ArrayList<>();
		for (RawTitleAkaDTO rawTitleAkaDTO : rawTitleAkaDTOList) {
			rawTitleAkaList.add(mapToEntity(rawTitleAkaDTO));
		}
		return rawTitleAkaList;
	}

	public List<RawTitleAkaDTO> mapToDtoList(List<RawTitleAka> rawTitleAkaList) {
		List<RawTitleAkaDTO> rawTitleAkaDTOList = new ArrayList<>();
		for (RawTitleAka rawTitleAka : rawTitleAkaList) {
			rawTitleAkaDTOList.add(mapToDto(rawTitleAka));
		}
		return rawTitleAkaDTOList;
	}
}
