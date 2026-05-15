package com.myproj.CadMed.Controller;

import com.myproj.CadMed.Model.Pagamento;
import com.myproj.CadMed.Model.StatusPagamento;
import com.myproj.CadMed.Repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/financeiro")
public class FinanceiroController {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @GetMapping("/grafico")
    public ResponseEntity<List<Map<String, Object>>> obterDadosDoGrafico() {
        List<Object[]> resultados = pagamentoRepository.calcularFaturamentoMensalDoAno(StatusPagamento.PAGO);
        List<Map<String, Object>> dadosFormatados = new ArrayList<>();

        for (Object[] linha : resultados) {
            Map<String, Object> mesData = new HashMap<>();
            mesData.put("mes", linha[0]); // Número do mês (1 a 12)
            mesData.put("total", linha[1]); // Valor total faturado no mês
            dadosFormatados.add(mesData);
        }

        return ResponseEntity.ok(dadosFormatados);
    }

    @GetMapping("/historico")
    public ResponseEntity<List<Pagamento>> obterHistorico() {
        List<Pagamento> ultimosPagamentos = pagamentoRepository.findTop50ByStatusOrderByDataPagamentoDesc(StatusPagamento.PAGO);
        return ResponseEntity.ok(ultimosPagamentos);
    }
}
