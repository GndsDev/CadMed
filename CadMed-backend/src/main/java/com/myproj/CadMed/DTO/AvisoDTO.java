package com.myproj.CadMed.DTO;

public record AvisoDTO(
        String tipo,   // "critical", "warning", ou "info"
        String titulo,
        String desc
) {}