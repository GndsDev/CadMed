package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DadosAgendamento;
import com.myproj.CadMed.Model.AgendamentoPaciente;
import com.myproj.CadMed.Model.StatusAgendamento;
import com.myproj.CadMed.Repository.AgendamentoRepository;
import com.myproj.CadMed.Repository.MedicoRepository;
import com.myproj.CadMed.Repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

    // 1. Criar um Agendamento
    @PostMapping
    @Transactional
    public ResponseEntity<?> agendar(@RequestBody DadosAgendamento dados) {

        // Vai buscar o Médico e o Paciente à base de dados usando o UUID seguro
        var medico = medicoRepository.findById(dados.medicoId())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado!"));

        var paciente = pacienteRepository.findById(dados.pacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado!"));

        // Monta a consulta
        AgendamentoPaciente novoAgendamento = new AgendamentoPaciente();
        novoAgendamento.setMedico(medico);
        novoAgendamento.setPaciente(paciente);
        novoAgendamento.setDataHora(dados.dataHora());
        novoAgendamento.setStatus(StatusAgendamento.AGENDADO); // Define como agendado por padrão

        agendamentoRepository.save(novoAgendamento);

        return ResponseEntity.ok().body("Consulta agendada com sucesso!");
    }

    // 2. Cancelar um Agendamento (Em vez de usar DELETE, usamos um PUT ou DELETE lógico)
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> cancelar(@PathVariable UUID id) {

        var agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado!"));

        // A Mágica do Soft Delete: Apenas mudamos o estado, não apagamos a linha!
        agendamento.setStatus(StatusAgendamento.CANCELADO);
        agendamentoRepository.save(agendamento);

        return ResponseEntity.ok().body("Consulta cancelada no sistema.");
    }
}