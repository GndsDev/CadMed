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

    @GetMapping
    public ResponseEntity<List<Medico>> listarTodos() {
        // Agora o Angular só recebe os médicos com ativo = true
        return ResponseEntity.ok(medicoRepository.findAllByAtivoTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> buscarPorId(@PathVariable UUID id) {
        // Vai ao banco de dados procurar o médico por este ID específico
        return medicoRepository.findById(id)
                .map(ResponseEntity::ok) // Se achar, devolve 200 OK com os dados
                .orElse(ResponseEntity.notFound().build()); // Se não achar, devolve 404 Not Found
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> atualizarMedico(@PathVariable UUID id, @RequestBody Medico dadosAtualizados) {
        return medicoRepository.findById(id).map(medicoExistente -> {

            // 1. Atualiza os dados próprios do Médico
            medicoExistente.setNome(dadosAtualizados.getNome());
            medicoExistente.setCrm(dadosAtualizados.getCrm());
            medicoExistente.setEspecialidade(dadosAtualizados.getEspecialidade());
            medicoExistente.setTelefone(dadosAtualizados.getTelefone());

            // 2. O SEGREDO: Atualiza o Email indo buscar o Usuário associado
            // Verificamos se o usuário existe para evitar erro de NullPointer
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
        // 1. Pega o médico pelo ID
        var medico = medicoRepository.getReferenceById(id);

        // 2. Carimba como inativo (ativo = false)
        medico.inativar();

        // 3. Devolve sucesso para o Angular
        return ResponseEntity.noContent().build();
    }
}