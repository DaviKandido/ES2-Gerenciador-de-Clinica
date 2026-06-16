package com.saude.api.service;

import com.saude.api.dto.ReceitaSaudeDTO;
import com.saude.api.entity.*;
import com.saude.api.exception.BusinessException;
import com.saude.api.exception.ResourceNotFoundException;
import com.saude.api.repository.AtendimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceitaSaudeService {

    private final AtendimentoRepository atendimentoRepository;

    @Transactional
    public ReceitaSaudeDTO.Response adicionarReceita(Long atendimentoId, ReceitaSaudeDTO.Request dto) {
        Atendimento atendimento = atendimentoRepository.findById(atendimentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado"));

        CategoriaProfissional categoria = atendimento.getProfissional().getCategoria();
        validarTipoReceita(dto.tipoReceita(), categoria);

        ReceitaSaude receita = criarReceita(dto, atendimento);
        atendimento.getReceitas().add(receita);
        atendimentoRepository.save(atendimento);

        return toResponse(receita);
    }

    public List<ReceitaSaudeDTO.Response> listarPorAtendimento(Long atendimentoId) {
        Atendimento atendimento = atendimentoRepository.findById(atendimentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado"));
        return atendimento.getReceitas().stream().map(this::toResponse).toList();
    }

    private void validarTipoReceita(String tipo, CategoriaProfissional categoria) {
        boolean valido = switch (categoria) {
            case MEDICO -> "REMEDIO".equals(tipo);
            case FISIOTERAPEUTA -> "ATIVIDADE_FISICA".equals(tipo);
            case PSICOLOGO -> "ATIVIDADE_MENTAL".equals(tipo);
        };
        if (!valido) {
            throw new BusinessException("Tipo de receita '" + tipo + "' inválido para profissional da categoria " + categoria);
        }
    }

    private ReceitaSaude criarReceita(ReceitaSaudeDTO.Request dto, Atendimento atendimento) {
        return switch (dto.tipoReceita()) {
            case "REMEDIO" -> new Remedio(dto.nomeRemedio(), dto.dosagem(), dto.posologia(), atendimento);
            case "ATIVIDADE_FISICA" -> new AtividadeFisica(dto.descricaoAtividade(), dto.repeticoes(),
                    dto.series(), dto.frequenciaSemanal(), atendimento);
            case "ATIVIDADE_MENTAL" -> new AtividadeMental(dto.descricaoAtividade(), dto.objetivo(),
                    dto.frequenciaSemanal(), atendimento);
            default -> throw new BusinessException("Tipo de receita inválido: " + dto.tipoReceita());
        };
    }

    private ReceitaSaudeDTO.Response toResponse(ReceitaSaude r) {
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
        throw new BusinessException("Tipo de receita desconhecido");
    }
}
