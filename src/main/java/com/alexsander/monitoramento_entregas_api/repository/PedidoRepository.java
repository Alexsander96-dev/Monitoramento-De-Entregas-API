package com.alexsander.monitoramento_entregas_api.repository;

import com.alexsander.monitoramento_entregas_api.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
