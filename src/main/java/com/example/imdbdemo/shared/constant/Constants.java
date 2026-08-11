package com.example.imdbdemo.shared.constant;

import com.example.imdbdemo.alias.entity.QAlias;
import com.example.imdbdemo.character.entity.QCharacter;
import com.example.imdbdemo.genre.entity.QGenre;
import com.example.imdbdemo.person.entity.QPerson;
import com.example.imdbdemo.profession.entity.QProfession;
import com.example.imdbdemo.raw.namebasic.entity.QRawNameBasic;
import com.example.imdbdemo.raw.titleaka.entity.QRawTitleAka;
import com.example.imdbdemo.raw.titlebasic.entity.QRawTitleBasic;
import com.example.imdbdemo.raw.titleepisode.entity.QRawTitleEpisode;
import com.example.imdbdemo.raw.titleprincipal.entity.QRawTitlePrincipal;
import com.example.imdbdemo.raw.titlerating.entity.QRawTitleRating;
import com.example.imdbdemo.title.entity.QTitle;

public class Constants {

	// QClasses
	public static final QRawNameBasic RAW_NAME_BASIC = QRawNameBasic.rawNameBasic;
	public static final QRawTitleAka RAW_TITLE_AKA = QRawTitleAka.rawTitleAka;
	public static final QRawTitleBasic RAW_TITLE_BASIC = QRawTitleBasic.rawTitleBasic;
	public static final QRawTitleEpisode RAW_TITLE_EPISODE = QRawTitleEpisode.rawTitleEpisode;
	public static final QRawTitlePrincipal RAW_TITLE_PRINCIPAL = QRawTitlePrincipal.rawTitlePrincipal;
	public static final QRawTitleRating RAW_TITLE_RATING = QRawTitleRating.rawTitleRating;
	public static final QAlias ALIAS = QAlias.alias;
	public static final QCharacter CHARACTER = QCharacter.character;
	public static final QGenre GENRE = QGenre.genre;
	public static final QPerson PERSON = QPerson.person;
	public static final QProfession PROFESSION = QProfession.profession;
	public static final QTitle TITLE = QTitle.title;

	// Parameters
	public static final String PARAM_PAGE = "page";
	public static final String PARAM_SIZE = "size";
	public static final String PARAM_SORT = "sort";
	public static final String PARAM_INCLUDE = "include";

	// Operators
	public static final String OP_DEFAULT = "eq";
	public static final String OP_EMPTY = "isEmpty";
	public static final String OP_NOT_EMPTY = "isNotEmpty";
	public static final String OP_ANY_OF = "isAnyOf";
	public static final String OP_CONTAINS = "contains";
	public static final String OP_NOT_CONTAINS = "doesNotContain";
	public static final String OP_EQUALS = "equals";
	public static final String OP_NOT_EQUALS = "doesNotEqual";
	public static final String OP_STARTS_WITH = "startsWith";
	public static final String OP_ENDS_WITH = "endsWith";
	public static final String OP_EQ = "=";
	public static final String OP_NE = "!=";
	public static final String OP_GT = ">";
	public static final String OP_GOE = ">=";
	public static final String OP_LT = "<";
	public static final String OP_LOE = "<=";
	public static final String OP_IS = "is";
	public static final String OP_IS_NOT = "not";
	public static final String OP_AFTER = "after";
	public static final String OP_ON_OR_AFTER = "onOrAfter";
	public static final String OP_BEFORE = "before";
	public static final String OP_ON_OR_BEFORE = "onOrBefore";
}
