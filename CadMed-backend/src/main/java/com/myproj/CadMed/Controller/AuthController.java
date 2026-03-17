package com.myproj.CadMed.Controller;

import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.UsuarioRepository;
import com.myproj.CadMed.Security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    // Injeções adicionadas corretamente no topo da classe!
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public record DadosAutenticacao(String email, String senha) {}
    public record UsuarioResponseDTO(String id, String email, String nome, String role) {}
    public record DadosTokenJWT(String token, UsuarioResponseDTO usuario) {}

    @PostMapping("/login")
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        if (authentication.getPrincipal() instanceof Usuario usuario) {
            var tokenJWT = tokenService.gerarToken(usuario);
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

    @PostMapping("/register")
    public ResponseEntity<?> registarUtilizador(@RequestBody DadosAutenticacao dados) {

        // Verifica se já existe para não duplicar (usando o minúsculo)
        if (usuarioRepository.findByEmail(dados.email()).isPresent()) {
            return ResponseEntity.badRequest().body("O e-mail já está registado!");
        }

        // Cria o utilizador com o Hash perfeito
        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(dados.email());
        novoUsuario.setSenha(passwordEncoder.encode(dados.senha()));
        novoUsuario.setRole(com.myproj.CadMed.Model.UserRole.SECRETARIA);

        // Salva usando a variável minúscula
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok().body("Utilizador criado com sucesso com Hash perfeito!");
    }
}