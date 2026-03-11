package com.myproj.CadMed.Repository;

import com.myproj.CadMed.Model.AgendamentoPaciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AgendamentoRepository extends JpaRepository<AgendamentoPaciente, UUID> {
    boolean existsByMedicoIdAndDataHora(UUID uuid, LocalDateTime localDateTime);

    boolean existsByPacienteIdAndDataHora(UUID uuid, LocalDateTime localDateTime);

    List<AgendamentoPaciente> findByMedicoId(UUID medicoId);
}