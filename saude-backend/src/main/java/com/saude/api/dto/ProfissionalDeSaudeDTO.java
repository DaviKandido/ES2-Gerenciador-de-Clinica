package com.saude.api.dto;

import com.saude.api.entity.CategoriaProfissional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProfissionalDeSaudeDTO {

    public record Request(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotBlank(message = "Telefone é obrigatório") String telefone,
        @NotBlank(message = "Endereço é obrigatório") String endereco,
        @NotNull(message = "Categoria é obrigatória") CategoriaProfissional categoria
    ) {}

    public record Response(
        Long id,
        String nome,
        String telefone,
        String endereco,
        CategoriaProfissional categoria
    ) {}
}
