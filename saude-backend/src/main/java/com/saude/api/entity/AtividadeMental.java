package com.saude.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("ATIVIDADE_MENTAL")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AtividadeMental extends ReceitaSaude {

    @Column(nullable = false)
    private String descricaoAtividade;

    private String objetivo;
    private String frequenciaSemanal;

    public AtividadeMental(String descricaoAtividade, String objetivo,
                           String frequenciaSemanal, Atendimento atendimento) {
        super(); 
        this.descricaoAtividade = descricaoAtividade;
        this.objetivo = objetivo;
        this.frequenciaSemanal = frequenciaSemanal;
        setAtendimento(atendimento);
    }
}
