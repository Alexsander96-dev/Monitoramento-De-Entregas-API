package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.EntregadorRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregadorResponseDTO;
import com.alexsander.monitoramento_entregas_api.service.EntregadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entregadores")
public class EntregadorController {

    @Autowired
    private EntregadorService servico;

    @PostMapping
    public EntregadorResponseDTO criarEntregador(@RequestBody EntregadorRequestDTO dto){
        return servico.criarEntregador(dto);
    }

    @GetMapping
    public List<EntregadorResponseDTO> listarEntregadores(){
        return servico.listarEntregadores();
    }

    @GetMapping("/{id}")
    public EntregadorResponseDTO buscarEntregadorPorId(@PathVariable Long id){
        return servico.buscarEntregadorPorId(id);
    }

    @PutMapping("/{id}")
    public EntregadorResponseDTO atualizarEntregador(@PathVariable Long id, @RequestBody EntregadorRequestDTO dto){
        return servico.atualizarEntregador(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletarEntregador(@PathVariable Long id){
        servico.deletarEntregador(id);
    }

}
