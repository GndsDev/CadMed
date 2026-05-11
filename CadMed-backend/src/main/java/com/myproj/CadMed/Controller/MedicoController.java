package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DadosCadastroMedico;
import com.myproj.CadMed.Model.Medico;
import com.myproj.CadMed.Model.UserRole;
import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.MedicoRepository;
import com.myproj.CadMed.Repository.UsuarioRepository;
import jakarta.validation.Valid; // <-- IMPORTAÇÃO ADICIONADA
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
    // <-- @Valid ADICIONADO AQUI
    public ResponseEntity<?> cadastrar(@Valid @RequestBody DadosCadastroMedico dados) {
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

    @GetMapping
    public ResponseEntity<List<Medico>> listarTodos() {
        return ResponseEntity.ok(medicoRepository.findAllByAtivoTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> buscarPorId(@PathVariable UUID id) {
        return medicoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Transactional
    // <-- @Valid ADICIONADO AQUI
    public ResponseEntity<?> atualizarMedico(@PathVariable UUID id, @Valid @RequestBody Medico dadosAtualizados) {
        return medicoRepository.findById(id).map(medicoExistente -> {

            medicoExistente.setNome(dadosAtualizados.getNome());
            medicoExistente.setCrm(dadosAtualizados.getCrm());
            medicoExistente.setEspecialidade(dadosAtualizados.getEspecialidade());
            medicoExistente.setTelefone(dadosAtualizados.getTelefone());

            if (medicoExistente.getUsuario() != null && dadosAtualizados.getUsuario() != null) {
                medicoExistente.getUsuario().setEmail(dadosAtualizados.getUsuario().getEmail());
            }

            medicoRepository.save(medicoExistente);
            return ResponseEntity.ok(medicoExistente);

        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluirMedico(@PathVariable UUID id) {
        var medico = medicoRepository.getReferenceById(id);
        medico.inativar();
        return ResponseEntity.noContent().build();
    }
}