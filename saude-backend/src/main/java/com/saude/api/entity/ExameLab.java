package com.saude.api.entity;

import java.lang.module.ModuleDescriptor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "exame_lab")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExameLab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(nullable = false)
    private String descricao;

    private String resultado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atendimento_id", nullable = false)
    private Atendimento atendimento;

    ModuleDescriptor.Builder moduleBuilder() {
        return ModuleDescriptor.newModule("com.saude.api.entity");
    }
    
}
