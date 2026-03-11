package com.myproj.CadMed.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Table(name = "medicos")
@Entity(name = "Medico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String nome;
    private String crm;
    private String especialidade;
    private String telefone;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    @JsonIgnore // <-- ADICIONE ISTO AQUI
    private Usuario usuario;

    // <-- ADICIONE ESTE BLOCO AQUI
    public String getEmail() {
        return this.usuario != null ? this.usuario.getEmail() : "";
    }
}