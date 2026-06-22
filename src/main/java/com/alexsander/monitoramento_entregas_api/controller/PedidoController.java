package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.PedidoRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.PedidoResponseDTO;
import com.alexsander.monitoramento_entregas_api.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private  PedidoService service;

    @PostMapping
    public PedidoResponseDTO criarPedido(@RequestBody PedidoRequestDTO dto){
        return service.criarPedido(dto);
    }

    @GetMapping
    public List<PedidoResponseDTO> listarPedidos(){
      return service.listarPedidos();
    }

    @GetMapping("/{id}")
    public PedidoResponseDTO buscarPedidoPorId(@PathVariable Long id){
       return service.buscarPedidoPorId(id);
    }

    @PutMapping("/{id}")
    public PedidoResponseDTO atualizarPedidoPorId(@PathVariable Long id, @RequestBody PedidoRequestDTO dto){
        return service.atualizarPedido(id,dto);
    }

    @DeleteMapping("/{id}")
    public void deletarPedido(@PathVariable Long id){
        service.deletarPedido(id);
    }

}
