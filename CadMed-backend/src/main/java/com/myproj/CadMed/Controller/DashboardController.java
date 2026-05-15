package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.AvisoDTO;
import com.myproj.CadMed.DTO.DashboardResumoDTO;
import com.myproj.CadMed.Model.StatusAgendamento;
import com.myproj.CadMed.Model.StatusPagamento;
import com.myproj.CadMed.Repository.AgendamentoRepository;
import com.myproj.CadMed.Repository.MedicoRepository;
import com.myproj.CadMed.Repository.PacienteRepository;
import com.myproj.CadMed.Repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
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
    @PreAuthorize("hasAnyRole('SECRETARIA', 'MEDICO')")
    public ResponseEntity<DashboardResumoDTO> obterResumo() {

        // ==========================================
        // 1. MÉTRICAS PRINCIPAIS (Sua lógica original)
        // ==========================================
        long totalPacientes = pacienteRepository.countByAtivoTrue();
        long totalMedicos = medicoRepository.countByAtivoTrue();
        long consultasHoje = agendamentoRepository.countConsultasHoje();
        long consultasConcluidas = agendamentoRepository.countByStatus(StatusAgendamento.CONCLUIDO);

        BigDecimal faturamentoHoje = BigDecimal.ZERO;

        try {
            BigDecimal faturamentoBD = pagamentoRepository.calcularFaturamentoHoje(StatusPagamento.PAGO);
            if (faturamentoBD != null) {
                faturamentoHoje = faturamentoBD;
            }
        } catch (Exception e) {
            System.err.println("Erro ao calcular faturamento (Dashboard): " + e.getMessage());
        }

        // ==========================================
        // 2. DADOS DO GRÁFICO (Fluxo Semanal)
        // ==========================================
        // Dica de Tech Lead: No futuro, crie uma Query no AgendamentoRepository
        // para contar as consultas agrupadas por dia da semana.
        // Por agora, vamos enviar dados estáticos para o gráfico funcionar na tela:
        List<Integer> fluxoSemanal = new ArrayList<>();
        LocalDate hoje = LocalDate.now();

// O loop roda 6 vezes. Começa de 5 dias atrás (i=5) até hoje (i=0)
        for (int i = 5; i >= 0; i--) {
            LocalDate diaPesquisa = hoje.minusDays(i);

            try {
                // Usa o método que acabámos de criar no Repository
                long consultasNoDia = agendamentoRepository.countByDataHora(diaPesquisa);
                fluxoSemanal.add((int) consultasNoDia);
            } catch (Exception e) {
                // Programação defensiva: se falhar, assume 0 para não quebrar o gráfico
                fluxoSemanal.add(0);
            }
        }

        // ==========================================
        // 3. CENTRAL DE AVISOS INTELIGENTE
        // ==========================================
        List<AvisoDTO> avisos = new ArrayList<>();

        // Regra 1: Alerta sobre o fluxo de trabalho de hoje
        if (consultasHoje > 0 && consultasConcluidas == 0) {
            avisos.add(new AvisoDTO("warning", "Atenção na Agenda", "Há " + consultasHoje + " consultas hoje, mas nenhuma foi concluída no sistema ainda."));
        } else if (consultasHoje == 0) {
            avisos.add(new AvisoDTO("info", "Agenda Livre", "Não há consultas agendadas para o dia de hoje."));
        }

        // Regra 2: Alerta Financeiro
        if (faturamentoHoje.compareTo(BigDecimal.ZERO) == 0) {
            avisos.add(new AvisoDTO("critical", "Faturamento Zerado", "Nenhum pagamento foi registrado para os atendimentos de hoje."));
        }

        // Regra 3: Aviso Informativo Geral
        avisos.add(new AvisoDTO("info", "Corpo Clínico", "A clínica está operando com " + totalMedicos + " profissionais médicos ativos hoje."));


        // ==========================================
        // 4. MONTAGEM E RETORNO
        // ==========================================
        DashboardResumoDTO resumo = new DashboardResumoDTO(
                totalPacientes,
                totalMedicos,
                consultasHoje,
                consultasConcluidas,
                faturamentoHoje,
                fluxoSemanal,
                avisos
        );

        return ResponseEntity.ok(resumo);
    }
}
