package com.myproj.CadMed.Repository;

import com.myproj.CadMed.Model.Pagamento;
import com.myproj.CadMed.Model.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface PagamentoRepository extends JpaRepository<Pagamento, UUID> {
    Optional<Pagamento> findByAgendamentoId(UUID agendamentoId);

    @Query("SELECT COALESCE(SUM(p.valor), 0) FROM Pagamento p WHERE p.status = :status AND DATE(p.dataPagamento) = CURRENT_DATE")
    BigDecimal calcularFaturamentoHoje(@Param("status") StatusPagamento status);

    @Query("SELECT MONTH(p.dataPagamento), SUM(p.valor) FROM Pagamento p " +
            "WHERE p.status = :status AND YEAR(p.dataPagamento) = YEAR(CURRENT_DATE) " +
            "GROUP BY MONTH(p.dataPagamento) " +
            "ORDER BY MONTH(p.dataPagamento)")
    List<Object[]> calcularFaturamentoMensalDoAno(@Param("status") StatusPagamento status);

    // 2. Para a Tabela: Traz os últimos 50 pagamentos aprovados ordenados do mais recente para o mais antigo
    List<Pagamento> findTop50ByStatusOrderByDataPagamentoDesc(StatusPagamento status);
}