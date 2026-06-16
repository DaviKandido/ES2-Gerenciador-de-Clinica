package com.saude.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReceitaSaudeDTO {

    public record Request(
        @NotNull(message = "Tipo de receita é obrigatório") String tipoReceita,
        // REMEDIO
        String nomeRemedio,
        String dosagem,
        String posologia,
        // ATIVIDADE_FISICA
        String descricaoAtividade,
        Integer repeticoes,
        Integer series,
        String frequenciaSemanal,
        // ATIVIDADE_MENTAL
        String objetivo
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Response(
        Long id,
        String tipoReceita,
        // REMEDIO
        String nomeRemedio,
        String dosagem,
        String posologia,
        // ATIVIDADE_FISICA / ATIVIDADE_MENTAL
        String descricaoAtividade,
        Integer repeticoes,
        Integer series,
        String frequenciaSemanal,
        String objetivo
    ) {}
}
