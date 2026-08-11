package com.example.imdbdemo.person.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.PERSON;

import com.example.imdbdemo.person.dto.PersonDTO;
import com.example.imdbdemo.person.dto.PersonProfessionDTO;
import com.example.imdbdemo.person.dto.PersonTitleDTO;
import com.example.imdbdemo.person.entity.Person;
import com.example.imdbdemo.person.exception.PersonNotFoundException;
import com.example.imdbdemo.person.mapper.PersonMapper;
import com.example.imdbdemo.person.repository.PersonJpaRepository;
import com.example.imdbdemo.profession.service.ProfessionService;
import com.example.imdbdemo.shared.constant.TableEnum;
import com.example.imdbdemo.title.service.TitleService;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.ArrayList;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

@Service
@RequiredArgsConstructor
public class PersonService {

	private final PersonJpaRepository personJpaRepository;
	private final TitleService titleService;
	private final ProfessionService professionService;
	private final JPAQueryFactory queryFactory;
	private final PersonMapper personMapper;

	public Page<PersonDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		List<String> includes = toIncludes(params);
		Predicate predicate = PersonHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, PERSON);

		// Get results and result count for page
		List<Person> personList = selectAll(queryFactory, PERSON, predicate, orderSpecifiers, pageable);
		long total = countAll(queryFactory, PERSON, predicate);

		List<PersonTitleDTO> knownForTitleList = new ArrayList<>();
		List<PersonProfessionDTO> professionList = new ArrayList<>();

		// Append nested lists if requested
		boolean includeKnownForTitles = includes.contains(TableEnum.TITLE.getValue());
		boolean includeProfessions = includes.contains(TableEnum.PROFESSION.getValue());

		if (includeKnownForTitles || includeProfessions) {
			List<Long> idList = personList.stream().map(Person::getId).toList();

			if (includeKnownForTitles) {
				knownForTitleList.addAll(titleService.findAllByKnownForPersonId(idList));
			}
			if (includeProfessions) {
				professionList.addAll(professionService.findAllByPersonId(idList));
			}
		}

		List<PersonDTO> content = personMapper.mapToDtoList(personList, knownForTitleList, professionList);

		return new PageImpl<>(content, pageable, total);
	}

	public PersonDTO findById(@NonNull Long id) {
		Person person = personJpaRepository
			.findById(id)
			.orElseThrow(() -> new PersonNotFoundException("id", String.valueOf(id)));
		return personMapper.mapToDto(person);
	}
}
