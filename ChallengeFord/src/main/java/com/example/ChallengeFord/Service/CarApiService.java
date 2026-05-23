package com.example.ChallengeFord.Service;

import com.example.ChallengeFord.Client.CarApiClient;
import com.example.ChallengeFord.Model.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CarApiService {

    private final CarApiClient client;

    public CarApiService(CarApiClient client) {
        this.client = client;
    }

    @Cacheable(value = "trucks",
               key = "(#filter.make ?: '') + '-' + (#filter.model ?: '') + '-' + (#filter.trim ?: '') + '-' + #page")
    public CarTruckResponse getAll(CarFilterDTO filter, int page) {
        CarTruckResponse response = client.getTruckPageWithFilter(filter, page);

        if (response == null || response.getData() == null) {
            return new CarTruckResponse();
        }

        List<CarTruckDTO> carrosFiltrados = removeDuplicados(response.getData());
        response.setData(carrosFiltrados);
        return response;
    }

    @Cacheable(value = "carDetails", key = "#id")
    public CarDetailsDTO getCarDetails(String id) {
        CarDetailsResponse response = client.getCarDetails(id);
        if (response == null) {
            return new CarDetailsDTO();
        }
        return mapToDTO(response);
    }

    public CarDetailsDTO mapToDTO(CarDetailsResponse api) {
        CarDetailsDTO dto = new CarDetailsDTO();

        dto.setMake(api.getMake());
        dto.setModel(api.getModel());
        dto.setTrim(api.getTrim());
        dto.setYear(api.getYear());

        if (api.getEngines() != null && !api.getEngines().isEmpty()) {
            var engine = api.getEngines().get(0);
            dto.setMotor(
                engine.getEngineType() + " " +
                engine.getSize() + "L " +
                engine.getCylinders()
            );
            dto.setPotencia(engine.getHorsepowerHp());
            dto.setTorqueMax(engine.getTorqueFtLbs());
        }

        if (api.getBodies() != null && !api.getBodies().isEmpty()) {
            dto.setType(api.getBodies().get(0).getType());
        }

        if (api.getTransmissions() != null && !api.getTransmissions().isEmpty()) {
            dto.setTransmissao(api.getTransmissions().get(0).getDescription());
        }

        if (api.getDriveTypes() != null && !api.getDriveTypes().isEmpty()) {
            dto.setTracao(api.getDriveTypes().get(0).getDescription());
        }

        dto.setPreco(api.getMsrp());
        dto.setZeroACem(null);
        dto.setAmortecedores(null);
        dto.setModosConducao(null);
        dto.setModosVolante(null);
        dto.setModosEscapamento(null);
        dto.setModosAmortecedor(null);
        dto.setFarois(null);
        dto.setRodasPneus(null);

        return dto;
    }

    private List<CarTruckDTO> removeDuplicados(List<CarTruckDTO> cars) {
        Set<String> seen = new HashSet<>();
        return cars.stream()
                .filter(car -> seen.add(
                    car.getYear() + "-" +
                    safeField(car.getMake()) + "-" +
                    safeField(car.getModel()) + "-" +
                    safeField(car.getTrim()) + "-" +
                    safeField(car.getType())
                ))
                .toList();
    }

    private static String safeField(String val) {
        return val != null ? val.trim().toLowerCase() : "";
    }
}
