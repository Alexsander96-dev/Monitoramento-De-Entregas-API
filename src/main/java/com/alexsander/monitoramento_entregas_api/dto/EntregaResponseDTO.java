package com.alexsander.monitoramento_entregas_api.dto;

import com.alexsander.monitoramento_entregas_api.model.StatusEntrega;
import com.alexsander.monitoramento_entregas_api.model.StatusEntregador;

import java.time.LocalDateTime;

public record EntregaResponseDTO(Long id,
                                 Long pedidoId,
                                 Long entregadorId,
                                 StatusEntrega status,
                                 LocalDateTime dataInicio,
                                 LocalDateTime dataConclusao) {
}
