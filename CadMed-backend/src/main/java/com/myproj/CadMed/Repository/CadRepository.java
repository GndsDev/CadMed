package com.myproj.CadMed.Repository;

import com.myproj.CadMed.Model.Cadastro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CadRepository extends JpaRepository<Cadastro, Long> {
}
