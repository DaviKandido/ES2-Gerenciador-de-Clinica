package com.saude.api.service;

import com.saude.api.dto.*;
import com.saude.api.entity.*;
import com.saude.api.exception.ResourceNotFoundException;
import com.saude.api.repository.AtendimentoRepository;
import com.saude.api.repository.ProfissionalDeSaudeRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AtendimentoService {

    @Autowired
    private AtendimentoRepository atendimentoRepository;

    @Autowired
    private ProfissionalDeSaudeRepository profissionalRepository;

    public List<AtendimentoDTO.Response> listarTodos() {
        return atendimentoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public AtendimentoDTO.Response buscarPorId(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<AtendimentoDTO.Response> listarPorProfissional(Long profissionalId) {
        return atendimentoRepository.findByProfissionalId(profissionalId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public AtendimentoDTO.Response inserir(AtendimentoDTO.Request dto) {
        ProfissionalDeSaude profissional = profissionalRepository.findById(dto.profissionalId())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado"));

        Atendimento atendimento = Atendimento.builder()
                .data(dto.data())
                .horario(dto.horario())
                .problemaTexto(dto.problemaTexto())
                .profissional(profissional)
                .build();

        return toResponse(atendimentoRepository.save(atendimento));
    }

    @Transactional
    public AtendimentoDTO.Response alterar(Long id, AtendimentoDTO.Request dto) {
        Atendimento atendimento = findOrThrow(id);
        ProfissionalDeSaude profissional = profissionalRepository.findById(dto.profissionalId())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado"));

        atendimento.setData(dto.data());
        atendimento.setHorario(dto.horario());
        atendimento.setProblemaTexto(dto.problemaTexto());
        atendimento.setProfissional(profissional);

        return toResponse(atendimentoRepository.save(atendimento));
    }

    @Transactional
    public void excluir(Long id) {
        findOrThrow(id);
        atendimentoRepository.deleteById(id);
    }

    private Atendimento findOrThrow(Long id) {
        return atendimentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado com id: " + id));
    }

    private AtendimentoDTO.Response toResponse(Atendimento a) {
        ProfissionalDeSaudeDTO.Response profResp = new ProfissionalDeSaudeDTO.Response(
                a.getProfissional().getId(), a.getProfissional().getNome(),
                a.getProfissional().getTelefone(), a.getProfissional().getEndereco(),
                a.getProfissional().getCategoria()
        );

        List<ReceitaSaudeDTO.Response> receitas = a.getReceitas().stream()
                .map(this::receitaToResponse).toList();

        List<ExameLabDTO.Response> exames = a.getExamesLab().stream()
                .map(e -> new ExameLabDTO.Response(e.getId(), e.getDescricao(), e.getResultado(), a.getId()))
                .toList();

        return new AtendimentoDTO.Response(
                a.getId(), a.getData(), a.getHorario(), a.getProblemaTexto(),
                profResp, receitas, exames
        );
    }

    private ReceitaSaudeDTO.Response receitaToResponse(ReceitaSaude r) {
        if (r instanceof Remedio rem) {
            return new ReceitaSaudeDTO.Response(rem.getId(), "REMEDIO",
                    rem.getNomeRemedio(), rem.getDosagem(), rem.getPosologia(),
                    null, null, null, null, null);
        } else if (r instanceof AtividadeFisica af) {
            return new ReceitaSaudeDTO.Response(af.getId(), "ATIVIDADE_FISICA",
                    null, null, null,
                    af.getDescricaoAtividade(), af.getRepeticoes(), af.getSeries(), af.getFrequenciaSemanal(), null);
        } else if (r instanceof AtividadeMental am) {
            return new ReceitaSaudeDTO.Response(am.getId(), "ATIVIDADE_MENTAL",
                    null, null, null,
                    am.getDescricaoAtividade(), null, null, am.getFrequenciaSemanal(), am.getObjetivo());
        }
        return null;
    }
}
