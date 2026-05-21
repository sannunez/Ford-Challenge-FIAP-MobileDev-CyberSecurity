package com.example.ChallengeFord.Model;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarFilterDTO {

    // Previne injeção de parâmetros na URL: aceita apenas alfanuméricos, espaços e hífens, máximo 50 chars
    @Size(max = 50, message = "Invalid parameter")
    @Pattern(regexp = "^[a-zA-Z0-9 \\-]*$", message = "Invalid parameter")
    private String make;

    @Size(max = 50, message = "Invalid parameter")
    @Pattern(regexp = "^[a-zA-Z0-9 \\-]*$", message = "Invalid parameter")
    private String model;

    @Size(max = 50, message = "Invalid parameter")
    @Pattern(regexp = "^[a-zA-Z0-9 \\-]*$", message = "Invalid parameter")
    private String trim;
}
