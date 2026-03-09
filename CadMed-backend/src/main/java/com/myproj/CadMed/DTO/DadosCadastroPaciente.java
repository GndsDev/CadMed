package com.myproj.CadMed.DTO;

public record DadosCadastroPaciente(
        String nome,
        String cpf,
        String telefone,
        String dataNascimento,
        String email,
        String senha
) {
}