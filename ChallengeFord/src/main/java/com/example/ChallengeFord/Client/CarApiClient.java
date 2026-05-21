package com.example.ChallengeFord.Client;

import com.example.ChallengeFord.Model.CarDetailsResponse;
import com.example.ChallengeFord.Model.CarFilterDTO;
import com.example.ChallengeFord.Model.CarTruckResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class CarApiClient {

    private static final Logger log = LoggerFactory.getLogger(CarApiClient.class);

    private final RestTemplate restTemplate;

    private static final String BASE_URL = "https://carapi.app/api/bodies/v2";
    private static final String BASE_DETAILS_URL = "https://carapi.app/api/trims/v2/{id}";

    // RestTemplate injetado do RestTemplateConfig (possui timeouts de conexão e leitura configurados)
    public CarApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CarTruckResponse getTruckPageWithFilter(CarFilterDTO filter, int page) {
        // UriComponentsBuilder codifica os parâmetros automaticamente, prevenindo injeção de parâmetros na URL
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(BASE_URL)
                .queryParam("type", "truck")
                .queryParam("page", page);

        if (filter.getMake() != null) builder.queryParam("make", filter.getMake());
        if (filter.getModel() != null) builder.queryParam("model", filter.getModel());
        if (filter.getTrim() != null) builder.queryParam("trim", filter.getTrim());

        String url = builder.toUriString();
        log.info("Fetching trucks | page={} make={} model={} trim={}", page, filter.getMake(), filter.getModel(), filter.getTrim());

        CarTruckResponse response = restTemplate.getForObject(url, CarTruckResponse.class);
        return response != null ? response : new CarTruckResponse();
    }

    public CarDetailsResponse getCarDetails(String id) {
        log.info("Fetching car details | id={}", id);
        return restTemplate.getForObject(BASE_DETAILS_URL, CarDetailsResponse.class, id);
    }
}
