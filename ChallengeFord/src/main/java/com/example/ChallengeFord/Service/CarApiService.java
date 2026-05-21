package com.example.ChallengeFord.Service;

import com.example.ChallengeFord.Client.CarApiClient;
import com.example.ChallengeFord.Model.*;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CarApiService {
    private CarApiClient client;

    public CarApiService(CarApiClient client){
        this.client = client;
    }

    public CarTruckResponse getAll(CarFilterDTO filter, int page){

        CarTruckResponse response = client.getTruckPageWithFilter(filter, page);

        List<CarTruckDTO> carrosFiltrados = removeDuplicados(response.getData());

        response.setData(carrosFiltrados);

        return response;
    }

    public CarDetailsDTO getCarDetails(String id){
        CarDetailsResponse response = client.getCarDetails(id);

        if(response == null){
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

        // ENGINE
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

        // TYPE
        if(api.getBodies() != null && !api.getBodies().isEmpty()) {
            dto.setType(api.getBodies().get(0).getType());
        }

        // TRANSMISSION
        if (api.getTransmissions() != null && !api.getTransmissions().isEmpty()) {
            dto.setTransmissao(api.getTransmissions().get(0).getDescription());
        }

        // DRIVE TYPE
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

    private List<CarTruckDTO> removeDuplicados(List<CarTruckDTO> cars){

        Set<String> seen = new HashSet<>();

        return cars.stream()
                .filter(car -> {

                    String key =
                                    car.getYear() + "-" +
                                    car.getMake().trim().toLowerCase() + "-" +
                                    car.getModel().trim().toLowerCase() + "-" +
                                    car.getTrim().trim().toLowerCase() + "-" +
                                    car.getType().trim().toLowerCase();

                    return seen.add(key);
                })
                .toList();
    }

}
