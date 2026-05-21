package com.example.ChallengeFord.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CollectionDTO {

    private String url;
    private int count;
    private int pages;
    private int total;
    private String next;
    private String prev;
    private String first;
    private String last;
}