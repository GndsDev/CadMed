package com.myproj.CadMed.Repository;

import com.myproj.CadMed.Model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, UUID> {
    List<Paciente> findAllByAtivoTrue();
    long countByAtivoTrue(); // Conta apenas os pacientes que não foram excluídos
    long countByTelefoneIsNull();
    long countByTelefone(String telefone);
}