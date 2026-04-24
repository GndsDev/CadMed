package com.myproj.CadMed.DTO;

import java.util.UUID;

public record DadosCadastroProntuario(
        UUID agendamentoId,
        String sintomas,
        String diagnostico,
        String prescricaoMedica,
        String observacoes
) {
}