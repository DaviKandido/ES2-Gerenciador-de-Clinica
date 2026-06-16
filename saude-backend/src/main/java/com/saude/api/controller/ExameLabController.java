package com.saude.api.controller;

import com.saude.api.dto.ExameLabDTO;
import com.saude.api.service.ExameLabService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/exames")
@RequiredArgsConstructor
public class ExameLabController {

    @Autowired
    private ExameLabService service;

    @GetMapping("/atendimento/{atendimentoId}")
    public ResponseEntity<List<ExameLabDTO.Response>> listarPorAtendimento(@PathVariable Long atendimentoId) {
        return ResponseEntity.ok(service.listarPorAtendimento(atendimentoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExameLabDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ExameLabDTO.Response> inserir(@Valid @RequestBody ExameLabDTO.Request dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExameLabDTO.Response> alterar(
            @PathVariable Long id, @Valid @RequestBody ExameLabDTO.Request dto) {
        return ResponseEntity.ok(service.alterar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
