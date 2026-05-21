package com.example.ChallengeFord.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarDetailsDTO {
    // Features extras importantes de se exibir
    private String make;
    private String model;
    private String trim;
    private String type;

    // Features Existentes na API que batem com dados requeridos pela FORD
    private String motor;      // ex: "V6 3.0L Bi-Turbo"
    private Integer potencia;  // horsepower_hp
    private Integer torqueMax; // torque_ft_lbs

    private String transmissao; // transmission
    private String tracao;      // drive_type

    private Integer preco;      // msrp

    private Integer year;        // year

    // Features não disponíveis na CAR API (mantidas para futuro/UI)
    private Double zeroACem;
    private String amortecedores;
    private String[] modosConducao;
    private String[] modosVolante;
    private String[] modosEscapamento;
    private String[] modosAmortecedor;
    private String farois;
    private String rodasPneus;
}

