package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DadosAgendamento;
import com.myproj.CadMed.Model.AgendamentoPaciente;
import com.myproj.CadMed.Model.StatusAgendamento;
import com.myproj.CadMed.Model.UserRole;
import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.AgendamentoRepository;
import com.myproj.CadMed.Repository.MedicoRepository;
import com.myproj.CadMed.Repository.PacienteRepository;
import com.myproj.CadMed.Services.EmailService;
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
    private EmailService emailService;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @GetMapping
    public ResponseEntity<List<AgendamentoPaciente>> listar(Authentication authentication) {
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        assert usuarioLogado != null;

        // LÓGICA DO MÉDICO: Vê apenas os pacientes dele
        if (usuarioLogado.getRole() == UserRole.MEDICO) {
            var medico = medicoRepository.findByUsuarioId(usuarioLogado.getId())
                    .orElseThrow(() -> new RuntimeException("Perfil de médico não encontrado!"));

            var consultasDoMedico = agendamentoRepository.findByMedicoIdOrderByDataHoraAsc(medico.getId());
            return ResponseEntity.ok(consultasDoMedico);
        }

        // LÓGICA DO PACIENTE: Vê apenas as próprias consultas (O bloco que faltava!)
        if (usuarioLogado.getRole() == UserRole.PACIENTE) {
            var paciente = pacienteRepository.findByUsuarioId(usuarioLogado.getId())
                    .orElseThrow(() -> new RuntimeException("Perfil de paciente não encontrado!"));

            var consultasDoPaciente = agendamentoRepository.findByPacienteIdOrderByDataHoraAsc(paciente.getId());
            return ResponseEntity.ok(consultasDoPaciente);
        }

        // LÓGICA DA SECRETÁRIA: Tem passe livre para ver a agenda global
        var todasAsConsultas = agendamentoRepository.findAllByOrderByDataHoraAsc();
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

        // Salva a consulta no banco de dados primeiro
        agendamentoRepository.save(novoAgendamento);

        // Tenta enviar o e-mail, mas não cancela o agendamento se houver bloqueio de rede
        try {
            emailService.enviarEmailConfirmacao(
                    paciente.getEmail(),
                    paciente.getNome(),
                    novoAgendamento.getDataHora().toString(),
                    medico.getNome()
            );
        } catch (Exception e) {
            // Log mínimo de erro apenas para não falhar silenciosamente no terminal
            System.err.println("Aviso: Falha ao enviar e-mail - " + e.getMessage());
        }

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
