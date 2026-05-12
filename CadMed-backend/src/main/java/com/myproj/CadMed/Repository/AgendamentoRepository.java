package com.myproj.CadMed.Repository;

import com.myproj.CadMed.Model.AgendamentoPaciente;
import com.myproj.CadMed.Model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AgendamentoRepository extends JpaRepository<AgendamentoPaciente, UUID> {
    boolean existsByMedicoIdAndDataHora(UUID uuid, LocalDateTime localDateTime);

    boolean existsByPacienteIdAndDataHora(UUID uuid, LocalDateTime localDateTime);

    List<AgendamentoPaciente> findByMedicoId(UUID medicoId);

    long countByStatus(StatusAgendamento status);

    @Query("SELECT COUNT(a) FROM Agendamento a WHERE DATE(a.dataHora) >= CURRENT_DATE")
    long countConsultasHoje();

    long countByDataHora(LocalDate dataHora);
}