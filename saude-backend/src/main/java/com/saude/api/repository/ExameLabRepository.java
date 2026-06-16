package com.saude.api.repository;

import com.saude.api.entity.ExameLab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExameLabRepository extends JpaRepository<ExameLab, Long> {
    List<ExameLab> findByAtendimentoId(Long atendimentoId);
}
