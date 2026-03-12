package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DadosAgendamento;
import com.myproj.CadMed.Model.AgendamentoPaciente;
import com.myproj.CadMed.Model.StatusAgendamento;
import com.myproj.CadMed.Model.UserRole;
import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.AgendamentoRepository;
import com.myproj.CadMed.Repository.MedicoRepository;
import com.myproj.CadMed.Repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    // 1. LISTAR TODAS AS CONSULTAS (O Angular vai filtrar quem vê o quê)
    @GetMapping

    public ResponseEntity<List<AgendamentoPaciente>> listar(Authentication authentication) {
        // 1. Descobre quem é a pessoa que está logada neste momento
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        // 2. Se for um MÉDICO, o cofre só abre a gaveta dele!
        assert usuarioLogado != null;
        if (usuarioLogado.getRole() == UserRole.MEDICO) {

            // Encontra qual é o perfil de médico ligado a este login
            var medico = medicoRepository.findByUsuarioId(usuarioLogado.getId())
                    .orElseThrow(() -> new RuntimeException("Perfil de médico não encontrado!"));

            // Devolve APENAS as consultas onde este médico está associado
            var consultasDoMedico = agendamentoRepository.findByMedicoId(medico.getId());
            return ResponseEntity.ok(consultasDoMedico);
        }

        // 3. Se for a SECRETÁRIA, ela tem passe livre para ver tudo
        var todasAsConsultas = agendamentoRepository.findAll();
        return ResponseEntity.ok(todasAsConsultas);
    }

    // 2. CRIAR CONSULTA (Apenas Secretária vai ter o botão no Angular)
    @PostMapping
    @Transactional
    public ResponseEntity<?> agendar(@RequestBody DadosAgendamento dados) {
        var medico = medicoRepository.findById(dados.medicoId())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado!"));

        var paciente = pacienteRepository.findById(dados.pacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado!"));

        AgendamentoPaciente novoAgendamento = new AgendamentoPaciente();
        novoAgendamento.setMedico(medico);
        novoAgendamento.setPaciente(paciente);
        novoAgendamento.setDataHora(dados.dataHora());
        novoAgendamento.setStatus(StatusAgendamento.AGENDADO);

        agendamentoRepository.save(novoAgendamento);
        return ResponseEntity.ok().body(Map.of("mensagem", "Consulta agendada com sucesso!"));
    }

    // 3. ATUALIZAR STATUS (Para o Médico usar!)
    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> atualizarStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        var agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado!"));

        // Pega o status que o Angular enviou (ex: "CONCLUIDO")
        String novoStatus = body.get("status");
        agendamento.setStatus(StatusAgendamento.valueOf(novoStatus));

        agendamentoRepository.save(agendamento);
        return ResponseEntity.ok().body(Map.of("mensagem", "Status atualizado!"));
    }

    // 4. CANCELAR CONSULTA
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> cancelar(@PathVariable UUID id) {
        var agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado!"));

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        agendamentoRepository.save(agendamento);

        return ResponseEntity.ok().body(Map.of("mensagem", "Consulta cancelada no sistema."));
    }
}