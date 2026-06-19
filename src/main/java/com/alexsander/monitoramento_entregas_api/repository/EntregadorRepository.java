package com.alexsander.monitoramento_entregas_api.repository;

import com.alexsander.monitoramento_entregas_api.model.Entregador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntregadorRepository extends JpaRepository<Entregador,Long> {
}
