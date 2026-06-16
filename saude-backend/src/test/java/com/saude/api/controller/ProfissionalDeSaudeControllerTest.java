package com.saude.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saude.api.dto.ProfissionalDeSaudeDTO;
import com.saude.api.entity.CategoriaProfissional;
import com.saude.api.service.ProfissionalDeSaudeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfissionalDeSaudeController.class)
class ProfissionalDeSaudeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfissionalDeSaudeService service;

    @Test
    void deveListarTodosProfissionais() throws Exception {
        ProfissionalDeSaudeDTO.Response response = new ProfissionalDeSaudeDTO.Response(
                1L, "Dr. João", "31999999999", "Rua A, 100", CategoriaProfissional.MEDICO
        );
        when(service.listarTodos()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/profissionais"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Dr. João"))
                .andExpect(jsonPath("$[0].categoria").value("MEDICO"));
    }

    @Test
    void deveInserirProfissional() throws Exception {
        ProfissionalDeSaudeDTO.Request request = new ProfissionalDeSaudeDTO.Request(
                "Dr. João", "31999999999", "Rua A, 100", CategoriaProfissional.MEDICO
        );
        ProfissionalDeSaudeDTO.Response response = new ProfissionalDeSaudeDTO.Response(
                1L, "Dr. João", "31999999999", "Rua A, 100", CategoriaProfissional.MEDICO
        );
        when(service.inserir(any())).thenReturn(response);

        mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Dr. João"));
    }

    @Test
    void deveRetornar400QuandoCamposObrigatoriosFaltando() throws Exception {
        String jsonInvalido = "{\"nome\": \"\"}";

        mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonInvalido))
                .andExpect(status().isBadRequest());
    }
}
