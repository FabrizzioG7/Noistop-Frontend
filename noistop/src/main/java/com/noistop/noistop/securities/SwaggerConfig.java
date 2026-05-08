package com.noistop.noistop.securities;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI noistopOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("NoiStop API")
                        .description("API REST para gestión de reportes de contaminación sonora. " +
                                "Cubre las historias de usuario US01-US33 del proyecto NoiStop.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo NoiStop")
                                .email("noistop@ejemplo.com")));
    }
}
