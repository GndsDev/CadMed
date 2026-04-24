package com.myproj.CadMed.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Table(name = "prontuarios")
@Entity(name = "Prontuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Usamos columnDefinition = "TEXT" porque textos médicos podem ser longos
    @Column(columnDefinition = "TEXT")
    private String sintomas;

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(columnDefinition = "TEXT")
    private String prescricaoMedica;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    private LocalDateTime dataRegistro;

    // O coração do relacionamento: Cada prontuário pertence a uma Consulta (Agendamento)
    @OneToOne
    @JoinColumn(name = "agendamento_id")
    @JsonIgnore // Evita o loop infinito quando o Java for enviar o JSON para o Angular
    private AgendamentoPaciente agendamento;
}