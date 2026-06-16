package com.saude.api.controller;

import com.saude.api.dto.ProfissionalDeSaudeDTO;
import com.saude.api.entity.CategoriaProfissional;
import com.saude.api.service.ProfissionalDeSaudeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/profissionais")
@RequiredArgsConstructor
public class ProfissionalDeSaudeController {

    @Autowired
    private ProfissionalDeSaudeService service;

    @GetMapping
    public ResponseEntity<List<ProfissionalDeSaudeDTO.Response>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfissionalDeSaudeDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProfissionalDeSaudeDTO.Response>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.buscarPorNome(nome));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ProfissionalDeSaudeDTO.Response>> buscarPorCategoria(
            @PathVariable CategoriaProfissional categoria) {
        return ResponseEntity.ok(service.buscarPorCategoria(categoria));
    }

    @PostMapping
    public ResponseEntity<ProfissionalDeSaudeDTO.Response> inserir(
            @Valid @RequestBody ProfissionalDeSaudeDTO.Request dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfissionalDeSaudeDTO.Response> alterar(
            @PathVariable Long id, @Valid @RequestBody ProfissionalDeSaudeDTO.Request dto) {
        return ResponseEntity.ok(service.alterar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
