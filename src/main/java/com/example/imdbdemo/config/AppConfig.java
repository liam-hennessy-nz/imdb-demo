package com.example.imdbdemo.config;

import com.example.imdbdemo.config.props.DatabaseProps;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(DatabaseProps.class)
public class AppConfig {}
