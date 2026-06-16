package com.saude.api.service;

import com.saude.api.dto.ProfissionalDeSaudeDTO;
import com.saude.api.entity.CategoriaProfissional;
import com.saude.api.entity.ProfissionalDeSaude;
import com.saude.api.exception.ResourceNotFoundException;
import com.saude.api.repository.ProfissionalDeSaudeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfissionalDeSaudeServiceTest {

    @Mock
    private ProfissionalDeSaudeRepository repository;

    @InjectMocks
    private ProfissionalDeSaudeService service;

    private ProfissionalDeSaude profissional;
    private ProfissionalDeSaudeDTO.Request request;

    @BeforeEach
    void setUp() {
        profissional = ProfissionalDeSaude.builder()
                .id(1L)
                .nome("Dr. João")
                .telefone("31999999999")
                .endereco("Rua A, 100")
                .categoria(CategoriaProfissional.MEDICO)
                .build();

        request = new ProfissionalDeSaudeDTO.Request(
                "Dr. João", "31999999999", "Rua A, 100", CategoriaProfissional.MEDICO
        );
    }

    @Test
    void deveInserirProfissionalComSucesso() {
        when(repository.save(any())).thenReturn(profissional);

        ProfissionalDeSaudeDTO.Response response = service.inserir(request);

        assertThat(response.nome()).isEqualTo("Dr. João");
        assertThat(response.categoria()).isEqualTo(CategoriaProfissional.MEDICO);
        verify(repository).save(any(ProfissionalDeSaude.class));
    }

    @Test
    void deveBuscarPorIdComSucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(profissional));

        ProfissionalDeSaudeDTO.Response response = service.buscarPorId(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Dr. João");
    }

    @Test
    void deveLancarExcecaoQuandoProfissionalNaoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Profissional não encontrado");
    }

    @Test
    void deveListarTodosProfissionais() {
        when(repository.findAll()).thenReturn(List.of(profissional));

        List<ProfissionalDeSaudeDTO.Response> lista = service.listarTodos();

        assertThat(lista).hasSize(1);
        assertThat(lista.get(0).nome()).isEqualTo("Dr. João");
    }

    @Test
    void deveAlterarProfissionalComSucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(profissional));
        when(repository.save(any())).thenReturn(profissional);

        ProfissionalDeSaudeDTO.Request novoRequest = new ProfissionalDeSaudeDTO.Request(
                "Dr. João Silva", "31888888888", "Rua B, 200", CategoriaProfissional.MEDICO
        );

        ProfissionalDeSaudeDTO.Response response = service.alterar(1L, novoRequest);

        assertThat(response).isNotNull();
        verify(repository).save(any(ProfissionalDeSaude.class));
    }

    @Test
    void deveExcluirProfissionalComSucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(profissional));
        doNothing().when(repository).deleteById(1L);

        assertThatNoException().isThrownBy(() -> service.excluir(1L));
        verify(repository).deleteById(1L);
    }

    @Test
    void deveBuscarPorCategoria() {
        when(repository.findByCategoria(CategoriaProfissional.MEDICO)).thenReturn(List.of(profissional));

        List<ProfissionalDeSaudeDTO.Response> lista = service.buscarPorCategoria(CategoriaProfissional.MEDICO);

        assertThat(lista).hasSize(1);
        assertThat(lista.get(0).categoria()).isEqualTo(CategoriaProfissional.MEDICO);
    }
}
