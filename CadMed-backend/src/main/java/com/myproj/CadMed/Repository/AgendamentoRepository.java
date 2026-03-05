package com.myproj.CadMed.Repository;

import com.myproj.CadMed.Model.AgendamentoPaciente;
import com.myproj.CadMed.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AgendamentoRepository extends JpaRepository<AgendamentoPaciente, UUID> {

    List<AgendamentoPaciente> findByMedicoOrderByDataHoraAsc(Usuario medico);

}