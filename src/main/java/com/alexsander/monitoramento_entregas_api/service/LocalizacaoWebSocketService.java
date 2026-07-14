package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoWebSocketRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoWebSocketResponseDTO;
import com.alexsander.monitoramento_entregas_api.model.Entrega;
import com.alexsander.monitoramento_entregas_api.model.Localizacao;
import com.alexsander.monitoramento_entregas_api.model.StatusEntrega;
import com.alexsander.monitoramento_entregas_api.repository.EntregaRepository;
import com.alexsander.monitoramento_entregas_api.repository.LocalizacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LocalizacaoWebSocketService {

    @Autowired
    EntregaRepository entregaRepository;

    @Autowired
    LocalizacaoRepository localizacaoRepository;

    public LocalizacaoWebSocketResponseDTO registrarLocalizacaoWebSocket(Long entregaId, LocalizacaoWebSocketRequestDTO dto){
        Optional<Entrega> entrega = entregaRepository.findById(entregaId);

        if (entrega.isEmpty()){
            throw new RuntimeException("Entrega não encontrada!");
        }
        Entrega entregaEncontrada = entrega.get();

        if (entregaEncontrada.getStatus() != StatusEntrega.EM_ROTA){
            throw new RuntimeException("Entrega nao foi iniciada");
        }
        validarCoordenadas(dto);

        Localizacao localizacao = new Localizacao();
        localizacao.setEntrega(entregaEncontrada);
        localizacao.setLatitude(dto.latitude());
        localizacao.setLongitude(dto.longitude());
        localizacao.setDataHora(LocalDateTime.now());

        Localizacao localizacaoSalva = localizacaoRepository.save(localizacao);

        return new LocalizacaoWebSocketResponseDTO
                (localizacaoSalva.getId(),
                localizacaoSalva.getEntrega().getId(),
                localizacaoSalva.getLatitude(),
                localizacaoSalva.getLongitude(),
                localizacaoSalva.getDataHora());
    }

    private void validarCoordenadas(LocalizacaoWebSocketRequestDTO dto){
        if (dto.latitude() == null || dto.latitude().isBlank()){
            throw new RuntimeException("Latitude não informada!");
        }

        if (dto.longitude() == null || dto.longitude().isBlank()){
            throw new RuntimeException("Longitude não informada!");
        }

        double longitude;
        double latitude;

        try {
            latitude = Double.parseDouble(dto.latitude());
            longitude = Double.parseDouble(dto.longitude());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Latitude e Longitude devem ser valores númericos!");
        }
        if (latitude < -90 || latitude > 90) {
            throw new RuntimeException("Latitude inválida! O valor deve estar entre -90 e 90.");
        }

        if (longitude < -180 || longitude > 180) {
            throw new RuntimeException("Longitude inválida! O valor deve estar entre -180 e 180.");
        }
    }
}
