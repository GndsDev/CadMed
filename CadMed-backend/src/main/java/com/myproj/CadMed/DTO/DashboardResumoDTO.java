package com.myproj.CadMed.DTO;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResumoDTO(
        long totalPacientes,
        long totalMedicos,
        long consultasHoje,
        long consultasConcluidas,
        BigDecimal faturamentoHoje,
        List<Integer> fluxoSemanal,
        List<AvisoDTO> avisos
) {
}