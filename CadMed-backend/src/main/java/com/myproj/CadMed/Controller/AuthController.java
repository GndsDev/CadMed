package com.myproj.CadMed.Controller;

import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Model.UserRole;
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
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // DTOs movidos para dentro da classe para resolver o erro de visibilidade
    public record DadosAutenticacao(String email, String senha) {}
    public record DadosRegistro(String email, String senha, UserRole role) {}
    public record DadosTokenJWT(String token) {}

    @PostMapping("/login")
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        // Checagem de segurança para evitar o aviso de que pode ser nulo
        if (authentication.getPrincipal() instanceof Usuario usuario) {
            var tokenJWT = tokenService.gerarToken(usuario);
            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/registrar")
    public ResponseEntity<String> registrar(@RequestBody DadosRegistro dados) {
        if (repository.findByEmail(dados.email()).isPresent()) {
            return ResponseEntity.badRequest().body("E-mail já registrado!");
        }

        String senhaCriptografada = passwordEncoder.encode(dados.senha());

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(dados.email());
        novoUsuario.setSenha(senhaCriptografada);
        novoUsuario.setRole(dados.role());

        repository.save(novoUsuario);

        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }
}