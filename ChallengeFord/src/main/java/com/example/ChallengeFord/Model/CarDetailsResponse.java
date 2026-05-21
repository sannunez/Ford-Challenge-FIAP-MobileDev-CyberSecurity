package com.example.ChallengeFord.Model;


import lombok.Getter;
import lombok.Setter;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
public class CarDetailsResponse {

    // Identificação
    private String make;
    private String model;
    private String trim;

    // Motor / performance
    private List<Engine> engines;

    // Carroceria
    private List<Body> bodies;

    // Preco
    private Integer msrp;

    // Ano
    private Integer year;

    // Transmicao
    private List<Transmission> transmissions;

    // Tipo de Direcao
    @JsonProperty("drive_types")
    private List<DriveType> driveTypes;

    // Classe Internas =>
    @Getter
    @Setter
    public static class Engine {

        @JsonProperty("engine_type")
        private String engineType;

        private String size;

        private String cylinders;

        @JsonProperty("horsepower_hp")
        private Integer horsepowerHp;

        @JsonProperty("torque_ft_lbs")
        private Integer torqueFtLbs;
    }

    @Getter
    @Setter
    public static class Transmission {
        private String description;
    }

    @Getter
    @Setter
    public static class DriveType {
        private String description;
    }

    @Getter
    @Setter
    public static class Body {

        private String type;
    }
}



