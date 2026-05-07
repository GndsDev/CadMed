package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DadosCadastroPagamento;
import com.myproj.CadMed.Model.Pagamento;
import com.myproj.CadMed.Model.StatusAgendamento;
import com.myproj.CadMed.Model.StatusPagamento;
import com.myproj.CadMed.Repository.AgendamentoRepository;
import com.myproj.CadMed.Repository.PagamentoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    @Autowired
    private PagamentoRepository repository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @PostMapping
    @Transactional
    public ResponseEntity registrarPagamento(@RequestBody DadosCadastroPagamento dados) {
        var agendamento = agendamentoRepository.findById(dados.agendamentoId())
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        // 1. Verificamos se já existe um pagamento para este agendamento no banco
        var pagamentoExistente = repository.findByAgendamentoId(dados.agendamentoId());

        if (pagamentoExistente.isPresent()) {
            // Se já existe, apenas "corrigimos" o status do agendamento que estava travado
            agendamento.setStatus(StatusAgendamento.PAGO);
            agendamentoRepository.save(agendamento);
            return ResponseEntity.ok().build(); // Retorna sucesso para o Angular e o botão some!
        }

        // 2. Se NÃO existe, seguimos com o fluxo normal de criar o novo pagamento
        var pagamento = new Pagamento();
        pagamento.setAgendamento(agendamento);
        pagamento.setValor(dados.valor());
        pagamento.setMetodoPagamento(dados.metodoPagamento());
        pagamento.setStatus(StatusPagamento.PAGO);

        repository.save(pagamento);

        agendamento.setStatus(StatusAgendamento.PAGO);
        agendamentoRepository.save(agendamento);

        return ResponseEntity.ok().build();
    }
}