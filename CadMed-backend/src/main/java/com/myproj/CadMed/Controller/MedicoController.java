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

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    @Transactional // Garante que se falhar o médico, falha o utilizador também (não salva pela metade)
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroMedico dados) {

        // 1. Verifica se o email já existe
        if (this.usuarioRepository.findByEmail(dados.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado!");
        }

        // 2. Cria o Utilizador (Login)
        String senhaCriptografada = new BCryptPasswordEncoder().encode(dados.senha());
        Usuario novoUsuario = new Usuario(null, dados.email(), senhaCriptografada, UserRole.MEDICO);
        usuarioRepository.save(novoUsuario);

        // 3. Cria o Médico e associa ao utilizador
        Medico novoMedico = new Medico();
        novoMedico.setNome(dados.nome());
        novoMedico.setCrm(dados.crm());
        novoMedico.setEspecialidade(dados.especialidade());
        novoMedico.setTelefone(dados.telefone());
        novoMedico.setUsuario(novoUsuario); // Ligação mágica aqui!

        medicoRepository.save(novoMedico);

        return ResponseEntity.ok().body("Médico cadastrado com sucesso!");
    }
}