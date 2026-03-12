package com.myproj.CadMed.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Table(name = "pacientes")
@Entity(name = "Paciente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID )
    private UUID id;

    private String nome;
    private String cpf;
    private String telefone;
    private String dataNascimento;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    @JsonIgnore // <-- ISTO É OBRIGATÓRIO PARA A LISTA FUNCIONAR
    private Usuario usuario;

    // <-- ISTO É OBRIGATÓRIO PARA O ANGULAR MOSTRAR O EMAIL NA TABELA
    public String getEmail() {
        return this.usuario != null ? this.usuario.getEmail() : "";
    }

    private Boolean ativo = true;

    public void inativar() {
        this.ativo = false;
    }
}