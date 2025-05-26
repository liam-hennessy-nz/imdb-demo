package com.example.imdbdemo.mappers.imdb;

import com.example.imdbdemo.dtos.imdb.ImdbNameBasicDTO;
import com.example.imdbdemo.entities.imdb.ImdbNameBasic;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ImdbNameBasicMapper {

	public ImdbNameBasic mapToEntity(ImdbNameBasicDTO imdbNameBasicDTO) {
		ImdbNameBasic imdbNameBasic = new ImdbNameBasic();
		BeanUtils.copyProperties(imdbNameBasicDTO, imdbNameBasic);
		return imdbNameBasic;
	}

	public ImdbNameBasicDTO mapToDto(ImdbNameBasic imdbNameBasic) {
		ImdbNameBasicDTO imdbNameBasicDTO = new ImdbNameBasicDTO();
		BeanUtils.copyProperties(imdbNameBasic, imdbNameBasicDTO);
		return imdbNameBasicDTO;
	}

	public List<ImdbNameBasic> mapToEntityList(List<ImdbNameBasicDTO> imdbNameBasicDTOList) {
		List<ImdbNameBasic> imdbNameBasicList = new ArrayList<>();
		for (ImdbNameBasicDTO imdbNameBasicDTO : imdbNameBasicDTOList) {
			ImdbNameBasic imdbNameBasic = new ImdbNameBasic();
			BeanUtils.copyProperties(imdbNameBasicDTO, imdbNameBasic);
			imdbNameBasicList.add(imdbNameBasic);
		}
		return imdbNameBasicList;
	}

	public List<ImdbNameBasicDTO> mapToDtoList(List<ImdbNameBasic> imdbNameBasicList) {
		List<ImdbNameBasicDTO> imdbNameBasicDTOList = new ArrayList<>();
		for (ImdbNameBasic imdbNameBasic : imdbNameBasicList) {
			ImdbNameBasicDTO imdbNameBasicDTO = new ImdbNameBasicDTO();
			BeanUtils.copyProperties(imdbNameBasic, imdbNameBasicDTO);
			imdbNameBasicDTOList.add(imdbNameBasicDTO);
		}
		return imdbNameBasicDTOList;
	}
}
