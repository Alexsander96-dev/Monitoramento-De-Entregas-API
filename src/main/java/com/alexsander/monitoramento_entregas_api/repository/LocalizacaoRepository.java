package com.alexsander.monitoramento_entregas_api.repository;

import com.alexsander.monitoramento_entregas_api.model.Localizacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalizacaoRepository extends JpaRepository<Localizacao,Long> {
}
