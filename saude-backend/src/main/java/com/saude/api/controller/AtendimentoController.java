package com.saude.api.controller;

import com.saude.api.dto.AtendimentoDTO;
import com.saude.api.dto.ReceitaSaudeDTO;
import com.saude.api.service.AtendimentoService;
import com.saude.api.service.ReceitaSaudeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atendimentos")
@RequiredArgsConstructor
public class AtendimentoController {

    @Autowired
    private AtendimentoService atendimentoService;
    
    @Autowired
    private ReceitaSaudeService receitaSaudeService;

    @GetMapping
    public ResponseEntity<List<AtendimentoDTO.Response>> listarTodos() {
        return ResponseEntity.ok(atendimentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AtendimentoDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(atendimentoService.buscarPorId(id));
    }

    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<List<AtendimentoDTO.Response>> listarPorProfissional(@PathVariable Long profissionalId) {
        return ResponseEntity.ok(atendimentoService.listarPorProfissional(profissionalId));
    }

    @PostMapping
    public ResponseEntity<AtendimentoDTO.Response> inserir(@Valid @RequestBody AtendimentoDTO.Request dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(atendimentoService.inserir(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AtendimentoDTO.Response> alterar(
            @PathVariable Long id, @Valid @RequestBody AtendimentoDTO.Request dto) {
        return ResponseEntity.ok(atendimentoService.alterar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        atendimentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // Receitas
    @GetMapping("/{id}/receitas")
    public ResponseEntity<List<ReceitaSaudeDTO.Response>> listarReceitas(@PathVariable Long id) {
        return ResponseEntity.ok(receitaSaudeService.listarPorAtendimento(id));
    }

    @PostMapping("/{id}/receitas")
    public ResponseEntity<ReceitaSaudeDTO.Response> adicionarReceita(
            @PathVariable Long id, @RequestBody ReceitaSaudeDTO.Request dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(receitaSaudeService.adicionarReceita(id, dto));
    }
}
