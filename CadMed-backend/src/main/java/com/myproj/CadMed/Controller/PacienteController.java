package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DadosCadastroPaciente;
import com.myproj.CadMed.Model.Paciente;
import com.myproj.CadMed.Model.UserRole;
import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.PacienteRepository;
import com.myproj.CadMed.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    @Transactional // Se falhar a criação do paciente, a criação do utilizador é revertida
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroPaciente dados) {

        // 1. Verifica se o e-mail já existe
        if (this.usuarioRepository.findByEmail(dados.email()).isPresent()) {
            return ResponseEntity.badRequest().body("E-mail já registado!");
        }

        // 2. Cria o Utilizador (Login) com o perfil de PACIENTE
        String senhaCriptografada = new BCryptPasswordEncoder().encode(dados.senha());
        Usuario novoUsuario = new Usuario(null, dados.email(), senhaCriptografada, UserRole.PACIENTE);
        usuarioRepository.save(novoUsuario);

        // 3. Cria o Paciente e associa-o ao utilizador
        Paciente novoPaciente = new Paciente();
        novoPaciente.setNome(dados.nome());
        novoPaciente.setCpf(dados.cpf());
        novoPaciente.setTelefone(dados.telefone());
        novoPaciente.setDataNascimento(dados.dataNascimento());
        novoPaciente.setUsuario(novoUsuario);

        pacienteRepository.save(novoPaciente);

        return ResponseEntity.ok().body("Paciente registado com sucesso!");
    }
}