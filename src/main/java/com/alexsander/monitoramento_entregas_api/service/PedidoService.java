package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.PedidoRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.PedidoResponseDTO;
import com.alexsander.monitoramento_entregas_api.model.Pedido;
import com.alexsander.monitoramento_entregas_api.model.StatusPedido;
import com.alexsander.monitoramento_entregas_api.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    PedidoRepository repositorio;
                                    //receber o pedido
     public PedidoResponseDTO criarPedido(PedidoRequestDTO dto){
         //Criar entidade
         Pedido pedido = new Pedido();

         //converter dto para entidade
         pedido.setCliente(dto.cliente());
         pedido.setEnderecoEntrega(dto.enderecoEntrega());

         //Pedido criado ja comeca como pendente automatico
         //depois cria a data no momento da criacao automatico pelo sistema
         pedido.setStatus(StatusPedido.PENDENTE);
         pedido.setDataCriacao(LocalDateTime.now());

         //salvar no  banco
        Pedido pedidoSalvo = repositorio.save(pedido);

        //retorno do metodo
         return new PedidoResponseDTO(pedidoSalvo.getId(), pedidoSalvo.getCliente(), pedidoSalvo.getEnderecoEntrega(),
                 pedidoSalvo.getStatus(),pedidoSalvo.getDataCriacao());

     }

    public List<PedidoResponseDTO> listarPedidos(){
        List<Pedido> pedidosEncontrados = repositorio.findAll();

     List<PedidoResponseDTO> pedidos =  pedidosEncontrados.stream()
                .map(pedido -> new PedidoResponseDTO(pedido.getId(), pedido.getCliente(), pedido.getEnderecoEntrega(),
                        pedido.getStatus(),pedido.getDataCriacao()))
                .collect(Collectors.toList());
     return pedidos;
    }

   public PedidoResponseDTO buscarPedidoPorId(Long id){
         Optional<Pedido> pedido = repositorio.findById(id);
         if (pedido.isPresent()){
             Pedido pedidoEncontrado = pedido.get();
             return new PedidoResponseDTO(pedidoEncontrado.getId(),
                     pedidoEncontrado.getCliente(),
                     pedidoEncontrado.getEnderecoEntrega(),
                     pedidoEncontrado.getStatus(),
                     pedidoEncontrado.getDataCriacao());
         }
         throw new RuntimeException("Pedido não encontrado!");
     }

     public PedidoResponseDTO atualizarPedido(Long id, PedidoRequestDTO dto){
         Optional<Pedido> pedido = repositorio.findById(id);
         if (pedido.isEmpty()){
             throw new RuntimeException("Pedido não Encontrado!");
         }
             Pedido pedidoEncontrado = pedido.get();
             pedidoEncontrado.setCliente(dto.cliente());
             pedidoEncontrado.setEnderecoEntrega(dto.enderecoEntrega());
            Pedido atualizado = repositorio.save(pedidoEncontrado);
            return new PedidoResponseDTO(atualizado.getId(),
                    atualizado.getCliente(),
                    atualizado.getEnderecoEntrega(),
                    atualizado.getStatus(),
                    atualizado.getDataCriacao());

         }

         public void deletarPedido(Long id){
         Optional<Pedido> pedido = repositorio.findById(id);
             if (pedido.isEmpty()){
                 throw new RuntimeException("Pedido não Encontrado!");
             }
             Pedido pedidoEncontrado = pedido.get();
             repositorio.delete(pedidoEncontrado);
         }
}
