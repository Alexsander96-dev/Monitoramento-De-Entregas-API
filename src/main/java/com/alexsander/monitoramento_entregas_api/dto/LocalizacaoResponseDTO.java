package com.alexsander.monitoramento_entregas_api.dto;

import java.time.LocalDateTime;

public record LocalizacaoResponseDTO(Long id,
                                     String latitude,
                                     String longitude,
                                     LocalDateTime dataHora,
                                     Long entregaId) {
}
