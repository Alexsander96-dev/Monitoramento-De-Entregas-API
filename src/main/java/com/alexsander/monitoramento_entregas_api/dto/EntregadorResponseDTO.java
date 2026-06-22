package com.alexsander.monitoramento_entregas_api.dto;

import com.alexsander.monitoramento_entregas_api.model.StatusEntregador;

public record EntregadorResponseDTO(Long id,
                                    String nome,
                                    String telefone,
                                    StatusEntregador status) {
}
