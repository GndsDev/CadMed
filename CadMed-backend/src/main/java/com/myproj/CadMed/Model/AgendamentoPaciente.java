package com.myproj.CadMed.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "agendamentos")
public class AgendamentoPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    private LocalDateTime dataHora;


    private String status = "AGENDADO";


    private String observacoes;


    @ManyToOne
    @JoinColumn(name = "medico_id")
    private Usuario medico;


    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Cadastro paciente;

}