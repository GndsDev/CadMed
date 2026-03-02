package com.myproj.CadMed.Controller;

import com.myproj.CadMed.Model.Cadastro;
import com.myproj.CadMed.Repository.CadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/cadastros")
@CrossOrigin(origins = "*")
public class CadController {

    @Autowired
    private CadRepository repository;

    @GetMapping
    public List<Cadastro> findAll() {
        return repository.findAll();
    }

    @PostMapping
    public Cadastro save(@RequestBody Cadastro cadastro) {
        if (cadastro.getNome() == null || cadastro.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome é obrigatório!");
        }

        if (cadastro.getData() == null){
            cadastro.setData(LocalDate.now());
        }
        cadastro.setId(null);
        return repository.save(cadastro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cadastro> update(@PathVariable Long id, @RequestBody Cadastro cadastro) {
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
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return repository.findById(id)
                .map(record -> {
                    repository.deleteById(id);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}