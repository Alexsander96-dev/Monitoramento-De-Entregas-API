package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.EntregaRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregaResponseDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregadorRequestDTO;
import com.alexsander.monitoramento_entregas_api.service.EntregaService;
import com.alexsander.monitoramento_entregas_api.service.EntregadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entregas")
public class EntregaController {

    @Autowired
    private EntregaService service;

    @PostMapping
    public EntregaResponseDTO criarEntrega(@RequestBody EntregaRequestDTO dto){
        return service.criarEntrega(dto);
    }

    @GetMapping
    public List<EntregaResponseDTO> listarEntregas(){
        return service.listarEntregas();
    }

    @GetMapping("/{id}")
    public EntregaResponseDTO buscarEntregaPorId(@PathVariable Long id){
        return service.buscarEntregaPorId(id);
    }

    @PutMapping("/{id}/iniciar")
    public EntregaResponseDTO iniciarEntrega(@PathVariable Long id){
        return service.iniciarEntrega(id);
    }

    @PutMapping("/{id}/concluir")
    public EntregaResponseDTO concluirEntrega(@PathVariable Long id){
        return service.concluirEntrega(id);
    }

    @PutMapping("/{id}/cancelar")
    public EntregaResponseDTO cancelarEntrega(@PathVariable Long id){
        return service.cancelarEntrega(id);
    }

    @PutMapping("/{id}/falha")
    public EntregaResponseDTO registrarFalhaNaEntrega(@PathVariable Long id){
        return service.registrarFalhaNaEntrega(id);
    }


}
