package com.saude.api.service;

import com.saude.api.dto.ProfissionalDeSaudeDTO;
import com.saude.api.entity.CategoriaProfissional;
import com.saude.api.entity.ProfissionalDeSaude;
import com.saude.api.exception.ResourceNotFoundException;
import com.saude.api.repository.ProfissionalDeSaudeRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfissionalDeSaudeService {

    @Autowired
    private ProfissionalDeSaudeRepository repository;

    public List<ProfissionalDeSaudeDTO.Response> listarTodos() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ProfissionalDeSaudeDTO.Response buscarPorId(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<ProfissionalDeSaudeDTO.Response> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome)
                .stream().map(this::toResponse).toList();
    }

    public List<ProfissionalDeSaudeDTO.Response> buscarPorCategoria(CategoriaProfissional categoria) {
        return repository.findByCategoria(categoria)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ProfissionalDeSaudeDTO.Response inserir(ProfissionalDeSaudeDTO.Request dto) {
        ProfissionalDeSaude entidade = ProfissionalDeSaude.builder()
                .nome(dto.nome())
                .telefone(dto.telefone())
                .endereco(dto.endereco())
                .categoria(dto.categoria())
                .build();
        return toResponse(repository.save(entidade));
    }

    @Transactional
    public ProfissionalDeSaudeDTO.Response alterar(Long id, ProfissionalDeSaudeDTO.Request dto) {
        ProfissionalDeSaude entidade = findOrThrow(id);
        entidade.setNome(dto.nome());
        entidade.setTelefone(dto.telefone());
        entidade.setEndereco(dto.endereco());
        entidade.setCategoria(dto.categoria());
        return toResponse(repository.save(entidade));
    }

    @Transactional
    public void excluir(Long id) {
        findOrThrow(id);
        repository.deleteById(id);
    }

    private ProfissionalDeSaude findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com id: " + id));
    }

    private ProfissionalDeSaudeDTO.Response toResponse(ProfissionalDeSaude p) {
        return new ProfissionalDeSaudeDTO.Response(
                p.getId(), p.getNome(), p.getTelefone(), p.getEndereco(), p.getCategoria()
        );
    }
}
