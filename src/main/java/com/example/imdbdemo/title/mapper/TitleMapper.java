package com.example.imdbdemo.title.mapper;

import com.example.imdbdemo.title.dto.TitleDTO;
import com.example.imdbdemo.title.entity.Title;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class TitleMapper {

	public Title mapToEntity(TitleDTO titleDTO) {
		Title title = new Title();
		BeanUtils.copyProperties(titleDTO, title);
		return title;
	}

	public TitleDTO mapToDto(Title title) {
		TitleDTO titleDTO = new TitleDTO();
		BeanUtils.copyProperties(title, titleDTO);
		return titleDTO;
	}

	public List<Title> mapToEntityList(List<TitleDTO> titleDTOList) {
		return titleDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<TitleDTO> mapToDtoList(List<Title> titleList) {
		return titleList.stream().map(this::mapToDto).toList();
	}
}
