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
    public ResponseEntity<List<Paciente>> listarTodos() {
        // Agora só devolve quem tem a flag ativo = true
        return ResponseEntity.ok(pacienteRepository.findAllByAtivoTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable UUID id) {
        return pacienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> atualizarPaciente(@PathVariable UUID id, @RequestBody Paciente dadosAtualizados) {
        return pacienteRepository.findById(id).map(pacienteExistente -> {

            // 1. Atualiza os dados do Paciente
            pacienteExistente.setNome(dadosAtualizados.getNome());
            pacienteExistente.setCpf(dadosAtualizados.getCpf());
            pacienteExistente.setTelefone(dadosAtualizados.getTelefone());

            if (pacienteExistente.getUsuario() != null && dadosAtualizados.getUsuario() != null) {
                pacienteExistente.getUsuario().setEmail(dadosAtualizados.getUsuario().getEmail());
            }

            // 2. Salva e devolve o paciente atualizado
            pacienteRepository.save(pacienteExistente);
            return ResponseEntity.ok(pacienteExistente);

        }).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluirPaciente(@PathVariable UUID id) {
        // Vai buscar o paciente ao banco de dados
        var paciente = pacienteRepository.getReferenceById(id);

        // Em vez de deleteById, chamamos o método que muda para false
        paciente.inativar();

        // Retorna sucesso para o Angular (o Angular vai achar que foi apagado!)
        return ResponseEntity.noContent().build();
    }
}