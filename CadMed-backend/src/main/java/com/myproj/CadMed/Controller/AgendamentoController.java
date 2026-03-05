package com.myproj.CadMed.Controller;

import com.myproj.CadMed.Model.AgendamentoPaciente;
import com.myproj.CadMed.Model.Cadastro;
import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.AgendamentoRepository;
import com.myproj.CadMed.Repository.CadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private CadRepository cadastroRepository;

    // DTO (Record) para receber apenas os dados necessários do Angular
    public record DadosAgendamento(UUID pacienteId, LocalDateTime dataHora, String observacoes) {}

    @PostMapping
    public ResponseEntity<AgendamentoPaciente> agendar(@RequestBody DadosAgendamento dados) {
        // 1. Pega o médico logado através do Token JWT
        Usuario medicoLogado = (Usuario) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();

        // 2. Busca o paciente no banco de dados
        Optional<Cadastro> pacienteOpt = cadastroRepository.findById(dados.pacienteId());
        if (pacienteOpt.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Paciente não existe
        }

        Cadastro paciente = pacienteOpt.get();

        // 3. Trava de Segurança: O paciente pertence a este médico?
        assert medicoLogado != null;
        if (!paciente.getMedico().getId().equals(medicoLogado.getId())) {
            return ResponseEntity.status(403).build(); // Proibido!
        }

        // 4. Cria e salva o agendamento
        AgendamentoPaciente agendamento = new AgendamentoPaciente();
        agendamento.setMedico(medicoLogado);
        agendamento.setPaciente(paciente);
        agendamento.setDataHora(dados.dataHora());
        agendamento.setObservacoes(dados.observacoes());
        // O status já vem como "AGENDADO" por padrão lá no modelo

        AgendamentoPaciente salvo = agendamentoRepository.save(agendamento);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoPaciente>> listar() {
        Usuario medicoLogado = (Usuario) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();

        // Retorna a lista ordenada pela data (da mais próxima para a mais distante)
        List<AgendamentoPaciente> lista = agendamentoRepository.findByMedicoOrderByDataHoraAsc(medicoLogado);
        return ResponseEntity.ok(lista);
    }
}