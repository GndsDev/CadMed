package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DashboardResumoDTO;
import com.myproj.CadMed.Model.StatusAgendamento;
import com.myproj.CadMed.Repository.AgendamentoRepository;
import com.myproj.CadMed.Repository.MedicoRepository;
import com.myproj.CadMed.Repository.PacienteRepository;
import com.myproj.CadMed.Repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumoDTO> obterResumo() {
        long totalPacientes = pacienteRepository.countByAtivoTrue();
        long totalMedicos = medicoRepository.countByAtivoTrue();
        long consultasHoje = agendamentoRepository.countConsultasHoje();
        long consultasConcluidas = agendamentoRepository.countByStatus(StatusAgendamento.CONCLUIDO);

        DashboardResumoDTO resumo = new DashboardResumoDTO(
                totalPacientes,
                totalMedicos,
                consultasHoje,
                consultasConcluidas
        );

        BigDecimal faturamentoHoje = pagamentoRepository.calcularFaturamentoHoje();
        if (faturamentoHoje == null) {
            faturamentoHoje = BigDecimal.ZERO;
        }

        return ResponseEntity.ok(resumo);
    }
}