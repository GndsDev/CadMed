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
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    public record DadosAutenticacao(String email, String senha) {}
    public record DadosTokenJWT(String token) {}

    @PostMapping("/login")
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        if (authentication.getPrincipal() instanceof Usuario usuario) {
            var tokenJWT = tokenService.gerarToken(usuario);
            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
        }

        return ResponseEntity.badRequest().build();
    }
}