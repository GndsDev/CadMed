package com.myproj.CadMed.Repository;

import com.myproj.CadMed.Model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProntuarioRepository extends JpaRepository<Prontuario, UUID> {
    // No futuro, se quisermos buscar o prontuário pelo ID do agendamento, o Spring faz isso sozinho!
    Prontuario findByAgendamentoId(UUID agendamentoId);
}