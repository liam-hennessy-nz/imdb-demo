package com.example.imdbdemo.alias.mapper;

import com.example.imdbdemo.alias.dto.AliasDTO;
import com.example.imdbdemo.alias.entity.Alias;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class AliasMapper {

	public Alias mapToEntity(AliasDTO aliasDTO) {
		Alias alias = new Alias();
		BeanUtils.copyProperties(aliasDTO, alias);
		return alias;
	}

	public AliasDTO mapToDto(Alias alias) {
		AliasDTO aliasDTO = new AliasDTO();
		BeanUtils.copyProperties(alias, aliasDTO);
		return aliasDTO;
	}

	public List<Alias> mapToEntityList(List<AliasDTO> aliasDTOList) {
		return aliasDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<AliasDTO> mapToDtoList(List<Alias> aliasList) {
		return aliasList.stream().map(this::mapToDto).toList();
	}
}
