package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.EntregadorRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregadorResponseDTO;
import com.alexsander.monitoramento_entregas_api.model.Entregador;
import com.alexsander.monitoramento_entregas_api.model.StatusEntregador;
import com.alexsander.monitoramento_entregas_api.repository.EntregadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EntregadorService {
    @Autowired
    EntregadorRepository repositorio;

    public EntregadorResponseDTO criarEntregador(EntregadorRequestDTO dto){
        //Criar entidade Entregador
        Entregador entregador = new Entregador();

        //Transformando o dto em entidade entregador
        entregador.setNome(dto.nome());
        entregador.setTelefone(dto.telefone());
        //Setando caracteristicas padrao
        entregador.setStatus(StatusEntregador.DISPONIVEL);

        //Chamando repositorio para salvar o novo entregador
        Entregador entregadorSalvo = repositorio.save(entregador);

        //Transforma a entidade entregador em ResponseDTO e retorna
        return new EntregadorResponseDTO(entregadorSalvo.getId(),entregadorSalvo.getNome(),
                entregador.getTelefone(), entregadorSalvo.getStatus());
    }

    public List<EntregadorResponseDTO> listarEntregadores(){
        //Chamando o repositorio para listar os entregadores cadastrado no BD
        List<Entregador> entregadoresEntrados = repositorio.findAll();

        //Transformando a lista de entregador em uma lista de EntregadorResponseDTO
        List<EntregadorResponseDTO> entregadores = entregadoresEntrados.stream()
                .map(entregador -> new EntregadorResponseDTO(entregador.getId(),
                        entregador.getNome(), entregador.getTelefone(), entregador.getStatus()))
                .collect(Collectors.toList());
        return entregadores;
    }

    public EntregadorResponseDTO buscarEntregadorPorId(Long id){
        //Busca no BD o entregador pelo Id
        Optional<Entregador> entregador = repositorio.findById(id);

        //Se o entregador estiver presente no BD retorna a conversao
        //da entidade entregador para entidade EntregadorResponseDTO
        //senao achar por enquanto retorna um RuntimeException
        if (entregador.isPresent()){
            Entregador entregadorEncontrado = entregador.get();
            return new EntregadorResponseDTO(entregadorEncontrado.getId(), entregadorEncontrado.getNome(),
                    entregadorEncontrado.getTelefone(),entregadorEncontrado.getStatus());
        }
        throw new RuntimeException("Entregador não encontrado");
    }

    public EntregadorResponseDTO atualizarEntregador(Long id, EntregadorRequestDTO dto){
        //Busca no BD o entregador pelo Id
       Optional<Entregador> entregador = repositorio.findById(id);

       //Verifica se no BD pelo id se entregador esta vazio
       if (entregador.isEmpty()){
          // se está vazio lança uma exception
           throw new RuntimeException("Entregador não encontrado");
       }
       //senao esta vazio, peda o entregador e salva na variavel
       Entregador entregadorEncontrado = entregador.get();
       //Setando o nome e o telefone vindo da requisiçao do DTO
       entregadorEncontrado.setNome(dto.nome());
       entregadorEncontrado.setTelefone(dto.telefone());
       //Salva o entregador com os novos dados
       Entregador entregadorAtualizado = repositorio.save(entregadorEncontrado);
       //Devolve o entregador atualizado com a entidade Entregador transformada em EntregadorResponseDTO
       return new EntregadorResponseDTO(entregadorAtualizado.getId(), entregadorAtualizado.getNome(),
               entregadorAtualizado.getTelefone(), entregadorAtualizado.getStatus());
    }

    public void deletarEntregador(Long id){
        Optional<Entregador> entregador = repositorio.findById(id);

        if (entregador.isEmpty()){
            throw new RuntimeException("Entregador não encontrado");
        }
        Entregador entregadorEncontrado = entregador.get();
        repositorio.delete(entregadorEncontrado);
    }
}
