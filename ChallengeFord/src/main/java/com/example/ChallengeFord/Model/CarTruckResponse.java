package com.example.ChallengeFord.Model;

import lombok.Getter;
import lombok.Setter;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
public class CarTruckResponse {
    private CollectionDTO collection;
    private List<CarTruckDTO> data;
}
