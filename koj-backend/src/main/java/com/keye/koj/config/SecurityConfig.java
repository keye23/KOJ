package com.keye.koj.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 将 BCryptPasswordEncoder 注入到 Spring 容器中，供业务代码使用
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // strength=10 是默认值，也是安全与性能的平衡选择
        return new BCryptPasswordEncoder(10);
    }

    /**
     * 配置安全策略：放行所有请求，不启用认证拦截
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) // 所有请求均允许访问
                .csrf(csrf -> csrf.disable()); // 可根据需要禁用 CSRF 保护
        return http.build();
    }
}
