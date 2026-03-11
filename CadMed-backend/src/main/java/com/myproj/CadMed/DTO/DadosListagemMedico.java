package com.myproj.CadMed.DTO;

import com.myproj.CadMed.Model.Medico;

import java.util.UUID;

public record DadosListagemMedico(UUID id, String nome, String email, String crm, String especialidade, String telefone) {
    public DadosListagemMedico(Medico m) {
        this(m.getId(), m.getNome(), m.getUsuario().getEmail(), m.getCrm(), m.getEspecialidade(), m.getTelefone());
    }
}