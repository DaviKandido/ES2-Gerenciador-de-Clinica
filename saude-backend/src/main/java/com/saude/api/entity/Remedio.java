package com.saude.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("REMEDIO")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor 
public class Remedio extends ReceitaSaude {

    @Column(nullable = false)
    private String nomeRemedio;

    @Column(nullable = false)
    private String dosagem;

    private String posologia;

    public Remedio(String nomeRemedio, String dosagem, String posologia, Atendimento atendimento) {
        super(); 
        this.nomeRemedio = nomeRemedio;
        this.dosagem = dosagem;
        this.posologia = posologia;
        setAtendimento(atendimento);
    }
}
