package com.myproj.CadMed.Controller;

import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    public record DadosAutenticacao(String email, String senha) {}

    // 1. Criamos um record para os dados do utilizador
    public record UsuarioResponseDTO(String id, String email, String nome, String role) {}

    // 2. Atualizamos o record do Token para incluir o utilizador
    public record DadosTokenJWT(String token, UsuarioResponseDTO usuario) {}

    @PostMapping("/login")
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        if (authentication.getPrincipal() instanceof Usuario usuario) {
            var tokenJWT = tokenService.gerarToken(usuario);

            // Alterado aqui: em vez de usuario.getNome(), passamos uma string vazia ""
            var usuarioResponse = new UsuarioResponseDTO(
                    usuario.getId().toString(),
                    usuario.getEmail(),
                    "",
                    usuario.getRole().name()
            );

            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, usuarioResponse));
        }

        return ResponseEntity.badRequest().build();
    }

}