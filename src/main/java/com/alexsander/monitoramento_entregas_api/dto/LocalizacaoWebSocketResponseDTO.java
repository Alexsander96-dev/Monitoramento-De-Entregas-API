package com.alexsander.monitoramento_entregas_api.dto;

import java.time.LocalDateTime;

public record LocalizacaoWebSocketResponseDTO(Long localizacaoId, Long entregaId,
                                              String latitude, String longitude,
                                              LocalDateTime dataHora) {
}
