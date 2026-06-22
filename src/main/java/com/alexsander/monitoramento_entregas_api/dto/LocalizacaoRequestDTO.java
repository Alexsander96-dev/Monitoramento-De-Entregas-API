package com.alexsander.monitoramento_entregas_api.dto;

public record LocalizacaoRequestDTO(String latitude,
                                    String longitude,
                                    Long entregaId) {
}
