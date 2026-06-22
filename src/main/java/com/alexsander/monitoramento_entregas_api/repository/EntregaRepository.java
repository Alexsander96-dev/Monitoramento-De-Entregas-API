package com.alexsander.monitoramento_entregas_api.repository;

import com.alexsander.monitoramento_entregas_api.model.Entrega;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {
}
