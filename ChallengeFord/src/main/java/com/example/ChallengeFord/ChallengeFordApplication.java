package com.example.ChallengeFord;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

// Exclude default UserDetailsServiceAutoConfiguration — auth is handled exclusively via JWT
@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
public class ChallengeFordApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChallengeFordApplication.class, args);
	}

}
