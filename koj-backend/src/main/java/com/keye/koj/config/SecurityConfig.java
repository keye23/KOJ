package com.keye.koj.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 关键修复：显式设置 Session 管理策略为 IF_REQUIRED
                // 表示“如果已有 Session 就复用，不主动创建或清理”，不干预原生 HttpSession
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                // 放行所有请求（不拦截任何接口）
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                // 禁用 CSRF（纯后端接口通常需要关掉）
                .csrf(csrf -> csrf.disable());
        return http.build();
    }
}