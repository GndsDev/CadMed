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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pacientes")

public class PacienteController {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroPaciente dados) {
        if (this.usuarioRepository.findByEmail(dados.email()).isPresent()) {
            return ResponseEntity.badRequest().body("E-mail já registado!");
        }

        String senhaCriptografada = new BCryptPasswordEncoder().encode(dados.senha());
        Usuario novoUsuario = new Usuario(null, dados.email(), senhaCriptografada, UserRole.PACIENTE);
        usuarioRepository.save(novoUsuario);

        Paciente novoPaciente = new Paciente();
        novoPaciente.setNome(dados.nome());
        novoPaciente.setCpf(dados.cpf());
        novoPaciente.setTelefone(dados.telefone());
        novoPaciente.setDataNascimento(dados.dataNascimento());
        novoPaciente.setUsuario(novoUsuario);

        pacienteRepository.save(novoPaciente);

        return ResponseEntity.ok().body("Paciente registado com sucesso!");
    }

    // --- MÉTODOS NOVOS ADICIONADOS AQUI ---

    @GetMapping
    public ResponseEntity<List<Paciente>> listar() {
        // Vai à base de dados buscar todos os pacientes e envia para o Angular
        return ResponseEntity.ok(pacienteRepository.findAll());
    }


    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable UUID id) {
        // Apaga o paciente pelo ID
        pacienteRepository.deleteById(id);
        return ResponseEntity.ok().body("Paciente removido com sucesso!");
    }
}