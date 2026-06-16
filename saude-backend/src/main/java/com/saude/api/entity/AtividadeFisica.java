package com.saude.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("ATIVIDADE_FISICA")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AtividadeFisica extends ReceitaSaude {

    @Column(nullable = false)
    private String descricaoAtividade;

    private Integer repeticoes;
    private Integer series;
    private String frequenciaSemanal;

    public AtividadeFisica(String descricaoAtividade, Integer repeticoes, Integer series,
                           String frequenciaSemanal, Atendimento atendimento) {
        super(); 
        this.descricaoAtividade = descricaoAtividade;
        this.repeticoes = repeticoes;
        this.series = series;
        this.frequenciaSemanal = frequenciaSemanal;
        setAtendimento(atendimento);
    }
}
