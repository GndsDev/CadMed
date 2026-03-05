package com.myproj.CadMed.Controller;

import com.myproj.CadMed.Model.Cadastro;
import com.myproj.CadMed.Model.Usuario;
import com.myproj.CadMed.Repository.CadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/cadastros")
@CrossOrigin(origins = "*")
public class CadController {

    @Autowired
    private CadRepository repository;

    @GetMapping
    public ResponseEntity<List<Cadastro>> listar() {

        Usuario medicoLogado = (Usuario) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();

        List<Cadastro> lista = repository.findByMedico(medicoLogado);

        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<Cadastro> salvar(@RequestBody Cadastro cadastro) {

        Usuario medicoLogado = (Usuario) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();


        cadastro.setMedico(medicoLogado);

        cadastro.setData(LocalDate.now());

        Cadastro novoCadastro = repository.save(cadastro);
        return ResponseEntity.ok(novoCadastro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cadastro> update(@PathVariable UUID id, @RequestBody Cadastro cadastro) {
        return repository.findById(id)
                .map(record -> {
                    record.setNome(cadastro.getNome());
                    record.setDescricao(cadastro.getDescricao());
                    record.setIdade(cadastro.getIdade());
                    record.setSexo(cadastro.getSexo());
                    if (cadastro.getData() != null) {
                        record.setData(cadastro.getData());
                    }
                    Cadastro atualizado = repository.save(record);
                    return ResponseEntity.ok().body(atualizado);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return repository.findById(id)
                .map(_ -> {
                    repository.deleteById(id);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}