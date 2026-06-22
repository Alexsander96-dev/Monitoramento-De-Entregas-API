package com.alexsander.monitoramento_entregas_api.dto;

import com.alexsander.monitoramento_entregas_api.model.StatusPedido;

import java.time.LocalDateTime;

public record PedidoResponseDTO(Long id,
                                String cliente,
                                String endereconEntrega,
                                StatusPedido status,
                                LocalDateTime dataCriacao) {
}
