package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoResponseDTO;
import com.alexsander.monitoramento_entregas_api.model.Entrega;
import com.alexsander.monitoramento_entregas_api.model.Localizacao;
import com.alexsander.monitoramento_entregas_api.model.StatusEntrega;
import com.alexsander.monitoramento_entregas_api.repository.EntregaRepository;
import com.alexsander.monitoramento_entregas_api.repository.LocalizacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LocalizacaoService {

    @Autowired
    private LocalizacaoRepository localizacaoRepository;

    @Autowired
    private EntregaRepository entregaRepository;


    public LocalizacaoResponseDTO criarLocalizacao(LocalizacaoRequestDTO dto){
        Optional<Entrega> entregaEncontrada = entregaRepository.findById(dto.entregaId());

        if (entregaEncontrada.isEmpty()){
            throw new RuntimeException("Entrega não encontrada");
        }

        Entrega entrega = entregaEncontrada.get();

        if (entrega.getStatus() != StatusEntrega.EM_ROTA){
            throw new RuntimeException("Só e possivel registrar uma localização com uma entrega EM_ROTA");
        }

        Localizacao localizacao = new Localizacao();

        localizacao.setEntrega(entrega);

        localizacao.setLatitude(dto.latitude());
        localizacao.setLongitude(dto.longitude());
        localizacao.setDataHora(LocalDateTime.now());

        Localizacao localizacaoSalva = localizacaoRepository.save(localizacao);

        return new LocalizacaoResponseDTO(localizacaoSalva.getId(),
                localizacaoSalva.getLatitude(),
                localizacaoSalva.getLongitude(),
                localizacaoSalva.getDataHora(),
                localizacaoSalva.getEntrega().getId());
    }

    public List<LocalizacaoResponseDTO> listarLocalizacoes(){
        List<Localizacao> localizacoesEncontradas = localizacaoRepository.findAll();

        return localizacoesEncontradas.stream()
                .map(localizacao -> new LocalizacaoResponseDTO(localizacao.getId(),
                        localizacao.getLatitude(),
                        localizacao.getLongitude(),
                        localizacao.getDataHora(),
                        localizacao.getEntrega().getId()))
                .collect(Collectors.toList());
    }

    public LocalizacaoResponseDTO buscarLocalizacaoPorId(Long id){
        Optional<Localizacao> localizacao = localizacaoRepository.findById(id);

        if (localizacao.isEmpty()){
            throw new RuntimeException("Localização não encontrada!");
        }

        Localizacao localizacaoEncontrada = localizacao.get();

        return new LocalizacaoResponseDTO(localizacaoEncontrada.getId(),
                localizacaoEncontrada.getLatitude(),
                localizacaoEncontrada.getLongitude(),
                localizacaoEncontrada.getDataHora(),
                localizacaoEncontrada.getEntrega().getId());
    }

    public List<LocalizacaoResponseDTO> listarLocalizacaoPorEntrega(Long entregaId) {
        Optional<Entrega> entrega = entregaRepository.findById(entregaId);

        if (entrega.isEmpty()) {
            throw new RuntimeException("Entrega não encontrada!");
        }

       List<Localizacao> listaDeLocalizacoes = localizacaoRepository.findByEntregaId(entregaId);

        return listaDeLocalizacoes.stream()
                .map(localizacao -> new LocalizacaoResponseDTO(localizacao.getId(),
                        localizacao.getLatitude(),
                        localizacao.getLongitude(),
                        localizacao.getDataHora(),
                        localizacao.getEntrega().getId()))
                .collect(Collectors.toList());
    }

}

