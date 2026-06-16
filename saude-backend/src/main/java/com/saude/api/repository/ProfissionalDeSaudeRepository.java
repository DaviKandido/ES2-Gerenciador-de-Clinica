package com.saude.api.repository;

import com.saude.api.entity.CategoriaProfissional;
import com.saude.api.entity.ProfissionalDeSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfissionalDeSaudeRepository extends JpaRepository<ProfissionalDeSaude, Long> {
    List<ProfissionalDeSaude> findByNomeContainingIgnoreCase(String nome);
    List<ProfissionalDeSaude> findByCategoria(CategoriaProfissional categoria);
}
