package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.EntregaRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregaResponseDTO;
import com.alexsander.monitoramento_entregas_api.model.*;
import com.alexsander.monitoramento_entregas_api.repository.EntregaRepository;
import com.alexsander.monitoramento_entregas_api.repository.EntregadorRepository;
import com.alexsander.monitoramento_entregas_api.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.Optional;


@Service
public class EntregaService {

    @Autowired
    private EntregaRepository entregaRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private EntregadorRepository entregadorRepository;

    public EntregaResponseDTO criarEntrega(EntregaRequestDTO dto) {
        //Busca entregador e pedido pelo id
        Optional<Entregador> entregadorEncontrado = entregadorRepository.findById(dto.entregadorId());
        Optional<Pedido> pedidoEncontrado = pedidoRepository.findById(dto.pedidoId());

        //verifica se pedido existe e status da entrega nao pode ser ENTREGUE e CANCELADO
        if (pedidoEncontrado.isEmpty()) {
            throw new RuntimeException("Pedido não encontrado!");
        } else if (pedidoEncontrado.get().getStatus() != StatusPedido.PENDENTE) {
            throw new RuntimeException("Entrega não pode ser criada pois pedido esta: " + pedidoEncontrado.get().getStatus());
        }

        //verifica se entregador existe e status do entregado nao pode ser EM_ENTREGA e OFFLINE
        if (entregadorEncontrado.isEmpty()) {
            throw new RuntimeException("Entregador não encontrado!");
        } else if (entregadorEncontrado.get().getStatus() != StatusEntregador.DISPONIVEL) {
            throw new RuntimeException("Entregador não pode ser colocado nessa entrega pois esta: " + entregadorEncontrado.get().getStatus());
        }

        Entrega entrega = new Entrega();

        entrega.setPedido(pedidoEncontrado.get());
        entrega.setEntregador(entregadorEncontrado.get());
        entrega.setStatus(StatusEntrega.CRIADO);

        entregaRepository.save(entrega);

        return new EntregaResponseDTO(entrega.getId(),
                entrega.getPedido().getId(),
                entrega.getEntregador().getId(),
                entrega.getStatus(),
                entrega.getDataInicio(),
                entrega.getDataConclusao());
    }


    public EntregaResponseDTO iniciarEntrega(Long id) {

        Optional<Entrega> entregaEncontrada = entregaRepository.findById(id);
        if (entregaEncontrada.isEmpty()) {
            throw new RuntimeException("Entrega não encontrada");
        }

        Entrega entrega = entregaEncontrada.get();
        Pedido pedido = entrega.getPedido();
        Entregador entregador = entrega.getEntregador();


        if (entrega.getStatus() != StatusEntrega.CRIADO) {
            throw new RuntimeException("Entrega não pode ser iniciada. Status atual da entrega: " + entrega.getStatus());
        }

        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new RuntimeException("Entrega não pode ser iniciada. Status atual do pedido: " + pedido.getStatus());
        }

        if (entregador.getStatus() != StatusEntregador.DISPONIVEL) {
            throw new RuntimeException("Entrega não pode ser iniciada. Status atual do entregador: " + entregador.getStatus());
        }


        pedido.setStatus(StatusPedido.EM_ROTA);
        entrega.setStatus(StatusEntrega.EM_ROTA);
        entregador.setStatus(StatusEntregador.EM_ENTREGA);
        entrega.setDataInicio(LocalDateTime.now());

        entregadorRepository.save(entregador);
        pedidoRepository.save(pedido);
        Entrega entregaSalva = entregaRepository.save(entrega);

        return new EntregaResponseDTO(entregaSalva.getId(),
                entregaSalva.getPedido().getId(),
                entregaSalva.getEntregador().getId(),
                entregaSalva.getStatus(),
                entregaSalva.getDataInicio(),
                entregaSalva.getDataConclusao());

    }
}