package com.saude.api.service;

import com.saude.api.dto.ExameLabDTO;
import com.saude.api.entity.Atendimento;
import com.saude.api.entity.ExameLab;
import com.saude.api.exception.ResourceNotFoundException;
import com.saude.api.repository.AtendimentoRepository;
import com.saude.api.repository.ExameLabRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

@Service
@RequiredArgsConstructor
public class ExameLabService {

    @Autowired
    private ExameLabRepository exameLabRepository;
    
    @Autowired
    private AtendimentoRepository atendimentoRepository;

    public List<ExameLabDTO.Response> listarPorAtendimento(Long atendimentoId) {
        return exameLabRepository.findByAtendimentoId(atendimentoId)
                .stream().map(this::toResponse).toList();
    }

    public ExameLabDTO.Response buscarPorId(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public ExameLabDTO.Response inserir(ExameLabDTO.Request dto) {
        Atendimento atendimento = atendimentoRepository.findById(dto.atendimentoId())
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado"));

        ExameLab exame = ExameLab.builder()
                .descricao(dto.descricao())
                .resultado(dto.resultado())
                .atendimento(atendimento)
                .build();

        return toResponse(exameLabRepository.save(exame));
    }

    @Transactional
    public ExameLabDTO.Response alterar(Long id, ExameLabDTO.Request dto) {
        ExameLab exame = findOrThrow(id);
        exame.setDescricao(dto.descricao());
        exame.setResultado(dto.resultado());
        return toResponse(exameLabRepository.save(exame));
    }

    @Transactional
    public void excluir(Long id) {
        findOrThrow(id);
        exameLabRepository.deleteById(id);
    }

    private ExameLab findOrThrow(Long id) {
        return exameLabRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exame não encontrado com id: " + id));
    }

    private ExameLabDTO.Response toResponse(ExameLab e) {
        return new ExameLabDTO.Response(e.getId(), e.getDescricao(), e.getResultado(),
                e.getAtendimento().getId());
    }
}
