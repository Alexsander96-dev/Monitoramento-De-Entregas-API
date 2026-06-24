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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


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

        boolean existeEntregaEmAberto = entregaRepository.existsByPedidoIdAndStatusIn(
                pedidoEncontrado.get().getId(), List.of(StatusEntrega.CRIADO, StatusEntrega.EM_ROTA));

        if (existeEntregaEmAberto) {
            throw new RuntimeException("Já existe uma entrega em andamento para este pedido.");
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

    public EntregaResponseDTO concluirEntrega(Long id){
        Optional<Entrega> entrega = entregaRepository.findById(id);
        if (entrega.isEmpty()){
            throw new RuntimeException("Entrega não encontrada");
        }

        Entrega entregaEncontrada = entrega.get();
        Pedido pedido = entregaEncontrada.getPedido();
        Entregador entregador = entregaEncontrada.getEntregador();

        if (entregaEncontrada.getStatus() != StatusEntrega.EM_ROTA){
            throw new RuntimeException("ERRO: Entrega só pode ser concluida se estiver status de EM_ROTA!");
        }

        if (pedido.getStatus() != StatusPedido.EM_ROTA){
            throw new RuntimeException("ERRO: Pedido so pode ser concluido se estiver em status EM_ROTA!");
        }

        entregaEncontrada.setStatus(StatusEntrega.ENTREGUE);
        pedido.setStatus(StatusPedido.ENTREGUE);
        entregador.setStatus(StatusEntregador.DISPONIVEL);
        entregaEncontrada.setDataConclusao(LocalDateTime.now());

        Entrega entregaAtualizada = entregaRepository.save(entregaEncontrada);

        return new EntregaResponseDTO(entregaAtualizada.getId(),
                entregaAtualizada.getPedido().getId(),
                entregaAtualizada.getEntregador().getId(),
                entregaAtualizada.getStatus(),
                entregaAtualizada.getDataInicio(),
                entregaAtualizada.getDataConclusao());

    }

    public EntregaResponseDTO cancelarEntrega(Long id){
        Optional<Entrega> entrega = entregaRepository.findById(id);

        if (entrega.isEmpty()){
            throw new RuntimeException("Entrega não encontrada");
        }

        Entrega entregaEncontrada = entrega.get();
        Pedido pedido = entregaEncontrada.getPedido();
        Entregador entregador = entregaEncontrada.getEntregador();

        if (entregaEncontrada.getStatus() != StatusEntrega.CRIADO){
            throw new RuntimeException("ERRO: Entrega esta com status diferente de CRIADO");
        }

        entregaEncontrada.setStatus(StatusEntrega.CANCELADO);
        pedido.setStatus(StatusPedido.PENDENTE);
        entregador.setStatus(StatusEntregador.DISPONIVEL);
        entregaEncontrada.setDataConclusao(LocalDateTime.now());

        Entrega entregaCancelada = entregaRepository.save(entregaEncontrada);
        return  new EntregaResponseDTO(entregaCancelada.getId(),
                entregaCancelada.getPedido().getId(),
                entregaCancelada.getEntregador().getId(),
                entregaCancelada.getStatus(),
                entregaCancelada.getDataInicio(),
                entregaCancelada.getDataConclusao());
    }

    public EntregaResponseDTO registrarFalhaNaEntrega(Long id){
        Optional<Entrega> entrega = entregaRepository.findById(id);

        if (entrega.isEmpty()){
            throw new RuntimeException("Entrega não encontrada");
        }

        Entrega entregaEncontrada = entrega.get();
        Pedido pedido = entregaEncontrada.getPedido();
        Entregador entregador = entregaEncontrada.getEntregador();

        if (entregaEncontrada.getStatus() != StatusEntrega.EM_ROTA){
            throw new RuntimeException("Só entregas em rota pode ter falha");
        }

        if (pedido.getStatus() != StatusPedido.EM_ROTA){
            throw new RuntimeException("Só pedidos em rota que pode ter falha");
        }

        entregaEncontrada.setStatus(StatusEntrega.FALHA);
        pedido.setStatus(StatusPedido.FALHA);
        entregador.setStatus(StatusEntregador.DISPONIVEL);
        entregaEncontrada.setDataConclusao(LocalDateTime.now());

        Entrega entregaComFalha = entregaRepository.save(entregaEncontrada);

        return  new EntregaResponseDTO(entregaComFalha.getId(),
                entregaComFalha.getPedido().getId(),
                entregaComFalha.getEntregador().getId(),
                entregaComFalha.getStatus(),
                entregaComFalha.getDataInicio(),
                entregaComFalha.getDataConclusao());
    }

    public List<EntregaResponseDTO> listarEntregas(){
        List<Entrega> entregasEncontradas = entregaRepository.findAll();

        List<EntregaResponseDTO> entregas = entregasEncontradas.stream()
                .map(entrega -> {
                    Long entregadorId = entrega.getEntregador() != null ? entrega.getEntregador().getId() : null;
                    return new EntregaResponseDTO(
                            entrega.getId(),
                            entrega.getPedido().getId(),
                            entregadorId,
                            entrega.getStatus(),
                            entrega.getDataInicio(),
                            entrega.getDataConclusao()
                    );
                })
                .collect(Collectors.toList());

        return entregas;
    }

    public EntregaResponseDTO buscarEntregaPorId(Long id){
        Optional<Entrega> entrega = entregaRepository.findById(id);

        if (entrega.isEmpty()){
            throw new RuntimeException("Entrega não encontrada");
        }

        Entrega entregaValida = entrega.get();

        Long entregadorId = entregaValida.getEntregador() != null ? entregaValida.getEntregador().getId() : null;

        return new EntregaResponseDTO(
                entregaValida.getId(),
                entregaValida.getPedido().getId(),
                entregadorId,
                entregaValida.getStatus(),
                entregaValida.getDataInicio(),
                entregaValida.getDataConclusao()
        );

    }
}