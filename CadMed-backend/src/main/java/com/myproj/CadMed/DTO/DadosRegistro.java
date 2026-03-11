package com.myproj.CadMed.DTO;

import com.myproj.CadMed.Model.UserRole;

public record DadosRegistro(String email, String senha, UserRole role) {
}