package com.alexsander.monitoramento_entregas_api.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "localizacoes")
public class Localizacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String latitude;
    private String longitude;

    private LocalDateTime dataHora;

    @ManyToOne
    private Entrega entrega;

}
