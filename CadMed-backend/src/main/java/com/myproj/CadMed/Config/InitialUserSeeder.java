package com.myproj.CadMed.Config;

import com.myproj.CadMed.Model.UserRole;
import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class InitialUserSeeder {

    @Value("${app.bootstrap.user.enabled:false}")
    private boolean enabled;

    @Value("${app.bootstrap.user.email:}")
    private String email;

    @Value("${app.bootstrap.user.password:}")
    private String password;

    @Value("${app.bootstrap.user.role:SECRETARIA}")
    private String role;

    @Bean
    CommandLineRunner createInitialUser(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (!enabled || email.isBlank() || password.isBlank()) {
                return;
            }

            if (usuarioRepository.findByEmail(email).isPresent()) {
                return;
            }

            Usuario usuario = new Usuario();
            usuario.setEmail(email);
            usuario.setSenha(passwordEncoder.encode(password));
            usuario.setRole(UserRole.valueOf(role.toUpperCase()));

            usuarioRepository.save(usuario);
        };
    }
}
