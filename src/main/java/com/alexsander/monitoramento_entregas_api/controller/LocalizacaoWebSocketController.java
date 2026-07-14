package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoWebSocketRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoWebSocketResponseDTO;
import com.alexsander.monitoramento_entregas_api.service.LocalizacaoWebSocketService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
public class LocalizacaoWebSocketController {

    private final LocalizacaoWebSocketService service;
    private final SimpMessagingTemplate messagingTemplate;

    public LocalizacaoWebSocketController(
            LocalizacaoWebSocketService service,
            SimpMessagingTemplate messagingTemplate) {

        this.service = service;
        this.messagingTemplate = messagingTemplate;
    }


    @MessageMapping("/entregas/{entregaId}/localizacao")
    public void receberLocalizacao(@DestinationVariable Long entregaId, LocalizacaoWebSocketRequestDTO dto){
        LocalizacaoWebSocketResponseDTO response = service.registrarLocalizacaoWebSocket(entregaId, dto);

        String destino = "/topic/entregas/" + entregaId;

        messagingTemplate.convertAndSend(destino,response);
    }
}
