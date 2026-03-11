package com.myproj.CadMed.DTO;

import com.myproj.CadMed.Model.Paciente;

import java.util.UUID;

public record DadosListagemPaciente(UUID id, String nome, String email, String cpf, String telefone, String dataNascimento) {
    public DadosListagemPaciente(Paciente p) {
        this(p.getId(), p.getNome(), p.getUsuario().getEmail(), p.getCpf(), p.getTelefone(), p.getDataNascimento());
    }
}