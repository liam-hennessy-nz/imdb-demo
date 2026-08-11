package com.example.imdbdemo.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;

@Configuration
public class PageableConfig {

	@Bean
	PageableHandlerMethodArgumentResolverCustomizer pageableCustomizer() {
		return (resolver) -> {
			resolver.setMaxPageSize(100);
			resolver.setOneIndexedParameters(false);
			resolver.setFallbackPageable(PageRequest.of(0, 10));
		};
	}
}
