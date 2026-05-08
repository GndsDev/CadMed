package com.myproj.CadMed.DTO;

import java.math.BigDecimal;

public record DashboardResumoDTO(
        long totalPacientes,
        long totalMedicos,
        long consultasHoje,
        long consultasConcluidas,
        BigDecimal faturamentoHoje
) {
}