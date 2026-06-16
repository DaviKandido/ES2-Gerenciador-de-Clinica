package com.saude.api.service;

import com.saude.api.dto.ReceitaSaudeDTO;
import com.saude.api.entity.*;
import com.saude.api.exception.BusinessException;
import com.saude.api.exception.ResourceNotFoundException;
import com.saude.api.repository.AtendimentoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReceitaSaudeServiceTest {

    @Mock
    private AtendimentoRepository atendimentoRepository;

    @InjectMocks
    private ReceitaSaudeService service;

    private Atendimento atendimentoMedico;
    private Atendimento atendimentoPsicologo;

    @BeforeEach
    void setUp() {
        ProfissionalDeSaude medico = ProfissionalDeSaude.builder()
                .id(1L).nome("Dr. João").categoria(CategoriaProfissional.MEDICO).build();

        ProfissionalDeSaude psicologo = ProfissionalDeSaude.builder()
                .id(2L).nome("Dra. Maria").categoria(CategoriaProfissional.PSICOLOGO).build();

        atendimentoMedico = Atendimento.builder()
                .id(1L).data(LocalDate.now()).horario(LocalTime.of(9, 0))
                .profissional(medico).receitas(new ArrayList<>()).build();

        atendimentoPsicologo = Atendimento.builder()
                .id(2L).data(LocalDate.now()).horario(LocalTime.of(10, 0))
                .profissional(psicologo).receitas(new ArrayList<>()).build();
    }

    @Test
    void deveAdicionarRemedioParaMedico() {
        when(atendimentoRepository.findById(1L)).thenReturn(Optional.of(atendimentoMedico));
        when(atendimentoRepository.save(any())).thenReturn(atendimentoMedico);

        ReceitaSaudeDTO.Request request = new ReceitaSaudeDTO.Request(
                "REMEDIO", "Dipirona", "500mg", "1x ao dia",
                null, null, null, null, null
        );

        ReceitaSaudeDTO.Response response = service.adicionarReceita(1L, request);

        assertThat(response.tipoReceita()).isEqualTo("REMEDIO");
        assertThat(response.nomeRemedio()).isEqualTo("Dipirona");
    }

    @Test
    void deveLancarExcecaoQuandoTipoReceitaErradoParaCategoria() {
        when(atendimentoRepository.findById(1L)).thenReturn(Optional.of(atendimentoMedico));

        ReceitaSaudeDTO.Request request = new ReceitaSaudeDTO.Request(
                "ATIVIDADE_MENTAL", null, null, null,
                "Meditação", null, null, null, "Relaxamento"
        );

        assertThatThrownBy(() -> service.adicionarReceita(1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("inválido para profissional da categoria");
    }

    @Test
    void deveLancarExcecaoQuandoAtendimentoNaoEncontrado() {
        when(atendimentoRepository.findById(99L)).thenReturn(Optional.empty());

        ReceitaSaudeDTO.Request request = new ReceitaSaudeDTO.Request(
                "REMEDIO", "Dipirona", "500mg", "1x ao dia",
                null, null, null, null, null
        );

        assertThatThrownBy(() -> service.adicionarReceita(99L, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deveAdicionarAtividadeMentalParaPsicologo() {
        when(atendimentoRepository.findById(2L)).thenReturn(Optional.of(atendimentoPsicologo));
        when(atendimentoRepository.save(any())).thenReturn(atendimentoPsicologo);

        ReceitaSaudeDTO.Request request = new ReceitaSaudeDTO.Request(
                "ATIVIDADE_MENTAL", null, null, null,
                "Meditação guiada", null, null, "3x por semana", "Reduzir ansiedade"
        );

        ReceitaSaudeDTO.Response response = service.adicionarReceita(2L, request);

        assertThat(response.tipoReceita()).isEqualTo("ATIVIDADE_MENTAL");
    }
}
