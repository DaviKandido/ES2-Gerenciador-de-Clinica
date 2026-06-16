package com.saude.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "receita_saude")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_receita", discriminatorType = DiscriminatorType.STRING)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public abstract class ReceitaSaude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_receita", insertable = false, updatable = false)
    private String tipoReceita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atendimento_id", nullable = false)
    private Atendimento atendimento;

    public void setAtendimento(Atendimento atendimento) {
        this.atendimento = atendimento;
    }
}
