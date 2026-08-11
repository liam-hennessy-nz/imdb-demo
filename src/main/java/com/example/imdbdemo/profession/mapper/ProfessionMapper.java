package com.example.imdbdemo.profession.mapper;

import com.example.imdbdemo.profession.dto.ProfessionDTO;
import com.example.imdbdemo.profession.entity.Profession;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class ProfessionMapper {

	public Profession mapToEntity(ProfessionDTO professionDTO) {
		Profession profession = new Profession();
		BeanUtils.copyProperties(professionDTO, profession);
		return profession;
	}

	public ProfessionDTO mapToDto(Profession profession) {
		ProfessionDTO professionDTO = new ProfessionDTO();
		BeanUtils.copyProperties(profession, professionDTO);
		return professionDTO;
	}

	public List<Profession> mapToEntityList(List<ProfessionDTO> professionDTOList) {
		return professionDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<ProfessionDTO> mapToDtoList(List<Profession> professionList) {
		return professionList.stream().map(this::mapToDto).toList();
	}
}
