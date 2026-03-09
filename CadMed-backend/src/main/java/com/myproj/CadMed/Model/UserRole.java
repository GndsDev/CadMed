package com.myproj.CadMed.Model;

import lombok.Getter;

@Getter
public enum UserRole {
    SECRETARIA("secretaria"),
    MEDICO("medico"),
    PACIENTE("paciente");

    private final String role;

    UserRole(String role) {
        this.role = role;
    }

}