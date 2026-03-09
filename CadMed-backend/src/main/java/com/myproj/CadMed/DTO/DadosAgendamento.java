package com.myproj.CadMed.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record DadosAgendamento(
        UUID medicoId,
        UUID pacienteId,
        LocalDateTime dataHora
) {
}