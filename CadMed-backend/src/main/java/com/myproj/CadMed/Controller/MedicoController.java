package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DadosCadastroMedico;
import com.myproj.CadMed.Model.Medico;
import com.myproj.CadMed.Model.UserRole;
import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.MedicoRepository;
import com.myproj.CadMed.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/medicos")

public class MedicoController {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroMedico dados) {
        if (this.usuarioRepository.findByEmail(dados.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado!");
        }

        String senhaCriptografada = new BCryptPasswordEncoder().encode(dados.senha());
        Usuario novoUsuario = new Usuario(null, dados.email(), senhaCriptografada, UserRole.MEDICO);
        usuarioRepository.save(novoUsuario);

        Medico novoMedico = new Medico();
        novoMedico.setNome(dados.nome());
        novoMedico.setCrm(dados.crm());
        novoMedico.setEspecialidade(dados.especialidade());
        novoMedico.setTelefone(dados.telefone());
        novoMedico.setUsuario(novoUsuario);

        medicoRepository.save(novoMedico);

        return ResponseEntity.ok().body("Médico cadastrado com sucesso!");
    }

    // --- MÉTODOS NOVOS ADICIONADOS AQUI ---

    @GetMapping
    public ResponseEntity<List<Medico>> listar() {
        // Vai à base de dados buscar todos os médicos e envia para o Angular
        return ResponseEntity.ok(medicoRepository.findAll());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable UUID id) {
        // Apaga o médico pelo ID
        medicoRepository.deleteById(id);
        return ResponseEntity.ok().body("Médico removido com sucesso!");
    }
}