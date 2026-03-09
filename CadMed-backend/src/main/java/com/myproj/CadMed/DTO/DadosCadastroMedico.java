package com.myproj.CadMed.DTO;

public record DadosCadastroMedico(
        String nome,
        String crm,
        String especialidade,
        String telefone,
        String email,
        String senha
) {
}