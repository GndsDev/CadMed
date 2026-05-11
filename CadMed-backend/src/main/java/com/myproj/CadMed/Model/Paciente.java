package com.myproj.CadMed.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    private String nome;

    @NotBlank(message = "O CPF é obrigatório")
    @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", message = "Formato de CPF inválido (000.000.000-00)")
    @Column(length = 14, unique = true) // Garante tamanho exato e impede CPFs duplicados no banco
    private String cpf;

    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(regexp = "\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}", message = "Formato de telefone inválido. Use (00) 00000-0000")
    @Column(length = 15)
    private String telefone;

    // Se no futuro quiser validar a data, pode usar @Pattern(regexp = "\\d{2}/\\d{2}/\\d{4}")
    private String dataNascimento;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private Usuario usuario;

    public String getEmail() {
        return this.usuario != null ? this.usuario.getEmail() : "";
    }

    private Boolean ativo = true;

    public void inativar() {
        this.ativo = false;
    }
}