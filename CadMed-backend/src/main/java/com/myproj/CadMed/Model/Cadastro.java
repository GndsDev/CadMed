package com.myproj.CadMed.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@AllArgsConstructor
@Table(name = "cadastros")
@NoArgsConstructor
public class Cadastro {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;
    private String idade;
    private String sexo;
    @Column(name = "data_lançamento")
    private LocalDate data;

}
