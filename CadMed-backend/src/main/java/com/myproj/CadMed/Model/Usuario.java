package com.myproj.CadMed.Model;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Entity
public class Usuario implements UserDetails {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Override
    @Nonnull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRole.MEDICO) {
            return List.of(new SimpleGrantedAuthority("ROLE_MEDICO"), new SimpleGrantedAuthority("ROLE_PACIENTE"));
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_PACIENTE"));
        }
    }


    @Override
    @Nullable
    public String getPassword() {
        return this.senha;
    }

    // 3. Qual é o nome de usuário (login)? No nosso caso é o e-mail.
    @Override
    @Nonnull
    public String getUsername() {
        return this.email;
    }

    // 4. A conta está ativa e não bloqueada? (Vamos colocar tudo 'true' para liberar)
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}