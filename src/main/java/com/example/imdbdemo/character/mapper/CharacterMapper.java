package com.example.imdbdemo.character.mapper;

import com.example.imdbdemo.character.dto.CharacterDTO;
import com.example.imdbdemo.character.entity.Character;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class CharacterMapper {

	public Character mapToEntity(CharacterDTO characterDTO) {
		Character character = new Character();
		BeanUtils.copyProperties(characterDTO, character);
		return character;
	}

	public CharacterDTO mapToDto(Character character) {
		CharacterDTO characterDTO = new CharacterDTO();
		BeanUtils.copyProperties(character, characterDTO);
		return characterDTO;
	}

	public List<Character> mapToEntityList(List<CharacterDTO> characterDTOList) {
		return characterDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<CharacterDTO> mapToDtoList(List<Character> characterList) {
		return characterList.stream().map(this::mapToDto).toList();
	}
}
