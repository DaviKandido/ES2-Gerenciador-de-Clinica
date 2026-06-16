package com.saude.api.repository;

import com.saude.api.entity.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
    List<Atendimento> findByProfissionalId(Long profissionalId);
    List<Atendimento> findByData(LocalDate data);

    @Query("SELECT a FROM Atendimento a WHERE a.profissional.id = :profissionalId AND a.data = :data")
    List<Atendimento> findByProfissionalIdAndData(@Param("profissionalId") Long profissionalId,
                                                   @Param("data") LocalDate data);
}
