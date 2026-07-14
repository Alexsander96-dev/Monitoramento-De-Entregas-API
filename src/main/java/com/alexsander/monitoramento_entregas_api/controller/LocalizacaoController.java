package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoResponseDTO;
import com.alexsander.monitoramento_entregas_api.service.LocalizacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/localizacoes")
public class LocalizacaoController {

    @Autowired
    private LocalizacaoService service;

    @PostMapping
    public LocalizacaoResponseDTO criarLocalizacao(@RequestBody LocalizacaoRequestDTO dto){
        return service.criarLocalizacao(dto);
    }

    @GetMapping
    public List<LocalizacaoResponseDTO> listarLocalizacoes(){
        return service.listarLocalizacoes();
    }

    @GetMapping("/{id}")
    public LocalizacaoResponseDTO buscarLocalizacaoPorId(@PathVariable Long id){
        return service.buscarLocalizacaoPorId(id);
    }

    @GetMapping("/entrega/{entregaId}")
    public List<LocalizacaoResponseDTO> listarLocalizacaoPorEntrega(@PathVariable Long entregaId){
        return service.listarLocalizacaoPorEntrega(entregaId);
    }
}
