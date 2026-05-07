package com.myproj.CadMed.DTO;

import com.myproj.CadMed.Model.MetodoPagamento;
import java.math.BigDecimal;
import java.util.UUID;

public record DadosCadastroPagamento(
        UUID agendamentoId,
        BigDecimal valor,
        MetodoPagamento metodoPagamento
) {}