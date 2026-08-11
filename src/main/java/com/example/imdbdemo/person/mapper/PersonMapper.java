package com.example.imdbdemo.person.mapper;

import com.example.imdbdemo.person.dto.PersonDTO;
import com.example.imdbdemo.person.dto.PersonProfessionDTO;
import com.example.imdbdemo.person.dto.PersonTitleDTO;
import com.example.imdbdemo.person.entity.Person;
import com.example.imdbdemo.profession.dto.ProfessionDTO;
import com.example.imdbdemo.profession.mapper.ProfessionMapper;
import com.example.imdbdemo.title.dto.TitleDTO;
import com.example.imdbdemo.title.mapper.TitleMapper;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PersonMapper {

	private final TitleMapper titleMapper;
	private final ProfessionMapper professionMapper;

	public Person mapToEntity(PersonDTO personDTO) {
		Person person = new Person();
		BeanUtils.copyProperties(personDTO, person);
		return person;
	}

	public PersonDTO mapToDto(Person person) {
		PersonDTO personDTO = new PersonDTO();
		BeanUtils.copyProperties(person, personDTO);
		return personDTO;
	}

	public List<Person> mapToEntityList(List<PersonDTO> personDTOList) {
		return personDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<PersonDTO> mapToDtoList(List<Person> personList) {
		return personList.stream().map(this::mapToDto).toList();
	}

	public List<PersonDTO> mapToDtoList(
		List<Person> personList,
		List<PersonTitleDTO> knownForTitleList,
		List<PersonProfessionDTO> professionList
	) {
		Map<Long, List<TitleDTO>> titlesByPerson = knownForTitleList
			.stream()
			.collect(
				Collectors.groupingBy(
					PersonTitleDTO::getPersonId,
					Collectors.mapping(PersonTitleDTO::getTitleDTO, Collectors.toList())
				)
			);

		Map<Long, List<ProfessionDTO>> professionsByPerson = professionList
			.stream()
			.collect(
				Collectors.groupingBy(
					PersonProfessionDTO::getPersonId,
					Collectors.mapping(PersonProfessionDTO::getProfessionDTO, Collectors.toList())
				)
			);

		return personList
			.stream()
			.map((person) -> {
				PersonDTO dto = mapToDto(person);
				dto.setKnownForTitles(titlesByPerson.getOrDefault(person.getId(), List.of()));
				dto.setKnownForProfessions(professionsByPerson.getOrDefault(person.getId(), List.of()));
				return dto;
			})
			.toList();
	}
}
