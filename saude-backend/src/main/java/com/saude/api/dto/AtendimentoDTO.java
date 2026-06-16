package com.saude.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class AtendimentoDTO {

    public record Request(
        @NotNull(message = "Data é obrigatória")
        @JsonFormat(pattern = "yyyy-MM-dd") LocalDate data,

        @NotNull(message = "Horário é obrigatório")
        @JsonFormat(pattern = "HH:mm") LocalTime horario,

        String problemaTexto,

        @NotNull(message = "ID do profissional é obrigatório") Long profissionalId
    ) {}

    public record Response(
        Long id,
        @JsonFormat(pattern = "yyyy-MM-dd") LocalDate data,
        @JsonFormat(pattern = "HH:mm") LocalTime horario,
        String problemaTexto,
        ProfissionalDeSaudeDTO.Response profissional,
        List<ReceitaSaudeDTO.Response> receitas,
        List<ExameLabDTO.Response> examesLab
    ) {}
}
