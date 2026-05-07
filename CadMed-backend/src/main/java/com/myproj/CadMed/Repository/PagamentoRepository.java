package com.myproj.CadMed.Repository;

import com.myproj.CadMed.Model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;


public interface PagamentoRepository extends JpaRepository<Pagamento, UUID> {
    Optional<Pagamento> findByAgendamentoId(UUID agendamentoId);

    @Query("SELECT COALESCE(SUM(p.valor), 0) FROM Pagamento p WHERE p.status = 'PAGO' AND DATE(p.dataPagamento) = CURRENT_DATE")
    BigDecimal calcularFaturamentoHoje();
}