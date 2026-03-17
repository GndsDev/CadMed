package com.myproj.CadMed.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Ativa o CORS com a configuração abaixo
                .csrf(AbstractHttpConfigurer::disable) // Desativa CSRF para APIs que usam Token
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Define autenticação Stateless
                .authorizeHttpRequests(authorize -> authorize

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Rota de Autenticação (Pública)
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()


                        // Rotas de Pacientes
                        .requestMatchers(HttpMethod.POST, "/api/pacientes").hasRole("SECRETARIA") // Permite que pacientes se registem sozinhos
                        .requestMatchers(HttpMethod.GET, "/api/pacientes").hasRole("SECRETARIA") // Apenas Secretaria lista pacientes
                        .requestMatchers(HttpMethod.GET, "/api/pacientes/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/pacientes/**").hasRole("SECRETARIA") // <-- ADICIONADO: Permite Secretaria editar pacientes
                        .requestMatchers(HttpMethod.DELETE, "/api/pacientes/**").authenticated() // Apenas Secretaria remove pacientes

                        // Rotas de Médicos
                        .requestMatchers(HttpMethod.POST, "/api/medicos").hasRole("SECRETARIA") // Apenas Secretaria regista médicos
                        .requestMatchers(HttpMethod.GET, "/api/medicos").hasRole("SECRETARIA") // Apenas Secretaria lista médicos
                        .requestMatchers(HttpMethod.GET, "/api/medicos/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/medicos/**").hasRole("SECRETARIA") // <-- ADICIONADO: Permite Secretaria editar médicos
                        .requestMatchers(HttpMethod.DELETE, "/api/medicos/**").hasRole("SECRETARIA") // Apenas Secretaria remove médicos

                        // Rotas de Agendamentos
                        .requestMatchers(HttpMethod.POST, "/api/agendamentos").hasRole("SECRETARIA") // Agendamento via Secretaria
                        .requestMatchers(HttpMethod.GET, "/api/agendamentos").authenticated() // Visualização da agenda total
                        .requestMatchers(HttpMethod.DELETE, "/api/agendamentos/**").authenticated() // Cancelamento via Secretaria
                        .requestMatchers(HttpMethod.PATCH, "/api/agendamentos/*/status").authenticated()

                        // Todas as outras rotas exigem autenticação genérica
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class) // Adiciona o filtro do Token JWT
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Define as origens permitidas (Localhost de dev, containerizado e IP de Produção)
        configuration.setAllowedOrigins(List.of("http://localhost:4200", "http://localhost", "http://34.31.241.110"));
        configuration.setAllowedMethods(Arrays.asList("GET","PATCH", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}