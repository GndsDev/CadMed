package com.myproj.CadMed.DTO;

public record DashboardResumoDTO(
        long totalPacientes,
        long totalMedicos,
        long consultasHoje,
        long consultasConcluidas
) {
}