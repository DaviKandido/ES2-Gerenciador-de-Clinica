package com.saude.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ExameLabDTO {

    public record Request(
        @NotBlank(message = "Descrição é obrigatória") String descricao,
        String resultado,
        @NotNull(message = "ID do atendimento é obrigatório") Long atendimentoId
    ) {}

    public record Response(
        Long id,
        String descricao,
        String resultado,
        Long atendimentoId
    ) {}
}
