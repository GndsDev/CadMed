package com.myproj.CadMed.Controller;

import com.myproj.CadMed.DTO.DadosCadastroProntuario;
import com.myproj.CadMed.DTO.DadosDetalhamentoProntuario;
import com.myproj.CadMed.Model.AgendamentoPaciente;
import com.myproj.CadMed.Model.Prontuario;
import com.myproj.CadMed.Model.StatusAgendamento;
import com.myproj.CadMed.Repository.AgendamentoRepository;
import com.myproj.CadMed.Repository.ProntuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/prontuarios")
public class ProntuarioController {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @PostMapping
    @Transactional // Garante que se algo der erro, ele desfaz tudo no banco de dados!
    public ResponseEntity<DadosDetalhamentoProntuario> registrar(@RequestBody DadosCadastroProntuario dados, UriComponentsBuilder uriBuilder) {

        // 1. Procura a consulta original no banco de dados
        AgendamentoPaciente agendamento = agendamentoRepository.findById(dados.agendamentoId())
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado!"));

        // 2. Cria o novo prontuário
        Prontuario prontuario = new Prontuario();
        prontuario.setAgendamento(agendamento);
        prontuario.setSintomas(dados.sintomas());
        prontuario.setDiagnostico(dados.diagnostico());
        prontuario.setPrescricaoMedica(dados.prescricaoMedica());
        prontuario.setObservacoes(dados.observacoes());
        prontuario.setDataRegistro(LocalDateTime.now());

        // 3. Salva no banco de dados
        prontuarioRepository.save(prontuario);

        // 4. Regra de Negócio: Atualiza a consulta para CONCLUIDA!
        agendamento.setStatus(StatusAgendamento.CONCLUIDO);
        // Não precisa de agendamentoRepository.save() porque estamos dentro de um @Transactional. O Hibernate atualiza sozinho!

        // 5. Retorna o código 201 (Created) para o Angular
        var uri = uriBuilder.path("/api/prontuarios/{id}").buildAndExpand(prontuario.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoProntuario(prontuario));
    }
}