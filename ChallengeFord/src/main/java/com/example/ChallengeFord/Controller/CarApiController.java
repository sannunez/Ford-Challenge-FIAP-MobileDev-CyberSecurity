package com.example.ChallengeFord.Controller;

import com.example.ChallengeFord.Model.CarDetailsDTO;
import com.example.ChallengeFord.Model.CarFilterDTO;
import com.example.ChallengeFord.Model.CarTruckResponse;
import com.example.ChallengeFord.Service.CarApiService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("cars")
@Validated
public class CarApiController {

    private static final Logger log = LoggerFactory.getLogger(CarApiController.class);

    private final CarApiService service;

    public CarApiController(CarApiService service) {
        this.service = service;
    }

    // @Valid aciona a Bean Validation nos campos do CarFilterDTO antes de a requisição chegar ao service
    @GetMapping
    public CarTruckResponse getAll(
            @Valid CarFilterDTO filter,
            @RequestParam(defaultValue = "1") int page)
    {
        if (page < 1) page = 1;
        log.info("GET /cars | page={} make={} model={}", page, filter.getMake(), filter.getModel());
        return service.getAll(filter, page);
    }

    // @Pattern rejeita IDs não numéricos antes de chegarem à chamada da API externa
    @GetMapping("/{id}")
    public CarDetailsDTO getCarDetails(
            @PathVariable @Pattern(regexp = "^[0-9]+$", message = "Invalid ID") String id)
    {
        log.info("GET /cars/{}", id);
        return service.getCarDetails(id);
    }
}
