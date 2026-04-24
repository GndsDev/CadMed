package com.myproj.CadMed.DTO;

import com.myproj.CadMed.Model.Prontuario;
import java.time.LocalDateTime;
import java.util.UUID;

public record DadosDetalhamentoProntuario(
        UUID id,
        UUID agendamentoId,
        String sintomas,
        String diagnostico,
        String prescricaoMedica,
        String observacoes,
        LocalDateTime dataRegistro
) {
    // Um construtor mágico que transforma a Entidade neste DTO automaticamente
    public DadosDetalhamentoProntuario(Prontuario prontuario) {
        this(
                prontuario.getId(),
                prontuario.getAgendamento().getId(),
                prontuario.getSintomas(),
                prontuario.getDiagnostico(),
                prontuario.getPrescricaoMedica(),
                prontuario.getObservacoes(),
                prontuario.getDataRegistro()
        );
    }
}